import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Auction from "../../../models/auction";
import Bid from "../../../models/bid";

function maskPhone(phone: string | undefined): string | null {
  if (!phone) return null;
  const normalized = phone.replace(/\s+/g, "");
  if (normalized.length <= 4) return "****";
  return `${normalized.slice(0, 3)}****${normalized.slice(-2)}`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const language = new URL(request.url).searchParams.get("lang") === "am" ? "am" : "en";
    const auction = await Auction.findOne({ publicId: id }).lean();

    if (!auction || auction.status !== "completed") {
      return NextResponse.json({ success: false, message: "Result not found." }, { status: 404 });
    }

    const breakdown = await Bid.aggregate<{ _id: number; submissions: number }>([
      { $match: { auctionId: auction._id } },
      { $group: { _id: "$amount", submissions: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const winningBid = auction.winningBidId
      ? await Bid.findById(auction.winningBidId)
          .select("amount userId")
          .populate("userId", "name phone")
          .lean()
      : null;
        const winner = winningBid?.userId as { name?: string; phone?: string } | undefined;

    return NextResponse.json({
      success: true,
      result: {
        id: auction.publicId,
        title: auction.title[language],
        subtitle: auction.subtitle[language],
        description: auction.description[language],
        image: auction.image,
        category: auction.category,
        date: auction.completedAt || auction.updatedAt,
        participants: auction.participantCount,
        winningBid: winningBid?.amount || null,
        winnerName: winner?.name || null,
        winnerPhone: maskPhone(winner?.phone),
        breakdown: breakdown.map((item) => ({
          amount: item._id,
          submissions: item.submissions,
          unique: item.submissions === 1,
          winner: Boolean(winningBid && item._id === winningBid.amount),
        })),
      },
    });
  } catch (error) {
    console.error("RESULT_DETAIL_GET_ERROR:", error);
    return NextResponse.json({ success: false, message: "Unable to load result." }, { status: 500 });
  }
}