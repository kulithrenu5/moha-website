import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    // 1. Fetch user from DB
    const admin = await db.adminUser.findUnique({
      where: { username: username.toLowerCase().trim() },
    });

    if (!admin) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    // 2. Validate password
    const incomingHash = hashPassword(password);
    if (incomingHash !== admin.passwordHash) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    // 3. Log a success login event to analytics
    await db.analyticsEvent.create({
      data: {
        eventType: "admin_login",
        metadata: `Admin user "${username}" logged in successfully.`,
      },
    });

    // 4. Return success along with a secure mock token
    const mockToken = crypto.createHash("sha256").update(`${admin.id}-${Date.now()}`).digest("hex");

    return NextResponse.json({
      success: true,
      token: mockToken,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ error: "Failed to authenticate due to an internal server error." }, { status: 500 });
  }
}
