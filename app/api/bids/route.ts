import { NextResponse } from "next/server";

import {
  isSameOriginRequest,
  getCurrentUser,
} from "../../lib/auth";
import { connectDB } from "../../lib/db";
import { getAuctionStatus } from "../../lib/auction";
import Auction from "../../models/auction";
import Bid from "../../models/bid";
import User from "../../models/user";
import {
  checkRateLimit,
  getClientIp,
} from "../../lib/rateLimit";

const MAX_BIDS_PER_USER_PER_AUCTION = 100;

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

    const rateLimit = checkRateLimit({
      key: `bid:${user._id}:${getClientIp(request)}`,
      limit: 60,
      windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You are bidding too quickly. Please try again shortly.",
          errorAm:
            "በጣም በፍጥነት እየተጫረቱ ነው። እባክዎ ትንሽ ቆይተው ይሞክሩ።",
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

    const auctionId =
      typeof body.auctionId === "string"
        ? body.auctionId.trim()
        : "";

const amountString = String(body.amount).trim();

const validAmountFormat = /^\d+(?:\.\d{1,2})?$/.test(
  amountString
);

    const amount = Number(amountString);
    const usePackageCredit =
      body.usePackageCredit === true;

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

    const userAuctionBidCount =
      await Bid.countDocuments({
        auctionId: auction._id,
        userId: user._id,
      });

    if (
      userAuctionBidCount >=
      MAX_BIDS_PER_USER_PER_AUCTION
    ) {
      return NextResponse.json(
        {
          success: false,
          code: "BID_LIMIT_REACHED",
          error:
            "You have reached the 100 bid limit for this auction",
          errorAm:
            "áˆˆá‹šáˆ… áŒ¨áˆ¨á‰³ 100 áˆ˜áŒ«áˆ¨á‰»á‹Žá‰½ áˆ‹á‹­ á‹°áˆ­áˆ°á‹‹áˆ",
        },
        { status: 409 }
      );
    }

    const existingParticipation = userAuctionBidCount > 0;

    let remainingCredits: number | undefined;
    let creditReserved = false;

    if (usePackageCredit) {
      const updatedUser =
        await User.findOneAndUpdate(
          {
            _id: user._id,
            bidCredits: { $gte: 1 },
          },
          {
            $inc: { bidCredits: -1 },
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
            error:
              "You do not have enough package bid credits",
            errorAm:
              "á‰ á‰‚ á‹¨áŒ¥á‰…áˆ áˆ˜áŒ«áˆ¨á‰» áŠ­áˆ¬á‹²á‰µ á‹¨áˆŽá‰µáˆ",
          },
          { status: 409 }
        );
      }

      creditReserved = true;
      remainingCredits =
        updatedUser.bidCredits || 0;
    }

    let bid;

    try {
      bid = await Bid.create({
        auctionId: auction._id,
        userId: user._id,
        amount,
        paymentMethod: usePackageCredit
          ? "package"
          : "direct",
        packageName: usePackageCredit
          ? "Bid package"
          : "Direct bid",
        packageCreditsRemainingAfter:
          usePackageCredit
            ? remainingCredits
            : undefined,
        status: "accepted",
      });
    } catch (error) {
      if (creditReserved) {
        await User.updateOne(
          { _id: user._id },
          { $inc: { bidCredits: 1 } }
        );
      }

      throw error;
    }

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
          paymentMethod: bid.paymentMethod,
        },
        bidCredits: remainingCredits,
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
