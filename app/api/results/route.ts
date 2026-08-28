import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import Auction from "../../models/auction";
import User from "../../models/user";
import Bid from "../../models/bid";

export async function GET(request: Request) {
  try {
    await connectDB();
    const language = new URL(request.url).searchParams.get("lang") === "am" ? "am" : "en";
    const auctions = await Auction.find({ status: "completed", winnerUserId: { $exists: true } }).sort({ completedAt: -1 }).lean();
    const results = await Promise.all(auctions.map(async (auction) => {
      const [winner, bid] = await Promise.all([
        User.findById(auction.winnerUserId).select("name").lean(),
        Bid.findById(auction.winningBidId).select("amount").lean(),
      ]);
      return {
        id: auction.publicId,
        title: auction.title[language],
        subtitle: auction.subtitle[language],
        image: auction.image,
        category: auction.category,
        winner: winner?.name || "Winner",
        winningBid: bid?.amount || 0,
        date: auction.completedAt || auction.updatedAt,
        participants: auction.participantCount,
        description: auction.description[language],
      };
    }));
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("RESULTS_GET_ERROR:", error);
    return NextResponse.json({ success: false, message: "Unable to load results." }, { status: 500 });
  }
}