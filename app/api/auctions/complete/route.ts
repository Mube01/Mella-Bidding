import { NextResponse } from "next/server";

import { connectDB } from "../../../lib/db";
import Auction from "../../../models/auction";
import { completeAuction } from "../../../lib/completeAuction";

/**
 * =========================================================
 * COMPLETE EXPIRED AUCTIONS
 * =========================================================
 *
 * Finds auctions whose end time has passed and calculates
 * the lowest unique bid winner.
 */

export async function GET(request: Request) {
  try {
    /*
     * =======================================================
     * CRON SECURITY
     * =======================================================
     */
      const authHeader =
        request.headers.get("authorization");

      const cronSecret =
        process.env.CRON_SECRET;

      const isDevelopment =
        process.env.NODE_ENV === "development";

      if (
        cronSecret &&
        !isDevelopment &&
        authHeader !== `Bearer ${cronSecret}`
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Unauthorized.",
          },
          {
            status: 401,
          }
        );
      }

    /*
     * =======================================================
     * DATABASE
     * =======================================================
     */

    await connectDB();

    const now = new Date();

    console.log(
      `[CRON] Checking expired auctions at ${now.toISOString()}`
    );

    /*
     * =======================================================
     * FIND EXPIRED AUCTIONS
     * =======================================================
     */

    const expiredAuctions =
      await Auction.find({
        endsAt: {
          $lte: now,
        },

        status: {
          $in: [
            "upcoming",
            "live",
            "completed",
          ],
        },
      })
        .sort({
          endsAt: 1,
        })
        .lean();

    console.log(
      `[CRON] Found ${expiredAuctions.length} expired auctions`
    );

    /*
     * =======================================================
     * NOTHING TO PROCESS
     * =======================================================
     */

    if (expiredAuctions.length === 0) {
      return NextResponse.json({
        success: true,
        message:
          "No expired auctions to process.",
        processed: 0,
        results: [],
      });
    }

    /*
     * =======================================================
     * PROCESS AUCTIONS
     * =======================================================
     */

    const results = [];

    for (const auction of expiredAuctions) {
      try {
        console.log(
          `[CRON] Processing auction ${auction.publicId}`
        );

        const result =
          await completeAuction(auction);

        results.push(result);

        console.log(
          `[CRON] Successfully processed ${auction.publicId}`
        );
      } catch (error) {
        console.error(
          `[CRON] AUCTION_COMPLETION_ERROR_${auction.publicId}:`,
          error
        );

        results.push({
          success: false,
          auctionId: auction.publicId,
          error:
            error instanceof Error
              ? error.message
              : "Failed to calculate winner.",
        });
      }
    }

    /*
     * =======================================================
     * RESPONSE
     * =======================================================
     */

    return NextResponse.json({
      success: true,

      processed:
        expiredAuctions.length,

      results,
    });
  } catch (error) {
    console.error(
      "COMPLETE_AUCTIONS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to complete expired auctions.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}