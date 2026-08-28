import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { isSameOriginRequest, requireAdmin } from "../../../lib/auth";
import Auction from "../../../models/auction";
import { randomInt } from "crypto";

const categories = ["Electronics", "Automotive", "Home", "Mystery Box"];

async function createAuctionId() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const publicId = `M${String(randomInt(1, 1000000)).padStart(6, "0")}`;
    if (!(await Auction.exists({ publicId }))) return publicId;
  }
  throw new Error("Unable to generate a unique auction ID");
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
  await connectDB();
  const auctions = await Auction.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    success: true,
    auctions: auctions.map((auction) => ({
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
      participantCount: auction.participantCount,
      bidCount: auction.bidCount,
    })),
  });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ success: false, message: "Invalid request origin." }, { status: 403 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });

  try {
    const body = await request.json();
    const hasLocaleFields = ["titleEn", "titleAm", "subtitleEn", "subtitleAm", "descriptionEn", "descriptionAm"]
      .every((field) => typeof body[field] === "string" && body[field].trim());
    if (!hasLocaleFields || typeof body.category !== "string" || !categories.includes(body.category) || typeof body.image !== "string" || !body.image.trim() || !Number.isFinite(Number(body.entryCost))) {
      return NextResponse.json({ success: false, message: "Invalid auction data." }, { status: 400 });
    }
    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(body.endsAt);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt || Number(body.entryCost) < 0) {
      return NextResponse.json({ success: false, message: "Invalid auction dates or entry cost." }, { status: 400 });
    }
    await connectDB();
    const publicId = await createAuctionId();
    const auction = await Auction.create({
      publicId,
      title: { en: body.titleEn.trim(), am: body.titleAm.trim() },
      subtitle: { en: body.subtitleEn.trim(), am: body.subtitleAm.trim() },
      description: { en: body.descriptionEn.trim(), am: body.descriptionAm.trim() },
      category: body.category,
      image: body.image.trim(),
      entryCost: Number(body.entryCost),
      startsAt,
      endsAt,
    });
    return NextResponse.json({ success: true, auction }, { status: 201 });
  } catch (error) {
    console.error("ADMIN_AUCTION_CREATE_ERROR:", error);
    return NextResponse.json({ success: false, message: "Unable to create auction." }, { status: 500 });
  }
}