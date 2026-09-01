import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { getAuctionStatus } from "../../../lib/auction";
import Auction from "../../../models/auction";
import Bid from "../../../models/bid";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const language = new URL(_request.url).searchParams.get("lang") === "am" ? "am" : "en";
    const auction = await Auction.findOne({ publicId: id }).lean();

    if (!auction) return NextResponse.json({ success: false, message: "Auction not found." }, { status: 404 });

    const bids = await Bid.find({ auctionId: auction._id }).sort({ createdAt: -1 }).select("amount userId createdAt").lean();
    return NextResponse.json({
      success: true,
      auction: { ...auction, id: auction.publicId, title: auction.title[language], subtitle: auction.subtitle[language], description: auction.description[language], titleEn: auction.title.en, titleAm: auction.title.am, subtitleEn: auction.subtitle.en, subtitleAm: auction.subtitle.am, descriptionEn: auction.description.en, descriptionAm: auction.description.am, images: auction.images || [], status: getAuctionStatus(auction), _id: undefined },
      bids: bids.map((bid) => ({ amount: bid.amount, createdAt: bid.createdAt })),
    });
  } catch (error) {
    console.error("AUCTION_GET_ERROR:", error);
    return NextResponse.json({ success: false, message: "Unable to load auction." }, { status: 500 });
  }
}