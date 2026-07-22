import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, content, excerpt, imageUrl, category, author } = body;

    if (!title || title.trim().length < 5) {
      return NextResponse.json({ error: "Title must be at least 5 characters long." }, { status: 400 });
    }
    if (!content || content.trim().length < 20) {
      return NextResponse.json({ error: "Content must be at least 20 characters long." }, { status: 400 });
    }

    // Verify item exists
    const existing = await db.news.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "News post not found." }, { status: 404 });
    }

    const updated = await db.$transaction(async (tx) => {
      const item = await tx.news.update({
        where: { id },
        data: {
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim(),
          imageUrl,
          category,
          author,
        },
      });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Updated news post: "${title}" (ID: ${id})`,
        },
      });

      return item;
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Admin news update error:", error);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const existing = await db.news.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "News post not found." }, { status: 404 });
    }

    await db.$transaction(async (tx) => {
      await tx.news.delete({ where: { id } });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Deleted news post: "${existing.title}" (ID: ${id})`,
        },
      });
    });

    return NextResponse.json({ success: true, message: "News post deleted successfully" });
  } catch (error) {
    console.error("Admin news delete error:", error);
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}
