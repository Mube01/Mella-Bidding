import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import {
   getAuctionStatus,
  calculateWinner,
} from "../../../lib/auction";
import Auction from "../../../models/auction";
import Bid from "../../../models/bid";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!/^[A-Za-z0-9_-]{1,80}$/.test(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid auction id.",
        },
        {
          status: 400,
        }
      );
    }

    const language =
      new URL(request.url).searchParams.get("lang") === "am"
        ? "am"
        : "en";

    const auction = await Auction.findOne({
      publicId: id,
    }).lean();

    if (!auction) {
      return NextResponse.json(
        {
          success: false,
          message: "Auction not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * =========================================================
     * CALCULATE REAL STATUS
     * =========================================================
     */

    const status = getAuctionStatus(auction);

    /*
     * =========================================================
     * COMPLETE AUCTION + DETERMINE WINNER
     * =========================================================
     */

    if (status === "completed") {
      const needsWinner =
        !auction.winningBidId ||
        !auction.winnerUserId;

      const winner = needsWinner
        ? await calculateWinner(auction._id.toString())
        : null;

      const updateData: Record<string, unknown> = {
        status: "completed",
      };

      if (!auction.completedAt) {
        updateData.completedAt = auction.endsAt;
      }

      if (winner) {
        updateData.winningBidId =
          winner._id;

        updateData.winnerUserId =
          winner.userId;
      }

      if (Object.keys(updateData).length > 0) {
        await Auction.updateOne(
          {
            _id: auction._id,
          },
          {
            $set: updateData,
          }
        );
      }

      /*
       * Update local object so this response immediately
       * contains the winner without requiring another request.
       */
      if (winner) {
        auction.winningBidId =
          winner._id;

        auction.winnerUserId =
          winner.userId;
      }
    } else if (auction.status !== status) {
      /*
       * Keep status synchronized for upcoming/live auctions.
       */
      await Auction.updateOne(
        {
          _id: auction._id,
        },
        {
          $set: {
            status,
          },
        }
      );
    }

    /*
     * =========================================================
     * GET BIDS
     * =========================================================
     */

    const bids = await Bid.find({
      auctionId: auction._id,
    })
      .sort({
        createdAt: -1,
      })
      .select("amount createdAt")
      .limit(100)
      .lean();

    /*
     * =========================================================
     * RESPONSE
     * =========================================================
     */

    return NextResponse.json({
      success: true,

      auction: {
        ...auction,

        id: auction.publicId,

        title:
          auction.title?.[language] ||
          auction.title?.en ||
          "",

        subtitle:
          auction.subtitle?.[language] ||
          auction.subtitle?.en ||
          "",

        description:
          auction.description?.[language] ||
          auction.description?.en ||
          "",

        titleEn:
          auction.title?.en || "",

        titleAm:
          auction.title?.am || "",

        subtitleEn:
          auction.subtitle?.en || "",

        subtitleAm:
          auction.subtitle?.am || "",

        descriptionEn:
          auction.description?.en || "",

        descriptionAm:
          auction.description?.am || "",

        images:
          auction.images || [],

        /*
         * Always return calculated status.
         */
        status,

        _id: undefined,
      },

      bids: bids.map((bid) => ({
        amount: bid.amount,
        createdAt: bid.createdAt,
      })),
    });
  } catch (error) {
    console.error(
      "AUCTION_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load auction.",
      },
      {
        status: 500,
      }
    );
  }
}
