import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, imageUrl, category, isVideo, videoUrl } = body;

    if (!title || title.trim().length < 3) {
      return NextResponse.json({ error: "Title must be at least 3 characters long." }, { status: 400 });
    }
    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required." }, { status: 400 });
    }

    const existing = await db.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Gallery item not found." }, { status: 404 });
    }

    const updated = await db.$transaction(async (tx) => {
      const item = await tx.galleryItem.update({
        where: { id },
        data: {
          title: title.trim(),
          description: description ? description.trim() : null,
          imageUrl: imageUrl.trim(),
          category,
          isVideo: !!isVideo,
          videoUrl: isVideo ? videoUrl : null,
        },
      });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Updated gallery item: "${title}" (ID: ${id})`,
        },
      });

      return item;
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Admin gallery update error:", error);
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const existing = await db.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Gallery item not found." }, { status: 404 });
    }

    await db.$transaction(async (tx) => {
      await tx.galleryItem.delete({ where: { id } });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Deleted gallery item: "${existing.title}" (ID: ${id})`,
        },
      });
    });

    return NextResponse.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error("Admin gallery delete error:", error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}
