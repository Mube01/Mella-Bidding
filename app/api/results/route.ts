import { NextResponse } from "next/server";

import { connectDB } from "../../lib/db";
import Auction from "../../models/auction";
import User from "../../models/user";
import Bid from "../../models/bid";
import { getAuctionStatus } from "../../lib/auction";

export async function GET(request: Request) {
  try {
    await connectDB();

    const language =
      new URL(request.url).searchParams.get("lang") === "am"
        ? "am"
        : "en";

        function maskPhone(phone: string | undefined): string | null {
  if (!phone) return null;
  const normalized = phone.replace(/\s+/g, "");
  if (normalized.length <= 4) return "****";
  return `${normalized.slice(0, 3)}****${normalized.slice(-2)}`;
}

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
     * CALCULATE REAL STATUS
     * =========================================================
     */

    const completedAuctions = allAuctions.filter((auction) => {
      const status = getAuctionStatus(auction);

      return status === "completed";
    });

    /*
     * =========================================================
     * SYNCHRONIZE DATABASE STATUS
     * =========================================================
     */

    await Promise.all(
      completedAuctions.map(async (auction) => {
        if (auction.status !== "completed") {
          try {
            await Auction.updateOne(
              {
                _id: auction._id,
              },
              {
                $set: {
                  status: "completed",

                  ...(auction.completedAt
                    ? {}
                    : {
                        completedAt: auction.endsAt,
                      }),
                },
              }
            );
          } catch (updateError) {
            console.error(
              "RESULT_STATUS_UPDATE_ERROR:",
              updateError
            );
          }
        }
      })
    );

    const results = await Promise.all(
      completedAuctions.map(async (auction) => {
        /*
         * Find winner if winnerUserId exists.
         */
        let winner = null;

        if (auction.winnerUserId) {
          winner = await User.findById(
            auction.winnerUserId
          )
            .select("name phone")
            .lean();
        }

        /*
         * Find winning bid if winningBidId exists.
         */
        let winningBid = null;

        if (auction.winningBidId) {
          winningBid = await Bid.findById(
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
            auction.subtitle?.[language] ||
            auction.subtitle?.en ||
            "",

          image: auction.image,

          category: auction.category,

          winner:
            winner?.name ||
            "Winner",

          winningBid:
            winningBid?.amount ||
            0,
            
        winnerPhone: maskPhone(winner?.phone),
          bidCount: auction.bidCount || 0,

          date:
            auction.completedAt ||
            auction.endsAt ||
            auction.updatedAt,

          participants:
            auction.participantCount ||
            0,

          description:
            auction.description?.[language] ||
            auction.description?.en ||
            "",

          status: "completed",
        };
      })
    );

    /*
     * =========================================================
     * RESPONSE
     * =========================================================
     */

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
        message: "Unable to load results.",
      },
      {
        status: 500,
      }
    );
  }
}