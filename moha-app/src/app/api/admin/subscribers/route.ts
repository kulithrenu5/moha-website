import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const subscribers = await db.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: subscribers });
  } catch (error) {
    console.error("Admin subscribers fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
