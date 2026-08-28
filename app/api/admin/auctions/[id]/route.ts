import { NextResponse } from "next/server";
import { isSameOriginRequest, requireAdmin } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/db";
import Auction from "../../../../models/auction";
import { calculateWinner } from "../../../../lib/auction";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ success: false, message: "Invalid request origin." }, { status: 403 });
  if (!(await requireAdmin())) return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
  try {
    const { id } = await params;
    const body = await request.json();
    const update: Record<string, unknown> = {};
    if (typeof body.category === "string") {
      if (!["Electronics", "Automotive", "Home", "Mystery Box"].includes(body.category)) return NextResponse.json({ success: false, message: "Invalid category." }, { status: 400 });
      update.category = body.category;
    }
    if (typeof body.image === "string") update.image = body.image.trim();
    if (typeof body.status === "string") update.status = body.status.trim();
    for (const [field, key] of [["titleEn", "en"], ["titleAm", "am"]] as const) {
      if (typeof body[field] === "string") update[`title.${key}`] = body[field].trim();
    }
    for (const [field, key] of [["subtitleEn", "en"], ["subtitleAm", "am"]] as const) {
      if (typeof body[field] === "string") update[`subtitle.${key}`] = body[field].trim();
    }
    for (const [field, key] of [["descriptionEn", "en"], ["descriptionAm", "am"]] as const) {
      if (typeof body[field] === "string") update[`description.${key}`] = body[field].trim();
    }
    if (typeof body.featured === "boolean") update.featured = body.featured;
    if (body.entryCost !== undefined) {
      const entryCost = Number(body.entryCost);
      if (!Number.isFinite(entryCost) || entryCost < 0) return NextResponse.json({ success: false, message: "Invalid entry cost." }, { status: 400 });
      update.entryCost = entryCost;
    }
    if (body.startsAt || body.endsAt) {
      const auction = await Auction.findOne({ publicId: id });
      if (!auction) return NextResponse.json({ success: false, message: "Auction not found." }, { status: 404 });
      const startsAt = body.startsAt ? new Date(body.startsAt) : auction.startsAt;
      const endsAt = body.endsAt ? new Date(body.endsAt) : auction.endsAt;
      if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) return NextResponse.json({ success: false, message: "Invalid auction dates." }, { status: 400 });
      update.startsAt = startsAt;
      update.endsAt = endsAt;
    }
    await connectDB();
    if (update.featured === true) {
      await Auction.updateMany({}, { $set: { featured: false } });
    }
    let auction = await Auction.findOneAndUpdate({ publicId: id }, { $set: update }, { new: true }).lean();
    if (!auction) return NextResponse.json({ success: false, message: "Auction not found." }, { status: 404 });

    if (update.status === "completed") {
      const winner = await calculateWinner(auction._id.toString());
      auction = await Auction.findByIdAndUpdate(
        auction._id,
        {
          $set: {
            winnerUserId: winner?.userId,
            winningBidId: winner?._id,
            completedAt: new Date(),
          },
        },
        { new: true }
      ).lean();
    }
    return NextResponse.json({
      success: true,
      auction: auction
        ? {
            id: auction.publicId,
            publicId: auction.publicId,
            title: auction.title.en,
            subtitle: auction.subtitle.en,
            description: auction.description.en,
            titleEn: auction.title.en,
            titleAm: auction.title.am,
            subtitleEn: auction.subtitle.en,
            subtitleAm: auction.subtitle.am,
            descriptionEn: auction.description.en,
            descriptionAm: auction.description.am,
            category: auction.category,
            image: auction.image,
            entryCost: auction.entryCost,
            startsAt: auction.startsAt,
            endsAt: auction.endsAt,
            status: auction.status,
            featured: auction.featured,
          }
        : null,
    });
  } catch (error) {
    console.error("ADMIN_AUCTION_UPDATE_ERROR:", error);
    return NextResponse.json({ success: false, message: "Unable to update auction." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ success: false, message: "Invalid request origin." }, { status: 403 });
  if (!(await requireAdmin())) return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
  await connectDB();
  const { id } = await params;
  const deleted = await Auction.findOneAndDelete({ publicId: id });
  if (!deleted) return NextResponse.json({ success: false, message: "Auction not found." }, { status: 404 });
  return NextResponse.json({ success: true });
}