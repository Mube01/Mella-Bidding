import { NextResponse } from "next/server";

import {
  isSameOriginRequest,
  getCurrentUser,
} from "../../lib/auth";
import { connectDB } from "../../lib/db";
import { getAuctionStatus } from "../../lib/auction";
import Auction from "../../models/auction";
import Bid from "../../models/bid";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request origin",
        errorAm: "የጥያቄው ምንጭ ልክ አይደለም",
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
        errorAm: "ማረጋገጫ ያስፈልጋል",
      },
      { status: 401 }
    );
  }

  try {
    const contentLength = Number(
      request.headers.get("content-length") || 0
    );

    if (contentLength > 2048) {
      return NextResponse.json(
        {
          success: false,
          error: "Request is too large",
          errorAm: "የጥያቄው መጠን በጣም ትልቅ ነው",
        },
        { status: 413 }
      );
    }

    const body = await request.json();

    const auctionId =
      typeof body.auctionId === "string"
        ? body.auctionId.trim()
        : "";

const amountString = String(body.amount).trim();

const validAmountFormat = /^\d+(?:\.\d{1,2})?$/.test(
  amountString
);

const amount = Number(amountString);
    if (
  !auctionId ||
  !validAmountFormat ||
  !Number.isFinite(amount) ||
  amount < 1 ||
  amount > 100000000
) {
      return NextResponse.json(
        {
          success: false,
          error: "Enter a valid bid amount",
          errorAm: "እባክዎ ትክክለኛ የመጫረቻ መጠን ያስገቡ",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const auction = await Auction.findOne({
      publicId: auctionId,
    });

    if (!auction) {
      return NextResponse.json(
        {
          success: false,
          error: "Auction not found",
          errorAm: "ጨረታው አልተገኘም",
        },
        { status: 404 }
      );
    }

    if (getAuctionStatus(auction) !== "live") {
      return NextResponse.json(
        {
          success: false,
          error: "This auction is not accepting bids",
          errorAm: "ይህ ጨረታ በአሁኑ ጊዜ መጫረቻ አይቀበልም",
        },
        { status: 409 }
      );
    }

    const existingParticipation = await Bid.exists({
      auctionId: auction._id,
      userId: user._id,
    });

    const bid = await Bid.create({
      auctionId: auction._id,
      userId: user._id,
      amount,
      status: "accepted",
    });

    await Auction.updateOne(
      { _id: auction._id },
      {
        $inc: {
          bidCount: 1,
          ...(existingParticipation
            ? {}
            : { participantCount: 1 }),
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        bid: {
          id: bid._id.toString(),
          amount: bid.amount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("BID_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to submit bid",
        errorAm: "መጫረቻውን መላክ አልተቻለም",
      },
      { status: 500 }
    );
  }
}