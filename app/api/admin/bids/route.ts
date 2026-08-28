import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Bid from "../../../models/bid";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
  await connectDB();
  const bids = await Bid.find().populate("userId", "name phone email").populate("auctionId", "publicId title").sort({ createdAt: -1 }).limit(500).lean();
  return NextResponse.json({ success: true, bids });
}