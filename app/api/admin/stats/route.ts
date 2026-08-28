import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Auction from "../../../models/auction";
import Bid from "../../../models/bid";
import User from "../../../models/user";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
  await connectDB();
  const [users, auctions, bids] = await Promise.all([User.countDocuments(), Auction.countDocuments(), Bid.countDocuments()]);
  const live = await Auction.countDocuments({ status: "live" });
  return NextResponse.json({ success: true, stats: { users, auctions, bids, live } });
}