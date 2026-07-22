import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await db.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: "You are already subscribed to our newsletter." }, { status: 400 });
    }

    // Start a transaction: 1. Add subscriber, 2. Log analytics event
    const result = await db.$transaction(async (tx) => {
      const sub = await tx.subscriber.create({
        data: { email },
      });

      await tx.analyticsEvent.create({
        data: {
          eventType: "newsletter_signup",
          metadata: `New subscriber registered: ${email}`,
        },
      });

      return sub;
    });

    return NextResponse.json({ success: true, message: "Thank you for subscribing!", data: result });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe due to a database error." }, { status: 500 });
  }
}
