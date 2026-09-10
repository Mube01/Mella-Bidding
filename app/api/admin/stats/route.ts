import { NextResponse } from "next/server";

import { connectDB } from "../../../lib/db";
import Auction from "../../../models/auction";
import Bid from "../../../models/bid";
import User from "../../../models/user";
import { getAuctionStatus } from "../../../lib/auction";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    /*
     * =========================================================
     * GET AUCTIONS
     * =========================================================
     */

    const auctions = await Auction.find()
      .sort({
        createdAt: -1,
      })
      .lean();

    /*
     * =========================================================
     * CALCULATE REAL AUCTION STATUS
     * =========================================================
     */

    const liveAuctions = auctions.filter(
      (auction) =>
        getAuctionStatus(auction) === "live"
    );

    const completedAuctions = auctions.filter(
      (auction) =>
        getAuctionStatus(auction) === "completed"
    );

    /*
     * =========================================================
     * DATABASE COUNTS
     * =========================================================
     */

    const [
      totalUsers,
      totalBids,
    ] = await Promise.all([
      User.countDocuments(),
      Bid.countDocuments(),
    ]);

    /*
     * =========================================================
     * ACTIVE AUCTIONS
     * =========================================================
     */

    const activeAuctions = liveAuctions
      .sort(
        (a, b) =>
          new Date(a.endsAt).getTime() -
          new Date(b.endsAt).getTime()
      )
      .slice(0, 5)
      .map((auction) => ({
        id: auction.publicId,
        title:
          auction.title?.en ||
          auction.publicId,
        category: auction.category,
        participants:
          Number(auction.participantCount) || 0,
        bidCount:
          Number(auction.bidCount) || 0,
        endsAt: auction.endsAt,
        status: "Live",
      }));

    /*
     * =========================================================
     * RECENT AUCTIONS
     * =========================================================
     */

    const recentAuctions = await Auction.find()
      .sort({
        createdAt: -1,
      })
      .limit(3)
      .select(
        "publicId title createdAt status"
      )
      .lean();

    /*
     * =========================================================
     * RECENT BIDS
     * =========================================================
     */

    const recentBids = await Bid.find()
      .sort({
        createdAt: -1,
      })
      .limit(3)
      .populate({
        path: "auctionId",
        select: "publicId title",
      })
      .lean();

    /*
     * =========================================================
     * RECENT USERS
     * =========================================================
     */

    const recentUsers = await User.find()
      .sort({
        createdAt: -1,
      })
      .limit(3)
      .select("name createdAt")
      .lean();

    /*
     * =========================================================
     * BUILD ACTIVITY FEED
     * =========================================================
     */

    const activities = [
      ...recentAuctions.map((auction) => ({
        type: "auction",
        title:
          auction.status === "completed"
            ? "Auction completed"
            : "New auction created",
        description:
          auction.status === "completed"
            ? `${auction.title?.en || auction.publicId} auction was completed`
            : `${auction.title?.en || auction.publicId} was added`,
        time: auction.createdAt,
        timestamp:
          new Date(auction.createdAt).getTime(),
      })),

      ...recentBids.map((bid) => {
        const auction =
          bid.auctionId as any;

        const auctionTitle =
          auction?.title?.en ||
          auction?.publicId ||
          "an auction";

        return {
          type: "bid",
          title: "New bid submitted",
          description: `A bid was placed on ${auctionTitle}`,
          time: bid.createdAt,
          timestamp:
            new Date(bid.createdAt).getTime(),
        };
      }),

      ...recentUsers.map((user) => ({
        type: "user",
        title: "New user registered",
        description: `${user.name} created a Mella account`,
        time: user.createdAt,
        timestamp:
          new Date(user.createdAt).getTime(),
      })),
    ]
      .sort(
        (a, b) =>
          b.timestamp - a.timestamp
      )
      .slice(0, 6);

    /*
     * =========================================================
     * RESPONSE
     * =========================================================
     */

    return NextResponse.json({
      success: true,

      stats: {
        live: liveAuctions.length,
        users: totalUsers,
        bids: totalBids,
        completed: completedAuctions.length,
      },

      activeAuctions,

      activities,
    });
  } catch (error) {
    console.error(
      "ADMIN_STATS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load dashboard data.",
      },
      {
        status: 500,
      }
    );
  }
}