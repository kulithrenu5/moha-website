import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // 1. Get counts
    const newsCount = await db.news.count();
    const galleryCount = await db.galleryItem.count();
    const trailerCount = await db.trailer.count();
    const subCount = await db.subscriber.count();
    const inquiryCount = await db.contactInquiry.count();
    const unreadInquiries = await db.contactInquiry.count({ where: { isRead: false } });

    // 2. Get analytics event counts
    const analytics = await db.analyticsEvent.groupBy({
      by: ["eventType"],
      _count: {
        id: true,
      },
    });

    const metrics = {
      wishlist_clicks: 0,
      steam_clicks: 0,
      trailer_views: 0,
      newsletter_signups: 0,
      contact_inquiries: 0,
      admin_crud: 0,
    };

    analytics.forEach((item) => {
      const type = item.eventType as keyof typeof metrics;
      if (type in metrics) {
        metrics[type] = item._count.id;
      }
    });

    // 3. Get recent activity log (from admin_crud events and signups)
    const recentActivity = await db.analyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          news: newsCount,
          gallery: galleryCount,
          trailers: trailerCount,
          subscribers: subCount,
          inquiries: inquiryCount,
          unreadInquiries,
        },
        metrics,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Admin dashboard fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 });
  }
}
