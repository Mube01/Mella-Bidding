import { NextResponse } from "next/server";
import { getCurrentUser } from "../../lib/auth";
import { connectDB } from "../../lib/db";
import Auction from "../../models/auction";
import Bid from "../../models/bid";
import { getAuctionStatus } from "../../lib/auction";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  await connectDB();
  const language = new URL(request.url).searchParams.get("lang") === "am" ? "am" : "en";
  const bids = await Bid.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
  const auctions = await Auction.find({ _id: { $in: bids.map((bid) => bid.auctionId) } }).lean();
  return NextResponse.json({
    success: true,
    auctions: auctions.map((auction) => {
      const userBids = bids.filter((bid) => bid.auctionId.toString() === auction._id.toString());
      const status = getAuctionStatus(auction);
      return {
        id: auction.publicId,
        title: auction.title[language],
        image: auction.image,
        category: auction.category,
        status: auction.winnerUserId && auction.winnerUserId.toString() === user._id.toString()
          ? "won"
          : status === "live" || status === "upcoming" ? "active" : "ended",
        myBid: userBids[0]?.amount || 0,
        totalBids: userBids.length,
        endDate: auction.endsAt,
        won: Boolean(auction.winnerUserId && auction.winnerUserId.toString() === user._id.toString()),
      };
    }),
  });
}