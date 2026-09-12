import { NextResponse } from "next/server";
import type { QueryFilter } from "mongoose";
import { connectDB } from "../../lib/db";
import Auction, {
  IAuction,
} from "../../models/auction";
import { getAuctionStatus } from "../../lib/auction";

export async function GET(request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);

    const includeAll =
      url.searchParams.get("all") === "true";

    const featuredOnly =
      url.searchParams.get("featured") === "true";

    const language =
      url.searchParams.get("lang") === "am"
        ? "am"
        : "en";

    const now = new Date();

    /*
     * =========================================================
     * FEATURED AUCTION
     * =========================================================
     *
     * Only return the featured auction if it is currently
     * LIVE or UPCOMING.
     *
     * A completed featured auction should not appear on the
     * public homepage.
     */

    if (featuredOnly) {
      const featuredAuctions = await Auction.find({
        featured: true,
        status: { $ne: "cancelled" },
        endsAt: { $gt: now },
      })
        .sort({
          order: 1,
          endsAt: 1,
        })
        .limit(10)
        .lean();

      /*
       * Calculate the REAL status using the current time.
       *
       * We do NOT trust the stored status field here.
       */

      const activeFeatured = featuredAuctions.find(
        (auction) => {
          const status =
            getAuctionStatus(auction);

          return (
            status === "live" ||
            status === "upcoming"
          );
        }
      );

      return NextResponse.json({
        success: true,

        auctions: activeFeatured
          ? [
              {
                ...activeFeatured,

                id: activeFeatured.publicId,

                titleEn:
                  activeFeatured.title.en,
                titleAm:
                  activeFeatured.title.am,

                subtitleEn:
                  activeFeatured.subtitle.en,
                subtitleAm:
                  activeFeatured.subtitle.am,

                descriptionEn:
                  activeFeatured.description.en,
                descriptionAm:
                  activeFeatured.description.am,

                title:
                  activeFeatured.title[
                    language
                  ],

                subtitle:
                  activeFeatured.subtitle[
                    language
                  ],

                description:
                  activeFeatured.description[
                    language
                  ],

                /*
                 * IMPORTANT:
                 * Always calculate status from
                 * the auction dates.
                 */
                status:
                  getAuctionStatus(
                    activeFeatured
                  ),

                _id: undefined,
              },
            ]
          : [],
      });
    }

    /*
     * =========================================================
     * GET AUCTIONS
     * =========================================================
     *
     * We intentionally fetch the auctions first and then
     * calculate their status.
     *
     * This prevents an old/stale database status from causing
     * expired auctions to remain visible.
     */

    const auctionQuery: QueryFilter<IAuction> = includeAll
      ? {}
      : {
          status: { $ne: "cancelled" },
          endsAt: { $gt: now },
        };

    const allAuctions = await Auction.find(auctionQuery)
      .sort({
        order: 1,
        endsAt: 1,
      })
      .lean();

    /*
     * =========================================================
     * CALCULATE REAL STATUS
     * =========================================================
     */

    const auctionsWithStatus =
      allAuctions.map((auction) => {
        const calculatedStatus =
          getAuctionStatus(auction);

        return {
          auction,
          status: calculatedStatus,
        };
      });

    /*
     * =========================================================
     * PUBLIC AUCTIONS
     * =========================================================
     *
     * When ?all=true is NOT provided:
     *
     * ONLY live and upcoming auctions are returned.
     *
     * Completed auctions are intentionally excluded.
     */

    const visibleAuctions =
      includeAll
        ? auctionsWithStatus
        : auctionsWithStatus.filter(
            ({ status }) =>
              status === "live" ||
              status === "upcoming"
          );

    /*
     * =========================================================
     * FORMAT RESPONSE
     * =========================================================
     */

    return NextResponse.json({
      success: true,

      auctions:
        visibleAuctions.map(
          ({
            auction,
            status,
          }) => ({
            ...auction,

            id: auction.publicId,

            /*
             * Localized fields
             */
            title:
              auction.title[
                language
              ],

            subtitle:
              auction.subtitle[
                language
              ],

            description:
              auction.description[
                language
              ],

            /*
             * English / Amharic fields
             */
            titleEn:
              auction.title.en,

            titleAm:
              auction.title.am,

            subtitleEn:
              auction.subtitle.en,

            subtitleAm:
              auction.subtitle.am,

            descriptionEn:
              auction.description.en,

            descriptionAm:
              auction.description.am,

            /*
             * REAL calculated status
             */
            status,

            _id: undefined,
          })
        ),
    });
  } catch (error) {
    console.error(
      "AUCTIONS_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load auctions.",
      },
      {
        status: 500,
      }
    );
  }
}
