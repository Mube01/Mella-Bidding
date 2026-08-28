import { NextResponse } from "next/server";

import {
  clearSession,
  isSameOriginRequest,
} from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request origin.",
        },
        { status: 403 }
      );
    }

    await clearSession();

    return NextResponse.json({
      success: true,
      message:
        "Logged out successfully.",
    });
  } catch (error) {
    console.error(
      "LOGOUT_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to log out.",
      },
      { status: 500 }
    );
  }
}