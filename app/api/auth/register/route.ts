import { NextResponse } from "next/server";

import { connectDB } from "../../../lib/db";
import {
  createSession,
  hashPassword,
} from "../../../lib/auth";
import User from "../../../models/user";

function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, "").trim();
}

function isValidPhone(phone: string) {
  return /^(09\d{8}|\+2519\d{8})$/.test(phone);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? normalizePhone(body.phone)
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const remember =
      body.remember === true;

    if (!name || !phone || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, phone number and password are required.",
        },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name must contain at least 2 characters.",
        },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid Ethiopian phone number.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must contain at least 8 characters.",
        },
        { status: 400 }
      );
    }

    /*
     * Connect to MongoDB.
     */
    await connectDB();

    /*
     * Check if the phone number already exists.
     */
    const existingUser = await User.findOne({
      phone,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this phone number already exists.",
        },
        { status: 409 }
      );
    }

    /*
     * Hash password before saving.
     */
    const hashedPassword =
      await hashPassword(password);

    /*
     * Create user.
     */
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role: "user",
    });

    /*
     * IMPORTANT:
     * Automatically sign the user in.
     */
    await createSession(
      user._id.toString(),
      user.role,
      remember
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully.",
        user: {
          id: user._id.toString(),
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "We couldn't create your account right now. Please try again.",
      },
      { status: 500 }
    );
  }
}