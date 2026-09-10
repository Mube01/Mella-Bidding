import { Types } from "mongoose";

import {
  AuctionStatus,
  IAuction,
} from "../models/auction";

import Bid from "../models/bid";

/*
 * =========================================================
 * GET REAL AUCTION STATUS
 * =========================================================
 */

export function getAuctionStatus(
  auction: Pick<
    IAuction,
    "startsAt" | "endsAt" | "status"
  >
): AuctionStatus {
  /*
   * Cancelled auctions stay cancelled.
   *
   * Completed auctions stay completed.
   */
  if (
    auction.status === "cancelled" ||
    auction.status === "completed"
  ) {
    return auction.status;
  }

  const now = Date.now();

  const startsAt =
    new Date(auction.startsAt).getTime();

  const endsAt =
    new Date(auction.endsAt).getTime();

  /*
   * Before start
   */
  if (now < startsAt) {
    return "upcoming";
  }

  /*
   * After end
   */
  if (now >= endsAt) {
    return "completed";
  }

  /*
   * Between start and end
   */
  return "live";
}

/*
 * =========================================================
 * CALCULATE LOWEST UNIQUE BID / WINNER
 * =========================================================
 *
 * The winner is:
 *
 * 1. A bid whose amount was submitted exactly once.
 * 2. The LOWEST amount among those unique bids.
 *
 * Example:
 *
 * 1.00 -> 3 submissions ❌
 * 2.00 -> 2 submissions ❌
 * 3.00 -> 1 submission  ✅ WINNER
 * 4.00 -> 1 submission  ✅
 *
 * Winner = 3.00
 */
export async function calculateWinner(
  auctionId: string
) {
  /*
   * Validate the MongoDB ObjectId before querying.
   */
  if (!Types.ObjectId.isValid(auctionId)) {
    return null;
  }

  const objectId =
    new Types.ObjectId(auctionId);

  /*
   * Count submissions for every bid amount.
   *
   * Then keep only amounts submitted exactly once.
   *
   * Sort ascending so the lowest unique amount
   * comes first.
   */
  const amounts =
    await Bid.aggregate<{
      _id: number;
      count: number;
    }>([
      {
        $match: {
          auctionId: objectId,
        },
      },

      {
        $group: {
          _id: "$amount",
          count: {
            $sum: 1,
          },
        },
      },

      {
        $match: {
          count: 1,
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },

      {
        $limit: 1,
      },
    ]);

  /*
   * No unique bid means there is no winner.
   */
  if (!amounts[0]) {
    return null;
  }

  const winningAmount =
    Number(amounts[0]._id);

  /*
   * Find the actual bid document.
   *
   * We return the complete bid document because
   * the routes need:
   *
   * - _id
   * - userId
   * - amount
   * - createdAt
   */
  const winningBid =
    await Bid.findOne({
      auctionId: objectId,
      amount: winningAmount,
    })
      .sort({
        createdAt: 1,
      })
      .lean();

  return winningBid || null;
}