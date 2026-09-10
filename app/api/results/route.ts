import { NextResponse } from "next/server";

import { connectDB } from "../../lib/db";
import Auction from "../../models/auction";
import User from "../../models/user";
import Bid from "../../models/bid";
import {
  getAuctionStatus,
  calculateWinner,
} from "../../lib/auction";

function maskPhone(
  phone: string | undefined
): string | null {
  if (!phone) return null;

  const normalized =
    phone.replace(/\s+/g, "");

  if (normalized.length <= 4) {
    return "****";
  }

  return `${normalized.slice(
    0,
    3
  )}****${normalized.slice(-2)}`;
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const language =
      new URL(request.url).searchParams.get(
        "lang"
      ) === "am"
        ? "am"
        : "en";

    /*
     * =========================================================
     * GET ALL AUCTIONS
     * =========================================================
     */

    const allAuctions = await Auction.find()
      .sort({
        completedAt: -1,
        endsAt: -1,
      })
      .lean();

    /*
     * =========================================================
     * FIND COMPLETED AUCTIONS
     * =========================================================
     */

    const completedAuctions =
      allAuctions.filter(
        (auction) =>
          getAuctionStatus(auction) ===
          "completed"
      );

    /*
     * =========================================================
     * SYNCHRONIZE COMPLETED AUCTIONS
     * AND CALCULATE WINNERS
     * =========================================================
     */

    for (const auction of completedAuctions) {
      const updateData: Record<
        string,
        unknown
      > = {};

      if (auction.status !== "completed") {
        updateData.status = "completed";
      }

      if (!auction.completedAt) {
        updateData.completedAt =
          auction.endsAt;
      }

      /*
       * If the winner hasn't already been stored,
       * calculate it now.
       */
      if (
        !auction.winningBidId ||
        !auction.winnerUserId
      ) {
        const winner =
          await calculateWinner(
            auction._id.toString()
          );

        if (winner) {
          updateData.winningBidId =
            winner._id;

          updateData.winnerUserId =
            winner.userId;

          /*
           * Update local auction object too.
           */
          auction.winningBidId =
            winner._id;

          auction.winnerUserId =
            winner.userId;
        }
      }

      if (
        Object.keys(updateData).length > 0
      ) {
        try {
          await Auction.updateOne(
            {
              _id: auction._id,
            },
            {
              $set: updateData,
            }
          );
        } catch (updateError) {
          console.error(
            "RESULT_STATUS_UPDATE_ERROR:",
            updateError
          );
        }
      }
    }

    /*
     * =========================================================
     * BUILD RESULTS
     * =========================================================
     */

    const results = await Promise.all(
      completedAuctions.map(
        async (auction) => {
          /*
           * Find winner.
           */
          let winner = null;

          if (auction.winnerUserId) {
            winner =
              await User.findById(
                auction.winnerUserId
              )
                .select("name phone")
                .lean();
          }

          /*
           * Find winning bid.
           */
          let winningBid = null;

          if (auction.winningBidId) {
            winningBid =
              await Bid.findById(
                auction.winningBidId
              )
                .select("amount")
                .lean();
          }

          return {
            id: auction.publicId,

            title:
              auction.title?.[language] ||
              auction.title?.en ||
              "",

            subtitle:
              auction.subtitle?.[
                language
              ] ||
              auction.subtitle?.en ||
              "",

            image: auction.image,

            category:
              auction.category,

            winner:
              winner?.name ||
              null,

            winnerPhone:
              maskPhone(winner?.phone),

            winningBid:
              winningBid?.amount ||
              null,

            bidCount:
              auction.bidCount || 0,

            date:
              auction.completedAt ||
              auction.endsAt ||
              auction.updatedAt,

            participants:
              auction.participantCount ||
              0,

            description:
              auction.description?.[
                language
              ] ||
              auction.description?.en ||
              "",

            status: "completed",
          };
        }
      )
    );

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error(
      "RESULTS_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load results.",
      },
      {
        status: 500,
      }
    );
  }
}