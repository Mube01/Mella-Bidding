import Auction from "../models/auction";
import Bid from "../models/bid";
import User from "../models/user";

/**
 * =========================================================
 * COMPLETE AUCTION
 * =========================================================
 *
 * Lowest Unique Bid Rules:
 *
 * - Only accepted bids are considered.
 * - Bids are grouped by exact amount.
 * - An amount is unique when exactly ONE accepted bid
 *   contains that amount.
 * - The lowest unique amount wins.
 *
 * Example:
 *
 * 75  -> 2 bids -> NOT unique
 * 100 -> 1 bid  -> WINNER
 * 150 -> 1 bid  -> unique but not lowest
 *
 * Winner = 100
 */

export async function completeAuction(auction: any) {
  if (!auction?._id) {
    throw new Error("Invalid auction.");
  }

  /*
   * =========================================================
   * GET ACCEPTED BIDS
   * =========================================================
   */

  const bids = await Bid.find({
    auctionId: auction._id,
    status: "accepted",
  })
    .sort({
      amount: 1,
      createdAt: 1,
    })
    .lean();

  console.log(
    `[COMPLETE AUCTION] ${auction.publicId} - ${bids.length} accepted bids`
  );

  /*
   * =========================================================
   * NO BIDS
   * =========================================================
   */

  if (bids.length === 0) {
    const updateResult = await Auction.updateOne(
      {
        _id: auction._id,
        status: {
          $ne: "cancelled",
        },
      },
      {
        $set: {
          status: "completed",
          completedAt: auction.completedAt || new Date(),
        },
        $unset: {
          winnerUserId: "",
          winningBidId: "",
        },
      }
    );

    console.log(
      `[COMPLETE AUCTION] ${auction.publicId} - No bids`
    );

    return {
      success: true,
      auctionId: auction.publicId,
      winner: null,
      winningBid: null,
      reason: "no_bids",
      modified: updateResult.modifiedCount,
    };
  }

  /*
   * =========================================================
   * COUNT BIDS BY AMOUNT
   * =========================================================
   */

  const amountCounts = new Map<number, number>();

  for (const bid of bids) {
    const amount = Number(bid.amount);

    amountCounts.set(
      amount,
      (amountCounts.get(amount) || 0) + 1
    );
  }

  /*
   * =========================================================
   * FIND LOWEST UNIQUE BID
   * =========================================================
   */

  let winningBid: (typeof bids)[number] | null = null;

  for (const bid of bids) {
    const amount = Number(bid.amount);

    if (amountCounts.get(amount) === 1) {
      winningBid = bid;
      break;
    }
  }

  /*
   * =========================================================
   * NO UNIQUE BID
   * =========================================================
   */

  if (!winningBid) {
    const updateResult = await Auction.updateOne(
      {
        _id: auction._id,
        status: {
          $ne: "cancelled",
        },
      },
      {
        $set: {
          status: "completed",
          completedAt: auction.completedAt || new Date(),
        },
        $unset: {
          winnerUserId: "",
          winningBidId: "",
        },
      }
    );

    console.log(
      `[COMPLETE AUCTION] ${auction.publicId} - No unique bid`
    );

    return {
      success: true,
      auctionId: auction.publicId,
      winner: null,
      winningBid: null,
      reason: "no_unique_bid",
      modified: updateResult.modifiedCount,
    };
  }

  /*
   * =========================================================
   * GET WINNER USER
   * =========================================================
   */

  const winnerUser = await User.findById(
    winningBid.userId
  )
    .select("name phone")
    .lean();

  if (!winnerUser) {
    console.error(
      `[COMPLETE AUCTION] Winner user not found for ${auction.publicId}`
    );

    throw new Error(
      `Winner user ${String(
        winningBid.userId
      )} was not found.`
    );
  }

  /*
   * =========================================================
   * SAVE WINNER
   * =========================================================
   */

  const completedAt =
    auction.completedAt || new Date();

  const updateResult = await Auction.updateOne(
    {
      _id: auction._id,
      status: {
        $ne: "cancelled",
      },
    },
    {
      $set: {
        status: "completed",
        completedAt,

        winnerUserId: winningBid.userId,
        winningBidId: winningBid._id,
      },
    }
  );

  console.log(
    `[COMPLETE AUCTION] ${auction.publicId} - Winner saved`
  );

  console.log(
    `[COMPLETE AUCTION] Winner: ${winnerUser.name} (${winnerUser.phone})`
  );

  console.log(
    `[COMPLETE AUCTION] Winning amount: ${winningBid.amount}`
  );

  /*
   * =========================================================
   * VERIFY DATABASE UPDATE
   * =========================================================
   *
   * This is important.
   *
   * We immediately read the auction again to make sure
   * winnerUserId and winningBidId actually exist in MongoDB.
   */

  const savedAuction = await Auction.findById(
    auction._id
  )
    .select(
      "publicId status winnerUserId winningBidId completedAt"
    )
    .lean();

  if (!savedAuction) {
    throw new Error(
      "Auction disappeared after completion."
    );
  }

  if (
    !savedAuction.winnerUserId ||
    !savedAuction.winningBidId
  ) {
    console.error(
      `[COMPLETE AUCTION] WINNER WAS NOT SAVED for ${auction.publicId}`
    );

    throw new Error(
      "Winner fields were not saved to the auction."
    );
  }

  /*
   * =========================================================
   * RETURN RESULT
   * =========================================================
   */

  return {
    success: true,

    auctionId: auction.publicId,

    winner: {
      userId: String(winningBid.userId),
      bidId: String(winningBid._id),
      name: winnerUser.name,
      phone: winnerUser.phone,
      amount: Number(winningBid.amount),
    },

    winningBid: Number(winningBid.amount),

    reason: "lowest_unique_bid",

    saved: {
      winnerUserId: String(
        savedAuction.winnerUserId
      ),
      winningBidId: String(
        savedAuction.winningBidId
      ),
    },

    modified: updateResult.modifiedCount,
  };
}