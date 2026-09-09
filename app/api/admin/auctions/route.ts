import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { isSameOriginRequest, requireAdmin } from "../../../lib/auth";
import Auction from "../../../models/auction";
import { randomInt } from "crypto";

const categories = [
  "Electronics",
  "Automotive",
  "Home",
  "Mystery Box",
];

type AuctionStatus = "upcoming" | "live" | "completed";

function getAuctionStatus(
  startsAt: Date | string,
  endsAt: Date | string,
  now = new Date()
): AuctionStatus {
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  const current = now.getTime();

  if (current < start) {
    return "upcoming";
  }

  if (current < end) {
    return "live";
  }

  return "completed";
}

async function createAuctionId() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const publicId = `M${String(randomInt(1, 1000000)).padStart(6, "0")}`;

    if (!(await Auction.exists({ publicId }))) {
      return publicId;
    }
  }

  throw new Error("Unable to generate a unique auction ID");
}

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const auctions = await Auction.find()
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();

    const now = new Date();

    /*
     * Calculate the real status from startsAt / endsAt.
     *
     * This means:
     *
     * Future auction  -> upcoming
     * Running auction -> live
     * Expired auction -> completed
     *
     * We also update the database when an auction has expired.
     */
    const updatedAuctions = await Promise.all(
      auctions.map(async (auction) => {
        const calculatedStatus = getAuctionStatus(
          auction.startsAt,
          auction.endsAt,
          now
        );

        /*
         * Keep the database status synchronized.
         *
         * Only update when the calculated status is different.
         */
        if (auction.status !== calculatedStatus) {
          const updateData: Record<string, unknown> = {
            status: calculatedStatus,
          };

          /*
           * Save completion time when an auction becomes completed.
           */
          if (
            calculatedStatus === "completed" &&
            !auction.completedAt
          ) {
            updateData.completedAt = now;
          }

          await Auction.updateOne(
            { _id: auction._id },
            {
              $set: updateData,
            }
          );

          return {
            ...auction,
            status: calculatedStatus,
            completedAt:
              calculatedStatus === "completed"
                ? auction.completedAt || now
                : auction.completedAt,
          };
        }

        return auction;
      })
    );

    return NextResponse.json({
      success: true,

      auctions: updatedAuctions.map((auction) => ({
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
        images: auction.images || [],

        entryCost: auction.entryCost,

        startsAt: auction.startsAt,
        endsAt: auction.endsAt,

        /*
         * This is now the calculated/synchronized status.
         */
        status: auction.status,

        featured: auction.featured,

        // Admin controlled order
        order: auction.order ?? 0,

        participantCount: auction.participantCount,
        bidCount: auction.bidCount,

        completedAt: auction.completedAt || null,
      })),
    });
  } catch (error) {
    console.error("ADMIN_AUCTIONS_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load auctions.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request origin.",
      },
      { status: 403 }
    );
  }

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        success: false,
        message: "Admin access required.",
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const hasLocaleFields = [
      "titleEn",
      "titleAm",
      "subtitleEn",
      "subtitleAm",
      "descriptionEn",
      "descriptionAm",
    ].every(
      (field) =>
        typeof body[field] === "string" &&
        body[field].trim()
    );

    if (
      !hasLocaleFields ||
      typeof body.category !== "string" ||
      !categories.includes(body.category) ||
      typeof body.image !== "string" ||
      !body.image.trim() ||
      !Number.isFinite(Number(body.entryCost))
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid auction data.",
        },
        { status: 400 }
      );
    }

    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(body.endsAt);

    if (
      Number.isNaN(startsAt.getTime()) ||
      Number.isNaN(endsAt.getTime()) ||
      endsAt <= startsAt ||
      Number(body.entryCost) < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid auction dates or entry cost.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    /*
     * Put new auctions at the bottom.
     */
    const lastAuction = await Auction.findOne()
      .sort({ order: -1 })
      .select({ order: 1 })
      .lean();

    const nextOrder =
      typeof lastAuction?.order === "number"
        ? lastAuction.order + 1
        : 0;

    const publicId = await createAuctionId();

    /*
     * Determine the initial status from the dates.
     */
    const initialStatus = getAuctionStatus(
      startsAt,
      endsAt
    );

    const auction = await Auction.create({
      publicId,

      title: {
        en: body.titleEn.trim(),
        am: body.titleAm.trim(),
      },

      subtitle: {
        en: body.subtitleEn.trim(),
        am: body.subtitleAm.trim(),
      },

      description: {
        en: body.descriptionEn.trim(),
        am: body.descriptionAm.trim(),
      },

      category: body.category,

      image: body.image.trim(),

      images: Array.isArray(body.images)
        ? body.images.filter(
            (url: unknown) =>
              typeof url === "string" && url.trim()
          )
        : [],

      entryCost: Number(body.entryCost),

      startsAt,
      endsAt,

      /*
       * Set the correct initial status.
       */
      status: initialStatus,

      // New auctions start at the bottom
      order: nextOrder,
    });

    return NextResponse.json(
      {
        success: true,
        auction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "ADMIN_AUCTION_CREATE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create auction.",
      },
      { status: 500 }
    );
  }
}