import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { isRead } = body;

    const existing = await db.contactInquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    const updated = await db.contactInquiry.update({
      where: { id },
      data: { isRead: !!isRead },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Admin inquiry update error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const existing = await db.contactInquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    await db.contactInquiry.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("Admin inquiry delete error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
