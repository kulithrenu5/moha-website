import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const items = await db.communityAnnouncement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Admin announcements fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, link, linkText, platform } = body;

    if (!title || title.trim().length < 3) {
      return NextResponse.json({ error: "Title must be at least 3 characters long." }, { status: 400 });
    }
    if (!content || content.trim().length < 10) {
      return NextResponse.json({ error: "Content must be at least 10 characters." }, { status: 400 });
    }

    const created = await db.$transaction(async (tx) => {
      const item = await tx.communityAnnouncement.create({
        data: {
          title: title.trim(),
          content: content.trim(),
          link: link ? link.trim() : "#",
          linkText: linkText ? linkText.trim() : "Join Discussion",
          platform: platform || "discord",
        },
      });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Added community announcement: "${title}" (ID: ${item.id})`,
        },
      });

      return item;
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("Admin announcement create error:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
