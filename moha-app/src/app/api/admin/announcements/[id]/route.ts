import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, content, link, linkText, platform } = body;

    if (!title || title.trim().length < 3) {
      return NextResponse.json({ error: "Title must be at least 3 characters long." }, { status: 400 });
    }
    if (!content || content.trim().length < 10) {
      return NextResponse.json({ error: "Content must be at least 10 characters." }, { status: 400 });
    }

    const existing = await db.communityAnnouncement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Announcement not found." }, { status: 404 });
    }

    const updated = await db.$transaction(async (tx) => {
      const item = await tx.communityAnnouncement.update({
        where: { id },
        data: {
          title: title.trim(),
          content: content.trim(),
          link: link ? link.trim() : "#",
          linkText: linkText ? linkText.trim() : "Join Discussion",
          platform,
        },
      });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Updated community announcement: "${title}" (ID: ${id})`,
        },
      });

      return item;
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Admin announcement update error:", error);
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const existing = await db.communityAnnouncement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Announcement not found." }, { status: 404 });
    }

    await db.$transaction(async (tx) => {
      await tx.communityAnnouncement.delete({ where: { id } });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Deleted announcement: "${existing.title}" (ID: ${id})`,
        },
      });
    });

    return NextResponse.json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Admin announcement delete error:", error);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
