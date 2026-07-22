import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, videoId, description, category, isFeatured } = body;

    if (!title || title.trim().length < 3) {
      return NextResponse.json({ error: "Title must be at least 3 characters long." }, { status: 400 });
    }
    if (!videoId || videoId.trim().length < 5) {
      return NextResponse.json({ error: "YouTube Video ID is required." }, { status: 400 });
    }

    const existing = await db.trailer.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Trailer not found." }, { status: 404 });
    }

    const updated = await db.$transaction(async (tx) => {
      if (isFeatured) {
        await tx.trailer.updateMany({
          where: { id: { not: id } },
          data: { isFeatured: false },
        });
      }

      const item = await tx.trailer.update({
        where: { id },
        data: {
          title: title.trim(),
          videoId: videoId.trim(),
          description: description ? description.trim() : null,
          category,
          isFeatured: !!isFeatured,
        },
      });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Updated trailer: "${title}" (ID: ${id})`,
        },
      });

      return item;
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Admin trailer update error:", error);
    return NextResponse.json({ error: "Failed to update trailer" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const existing = await db.trailer.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Trailer not found." }, { status: 404 });
    }

    await db.$transaction(async (tx) => {
      await tx.trailer.delete({ where: { id } });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Deleted trailer: "${existing.title}" (ID: ${id})`,
        },
      });
    });

    return NextResponse.json({ success: true, message: "Trailer deleted successfully" });
  } catch (error) {
    console.error("Admin trailer delete error:", error);
    return NextResponse.json({ error: "Failed to delete trailer" }, { status: 500 });
  }
}
