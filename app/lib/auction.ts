import { Types } from "mongoose";
import { AuctionStatus, IAuction } from "../models/auction";
import Bid from "../models/bid";

export function getAuctionStatus(auction: Pick<IAuction, "startsAt" | "endsAt" | "status">): AuctionStatus {
  if (auction.status === "cancelled" || auction.status === "completed") return auction.status;
  const now = Date.now();
  if (now < new Date(auction.startsAt).getTime()) return "upcoming";
  if (now >= new Date(auction.endsAt).getTime()) return "completed";
  return "live";
}

export async function calculateWinner(auctionId: string) {
  const amounts = await Bid.aggregate<{ _id: number; count: number }>([
    { $match: { auctionId: new Types.ObjectId(auctionId) } },
    { $group: { _id: "$amount", count: { $sum: 1 } } },
    { $match: { count: 1 } },
    { $sort: { _id: 1 } },
    { $limit: 1 },
  ]);

  if (!amounts[0]) return null;

  return Bid.findOne({ auctionId: new Types.ObjectId(auctionId), amount: amounts[0]._id }).sort({ createdAt: 1 });
}