import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const existing = await db.subscriber.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Subscriber not found." }, { status: 404 });
    }

    await db.$transaction(async (tx) => {
      await tx.subscriber.delete({ where: { id } });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Removed subscriber: ${existing.email}`,
        },
      });
    });

    return NextResponse.json({ success: true, message: "Subscriber removed successfully" });
  } catch (error) {
    console.error("Admin subscriber delete error:", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
