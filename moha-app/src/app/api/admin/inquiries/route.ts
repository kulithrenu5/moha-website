import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const inquiries = await db.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: inquiries });
  } catch (error) {
    console.error("Admin inquiries fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch contact inquiries" }, { status: 500 });
  }
}
