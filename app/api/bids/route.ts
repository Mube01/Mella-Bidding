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
      { success: false, error: "Invalid request origin" },
      { status: 403 }
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 2048) {
      return NextResponse.json({ success: false, error: "Request is too large" }, { status: 413 });
    }

    const body = await request.json();
    const auctionId = typeof body.auctionId === "string" ? body.auctionId.trim() : "";
    const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);

    if (!auctionId || !Number.isFinite(amount) || amount < 1 || amount > 100000000 || Math.round(amount * 100) !== amount * 100) {
      return NextResponse.json({ success: false, error: "Enter a valid bid amount" }, { status: 400 });
    }

    await connectDB();
    const auction = await Auction.findOne({ publicId: auctionId });
    if (!auction) {
      return NextResponse.json({ success: false, error: "Auction not found" }, { status: 404 });
    }

    if (getAuctionStatus(auction) !== "live") {
      return NextResponse.json({ success: false, error: "This auction is not accepting bids" }, { status: 409 });
    }

    const existingParticipation = await Bid.exists({ auctionId: auction._id, userId: user._id });
    const bid = await Bid.create({ auctionId: auction._id, userId: user._id, amount, status: "accepted" });
    await Auction.updateOne(
      { _id: auction._id },
      {
        $inc: { bidCount: 1, ...(existingParticipation ? {} : { participantCount: 1 }) },
      }
    );

    return NextResponse.json({ success: true, bid: { id: bid._id.toString(), amount: bid.amount } }, { status: 201 });
  } catch (error) {
    console.error("BID_CREATE_ERROR:", error);
    return NextResponse.json({ success: false, error: "Unable to submit bid" }, { status: 500 });
  }
}