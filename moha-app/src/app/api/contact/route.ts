import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // 1. Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!subject || subject.trim().length < 3) {
      return NextResponse.json({ error: "Please enter a subject (minimum 3 characters)." }, { status: 400 });
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json({ error: "Please enter a message (minimum 10 characters)." }, { status: 400 });
    }

    // 2. Transaction for saving inquiry and logging event
    const result = await db.$transaction(async (tx) => {
      const inquiry = await tx.contactInquiry.create({
        data: {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        },
      });

      await tx.analyticsEvent.create({
        data: {
          eventType: "contact_inquiry",
          metadata: `New inquiry submitted by ${email}: "${subject}"`,
        },
      });

      return inquiry;
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully. The spirits have received it.",
      data: result,
    });
  } catch (error) {
    console.error("Contact inquiry error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry due to a database error." }, { status: 500 });
  }
}
