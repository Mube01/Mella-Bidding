import { NextResponse } from "next/server";

import { connectDB } from "../../../lib/db";
import {
  createSession,
  verifyPassword,
} from "../../../lib/auth";
import User from "../../../models/user";

function normalizePhone(phone: string): string {
  let normalized = phone
    .replace(/\s+/g, "")
    .trim();
  
  // Convert +251 to 0 (e.g., +2519XXXXXXXX -> 09XXXXXXXX)
  if (normalized.startsWith("+251")) {
    normalized = "0" + normalized.slice(4);
  }
  // Convert 251 to 0 (e.g., 2519XXXXXXXX -> 09XXXXXXXX)
  else if (normalized.startsWith("251")) {
    normalized = "0" + normalized.slice(3);
  }
  
  return normalized;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const phone =
      typeof body.phone === "string"
        ? normalizePhone(body.phone)
        : "";

    const email =
      typeof body.email === "string"
        ? normalizeEmail(body.email)
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const remember =
      body.remember === true;

    const adminLogin =
      body.admin === true;

    if ((!phone && !email) || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Phone number or email and password are required.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne(
      email ? { email } : { phone }
    ).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid phone number or password.",
        },
        { status: 401 }
      );
    }

    const passwordIsValid =
      await verifyPassword(
        password,
        user.password
      );

    if (!passwordIsValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid phone number or password.",
        },
        { status: 401 }
      );
    }

    if (adminLogin && user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This account does not have administrator access.",
        },
        { status: 403 }
      );
    }

    await createSession(
      user._id.toString(),
      user.role,
      remember
    );

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "LOGIN_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while logging in.",
      },
      { status: 500 }
    );
  }
}