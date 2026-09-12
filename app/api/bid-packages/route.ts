import { NextResponse } from "next/server";

import {
  getCurrentUser,
  isSameOriginRequest,
} from "../../lib/auth";
import { connectDB } from "../../lib/db";
import {
  checkRateLimit,
  getClientIp,
} from "../../lib/rateLimit";
import User from "../../models/user";

const packageSizes = new Set([5, 10]);

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request origin",
      },
      { status: 403 }
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: "Authentication required",
      },
      { status: 401 }
    );
  }

  try {
    const contentLength = Number(
      request.headers.get("content-length") || 0
    );

    if (contentLength > 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "Request is too large",
        },
        { status: 413 }
      );
    }

    const body = await request.json();

    const rateLimit = checkRateLimit({
      key: `bid-package:${user._id}:${getClientIp(request)}`,
      limit: 20,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many package requests. Please try again shortly.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              rateLimit.retryAfter
            ),
          },
        }
      );
    }

    const packageSize = Number(body.packageSize);

    if (!packageSizes.has(packageSize)) {
      return NextResponse.json(
        {
          success: false,
          error: "Choose a valid bid package",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedUser =
      await User.findByIdAndUpdate(
        user._id,
        {
          $inc: {
            bidCredits: packageSize,
          },
        },
        {
          new: true,
          projection: {
            bidCredits: 1,
          },
        }
      );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Account not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      packageSize,
      bidCredits: updatedUser.bidCredits || 0,
    });
  } catch (error) {
    console.error("BID_PACKAGE_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to add bid package",
      },
      { status: 500 }
    );
  }
}
