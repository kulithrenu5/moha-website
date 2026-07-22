import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const items = await db.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Admin gallery fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, category, isVideo, videoUrl } = body;

    if (!title || title.trim().length < 3) {
      return NextResponse.json({ error: "Title must be at least 3 characters long." }, { status: 400 });
    }
    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required." }, { status: 400 });
    }

    const created = await db.$transaction(async (tx) => {
      const item = await tx.galleryItem.create({
        data: {
          title: title.trim(),
          description: description ? description.trim() : null,
          imageUrl: imageUrl.trim(),
          category: category || "screenshot",
          isVideo: !!isVideo,
          videoUrl: isVideo ? videoUrl : null,
        },
      });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Added gallery item: "${title}" (ID: ${item.id})`,
        },
      });

      return item;
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("Admin gallery create error:", error);
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}
