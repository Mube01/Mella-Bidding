import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import Auction from "../../models/auction";
import { getAuctionStatus } from "../../lib/auction";

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const includeAll = url.searchParams.get("all") === "true";
    const featuredOnly = url.searchParams.get("featured") === "true";
    const language = url.searchParams.get("lang") === "am" ? "am" : "en";
    if (featuredOnly) {
      const featured = await Auction.findOne({ featured: true }).lean();
      return NextResponse.json({
        success: true,
        auctions: featured ? [{ ...featured, id: featured.publicId, titleEn: featured.title.en, titleAm: featured.title.am, subtitleEn: featured.subtitle.en, subtitleAm: featured.subtitle.am, descriptionEn: featured.description.en, descriptionAm: featured.description.am, title: featured.title[language], subtitle: featured.subtitle[language], description: featured.description[language], status: getAuctionStatus(featured), _id: undefined }] : [],
      });
    }
    const auctions = includeAll
      ? await Auction.find().sort({ endsAt: 1 }).lean()
      : await Auction.find({
          status: { $in: ["upcoming", "live"] as const },
        }).sort({ endsAt: 1 }).lean();

    return NextResponse.json({
      success: true,
      auctions: auctions.map((auction) => ({
        ...auction,
        id: auction.publicId,
        title: auction.title[language],
        subtitle: auction.subtitle[language],
        description: auction.description[language],
        titleEn: auction.title.en,
        titleAm: auction.title.am,
        subtitleEn: auction.subtitle.en,
        subtitleAm: auction.subtitle.am,
        descriptionEn: auction.description.en,
        descriptionAm: auction.description.am,
        status: getAuctionStatus(auction),
        _id: undefined,
      })),
    });
  } catch (error) {
    console.error("AUCTIONS_GET_ERROR:", error);
    return NextResponse.json({ success: false, message: "Unable to load auctions." }, { status: 500 });
  }
}