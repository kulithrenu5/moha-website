import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const trailers = await db.trailer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: trailers });
  } catch (error) {
    console.error("Admin trailers fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch trailers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, videoId, description, category, isFeatured } = body;

    if (!title || title.trim().length < 3) {
      return NextResponse.json({ error: "Title must be at least 3 characters long." }, { status: 400 });
    }
    if (!videoId || videoId.trim().length < 5) {
      return NextResponse.json({ error: "YouTube Video ID is required." }, { status: 400 });
    }

    const created = await db.$transaction(async (tx) => {
      // If setting as featured, unfeature all others
      if (isFeatured) {
        await tx.trailer.updateMany({
          data: { isFeatured: false },
        });
      }

      const item = await tx.trailer.create({
        data: {
          title: title.trim(),
          videoId: videoId.trim(),
          description: description ? description.trim() : null,
          category: category || "Trailer",
          isFeatured: !!isFeatured,
        },
      });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Added trailer: "${title}" (ID: ${item.id})`,
        },
      });

      return item;
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("Admin trailer create error:", error);
    return NextResponse.json({ error: "Failed to create trailer" }, { status: 500 });
  }
}
