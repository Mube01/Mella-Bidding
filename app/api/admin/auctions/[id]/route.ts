import { NextResponse } from "next/server";

import { connectDB } from "../../../../lib/db";
import {
  isSameOriginRequest,
  requireAdmin,
} from "../../../../lib/auth";
import { completeAuction } from "../../../../lib/completeAuction";
import Auction from "../../../../models/auction";

const categories = [
  "Electronics",
  "Automotive",
  "Home",
  "Mystery Box",
];

type AuctionStatus =
  | "upcoming"
  | "live"
  | "completed";

/*
 * =========================================================
 * CALCULATE AUCTION STATUS
 * =========================================================
 */

function getAuctionStatus(
  startsAt: Date | string,
  endsAt: Date | string,
  now = new Date()
): AuctionStatus {
  const start =
    new Date(startsAt).getTime();

  const end =
    new Date(endsAt).getTime();

  const current =
    now.getTime();

  if (current < start) {
    return "upcoming";
  }

  if (current < end) {
    return "live";
  }

  return "completed";
}

/*
 * =========================================================
 * GET SINGLE AUCTION
 * =========================================================
 */

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const admin =
      await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin access required.",
        },
        {
          status: 403,
        }
      );
    }

    await connectDB();

    const { id } =
      await params;

    /*
     * Find the auction as a plain object.
     */
    const auction =
      await Auction.findOne({
        publicId: id,
      }).lean();

    if (!auction) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Auction not found.",
        },
        {
          status: 404,
        }
      );
    }

    const now = new Date();

    const calculatedStatus =
      getAuctionStatus(
        auction.startsAt,
        auction.endsAt,
        now
      );

    /*
     * =======================================================
     * EXPIRED AUCTION
     * =======================================================
     *
     * If the auction has ended, make sure the winner is
     * actually calculated.
     */

    if (
      calculatedStatus ===
        "completed" &&
      auction.status !==
        "cancelled"
    ) {
      const needsCompletion =
        auction.status !==
          "completed" ||
        !auction.winnerUserId ||
        !auction.winningBidId;

      if (needsCompletion) {
        try {
          await completeAuction(
            auction
          );
        } catch (completionError) {
          console.error(
            "ADMIN_AUCTION_COMPLETION_ERROR:",
            completionError
          );

          return NextResponse.json(
            {
              success: false,
              message:
                "Auction has ended, but the winner could not be determined.",
            },
            {
              status: 500,
            }
          );
        }
      }
    } else if (
      auction.status !==
        calculatedStatus &&
      auction.status !==
        "cancelled"
    ) {
      /*
       * Synchronize upcoming/live status.
       */
      await Auction.updateOne(
        {
          _id: auction._id,
        },
        {
          $set: {
            status:
              calculatedStatus,
          },
        }
      );
    }

    /*
     * =======================================================
     * ALWAYS RE-FETCH AS LEAN OBJECT
     * =======================================================
     *
     * This is intentional.
     *
     * We never mix a Mongoose document and a lean object.
     */

    const finalAuction =
      await Auction.findOne({
        publicId: id,
      }).lean();

    if (!finalAuction) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Auction could not be loaded.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * =======================================================
     * RESPONSE
     * =======================================================
     */

    return NextResponse.json({
      success: true,

      auction: {
        id:
          finalAuction.publicId,

        publicId:
          finalAuction.publicId,

        title:
          finalAuction.title.en,

        subtitle:
          finalAuction.subtitle.en,

        description:
          finalAuction.description.en,

        titleEn:
          finalAuction.title.en,

        titleAm:
          finalAuction.title.am,

        subtitleEn:
          finalAuction.subtitle.en,

        subtitleAm:
          finalAuction.subtitle.am,

        descriptionEn:
          finalAuction.description.en,

        descriptionAm:
          finalAuction.description.am,

        category:
          finalAuction.category,

        image:
          finalAuction.image,

        images:
          finalAuction.images || [],

        entryCost:
          finalAuction.entryCost,

        startsAt:
          finalAuction.startsAt,

        endsAt:
          finalAuction.endsAt,

        status:
          finalAuction.status,

        featured:
          finalAuction.featured,

        order:
          finalAuction.order ?? 0,

        participantCount:
          finalAuction.participantCount,

        bidCount:
          finalAuction.bidCount,

        winnerUserId:
          finalAuction.winnerUserId
            ? String(
                finalAuction.winnerUserId
              )
            : null,

        winningBidId:
          finalAuction.winningBidId
            ? String(
                finalAuction.winningBidId
              )
            : null,

        completedAt:
          finalAuction.completedAt ||
          null,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN_AUCTION_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load auction.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * =========================================================
 * UPDATE AUCTION
 * =========================================================
 */

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  if (
    !isSameOriginRequest(request)
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid request origin.",
      },
      {
        status: 403,
      }
    );
  }

  const admin =
    await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Admin access required.",
      },
      {
        status: 403,
      }
    );
  }

  try {
    await connectDB();

    const { id } =
      await params;

    /*
     * =======================================================
     * FIND EXISTING AUCTION
     * =======================================================
     */

    const existingAuction =
      await Auction.findOne({
        publicId: id,
      }).lean();

    if (!existingAuction) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Auction not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body =
      await request.json();

    /*
     * =======================================================
     * VALIDATE TEXT FIELDS
     * =======================================================
     */

    const requiredFields = [
      "titleEn",
      "titleAm",
      "subtitleEn",
      "subtitleAm",
      "descriptionEn",
      "descriptionAm",
    ];

    const hasLocaleFields =
      requiredFields.every(
        (field) =>
          typeof body[field] ===
            "string" &&
          body[field].trim()
      );

    if (!hasLocaleFields) {
      return NextResponse.json(
        {
          success: false,
          message:
            "English and Amharic title, subtitle, and description are required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =======================================================
     * VALIDATE CATEGORY
     * =======================================================
     */

    if (
      typeof body.category !==
        "string" ||
      !categories.includes(
        body.category
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid auction category.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =======================================================
     * VALIDATE IMAGE
     * =======================================================
     */

    if (
      typeof body.image !==
        "string" ||
      !body.image.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Auction image is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =======================================================
     * VALIDATE ENTRY COST
     * =======================================================
     */

    const entryCost =
      Number(body.entryCost);

    if (
      !Number.isFinite(
        entryCost
      ) ||
      entryCost < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid entry cost.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =======================================================
     * VALIDATE DATES
     * =======================================================
     */

    const startsAt =
      new Date(body.startsAt);

    const endsAt =
      new Date(body.endsAt);

    if (
      Number.isNaN(
        startsAt.getTime()
      ) ||
      Number.isNaN(
        endsAt.getTime()
      ) ||
      endsAt <= startsAt
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid auction dates.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =======================================================
     * DETERMINE NEW STATUS
     * =======================================================
     */

    const now = new Date();

    const newStatus =
      getAuctionStatus(
        startsAt,
        endsAt,
        now
      );

    /*
     * =======================================================
     * DETECT DATE CHANGE
     * =======================================================
     */

    const oldStartTime =
      new Date(
        existingAuction.startsAt
      ).getTime();

    const oldEndTime =
      new Date(
        existingAuction.endsAt
      ).getTime();

    const newStartTime =
      startsAt.getTime();

    const newEndTime =
      endsAt.getTime();

    const dateChanged =
      oldStartTime !==
        newStartTime ||
      oldEndTime !==
        newEndTime;

    /*
     * =======================================================
     * BUILD UPDATE
     * =======================================================
     */

    const updateData = {
      title: {
        en:
          body.titleEn.trim(),
        am:
          body.titleAm.trim(),
      },

      subtitle: {
        en:
          body.subtitleEn.trim(),
        am:
          body.subtitleAm.trim(),
      },

      description: {
        en:
          body.descriptionEn.trim(),
        am:
          body.descriptionAm.trim(),
      },

      category:
        body.category,

      image:
        body.image.trim(),

      images:
        Array.isArray(
          body.images
        )
          ? body.images.filter(
              (url: unknown) =>
                typeof url ===
                  "string" &&
                url.trim()
            )
          : [],

      entryCost,

      startsAt,
      endsAt,

      status:
        newStatus,

      featured:
        typeof body.featured ===
        "boolean"
          ? body.featured
          : existingAuction.featured,

      order:
        Number.isFinite(
          Number(body.order)
        )
          ? Number(body.order)
          : existingAuction.order ??
            0,
    };

    /*
     * =======================================================
     * SAVE UPDATE
     * =======================================================
     */

    if (
      dateChanged &&
      (
        newStatus ===
          "upcoming" ||
        newStatus ===
          "live"
      )
    ) {
      /*
       * Auction is being reopened.
       *
       * Remove the previous winner.
       */

      await Auction.updateOne(
        {
          _id:
            existingAuction._id,
        },
        {
          $set:
            updateData,

          $unset: {
            winnerUserId: "",
            winningBidId: "",
            completedAt: "",
          },
        }
      );
    } else if (
      dateChanged &&
      newStatus ===
        "completed"
    ) {
      /*
       * Auction was moved into the past.
       *
       * Remove any previous winner first.
       * completeAuction() will calculate the new one.
       */

      await Auction.updateOne(
        {
          _id:
            existingAuction._id,
        },
        {
          $set:
            updateData,

          $unset: {
            winnerUserId: "",
            winningBidId: "",
            completedAt: "",
          },
        }
      );
    } else {
      /*
       * Normal update.
       */

      await Auction.updateOne(
        {
          _id:
            existingAuction._id,
        },
        {
          $set:
            updateData,
        }
      );
    }

    /*
     * =======================================================
     * RE-FETCH AFTER UPDATE
     * =======================================================
     */

    let updatedAuction =
      await Auction.findOne({
        publicId: id,
      }).lean();

    if (!updatedAuction) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Auction could not be loaded after update.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * =======================================================
     * DETERMINE WINNER IF COMPLETED
     * =======================================================
     *
     * This is the important fix.
     */

    if (
      newStatus ===
        "completed" &&
      updatedAuction.status !==
        "cancelled"
    ) {
      try {
        /*
         * completeAuction() accepts the plain object.
         */
        await completeAuction(
          updatedAuction
        );
      } catch (completionError) {
        console.error(
          "ADMIN_AUCTION_UPDATE_COMPLETION_ERROR:",
          completionError
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Auction date was updated, but the winner could not be determined.",
          },
          {
            status: 500,
          }
        );
      }

      /*
       * IMPORTANT:
       *
       * Re-fetch as lean.
       *
       * We do NOT assign this to a Mongoose document.
       */

      updatedAuction =
        await Auction.findOne({
          publicId: id,
        }).lean();

      if (!updatedAuction) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Auction could not be loaded after completion.",
          },
          {
            status: 500,
          }
        );
      }
    }

    /*
     * =======================================================
     * RESPONSE
     * =======================================================
     */

    return NextResponse.json({
      success: true,

      message:
        updatedAuction.status ===
        "completed"
          ? "Auction updated and winner determined successfully."
          : "Auction updated successfully.",

      auction: {
        id:
          updatedAuction.publicId,

        publicId:
          updatedAuction.publicId,

        title:
          updatedAuction.title.en,

        subtitle:
          updatedAuction.subtitle.en,

        description:
          updatedAuction.description.en,

        titleEn:
          updatedAuction.title.en,

        titleAm:
          updatedAuction.title.am,

        subtitleEn:
          updatedAuction.subtitle.en,

        subtitleAm:
          updatedAuction.subtitle.am,

        descriptionEn:
          updatedAuction.description.en,

        descriptionAm:
          updatedAuction.description.am,

        category:
          updatedAuction.category,

        image:
          updatedAuction.image,

        images:
          updatedAuction.images ||
          [],

        entryCost:
          updatedAuction.entryCost,

        startsAt:
          updatedAuction.startsAt,

        endsAt:
          updatedAuction.endsAt,

        status:
          updatedAuction.status,

        featured:
          updatedAuction.featured,

        order:
          updatedAuction.order ??
          0,

        participantCount:
          updatedAuction.participantCount,

        bidCount:
          updatedAuction.bidCount,

        winnerUserId:
          updatedAuction.winnerUserId
            ? String(
                updatedAuction.winnerUserId
              )
            : null,

        winningBidId:
          updatedAuction.winningBidId
            ? String(
                updatedAuction.winningBidId
              )
            : null,

        completedAt:
          updatedAuction.completedAt ||
          null,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN_AUCTION_UPDATE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update auction.",
      },
      {
        status: 500,
      }
    );
  }
}