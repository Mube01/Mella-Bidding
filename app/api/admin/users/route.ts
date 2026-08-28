import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import User from "../../../models/user";
import Bid from "../../../models/bid";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
  await connectDB();
  const users = await User.find().select("name phone email role createdAt").sort({ createdAt: -1 }).limit(500).lean();
  const counts = await Bid.aggregate<{ _id: unknown; count: number }>([
    { $group: { _id: "$userId", count: { $sum: 1 } } },
  ]);
  const bidCounts = new Map(counts.map((item) => [String(item._id), item.count]));
  return NextResponse.json({
    success: true,
    users: users.map((user) => ({ ...user, bids: bidCounts.get(String(user._id)) || 0 })),
  });
}