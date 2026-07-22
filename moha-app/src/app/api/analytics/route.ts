import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, metadata } = body;

    if (!eventType) {
      return NextResponse.json({ error: "eventType is required" }, { status: 400 });
    }

    // Save analytics event to the database
    const event = await db.analyticsEvent.create({
      data: {
        eventType,
        metadata: metadata || `User clicked ${eventType}`,
      },
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Failed to log analytics event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get summarized metrics for public consumption or testing
    const counts = await db.analyticsEvent.groupBy({
      by: ["eventType"],
      _count: {
        id: true,
      },
    });

    const formattedCounts = counts.reduce((acc: Record<string, number>, curr) => {
      acc[curr.eventType] = curr._count.id;
      return acc;
    }, {});

    return NextResponse.json({ success: true, data: formattedCounts });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
