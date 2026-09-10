import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Auction from "../../../models/auction";
import Bid from "../../../models/bid";
import User from "../../../models/user";
import {
  getAuctionStatus,
  calculateWinner,
} from "../../../lib/auction";

/* =============================================================
   MASK PHONE
============================================================= */

function maskPhone(
  phone: string | undefined
): string | null {
  if (!phone) return null;

  const normalized = phone.replace(/\s+/g, "");

  /*
   * Ethiopian international format:
   * +251912345678
   * → +251 912••••78
   */
  if (normalized.startsWith("+251")) {
    const local = normalized.slice(4);

    if (local.length >= 7) {
      return `+251 ${local.slice(
        0,
        3
      )}••••${local.slice(-2)}`;
    }
  }

  /*
   * Ethiopian international format without +:
   * 251912345678
   * → +251 912••••78
   */
  if (normalized.startsWith("251")) {
    const local = normalized.slice(3);

    if (local.length >= 7) {
      return `+251 ${local.slice(
        0,
        3
      )}••••${local.slice(-2)}`;
    }
  }

  /*
   * Ethiopian local format:
   * 0912345678
   * → 0912••••78
   */
  if (normalized.startsWith("09")) {
    if (normalized.length >= 8) {
      return `${normalized.slice(
        0,
        4
      )}••••${normalized.slice(-2)}`;
    }
  }

  /*
   * Generic fallback
   */
  if (normalized.length >= 6) {
    return `${normalized.slice(
      0,
      3
    )}••••${normalized.slice(-2)}`;
  }

  return "****";
}

/* =============================================================
   GET RESULT
============================================================= */

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
    await connectDB();

    const { id } = await params;

    const language =
      new URL(request.url).searchParams.get(
        "lang"
      ) === "am"
        ? "am"
        : "en";

    /* =========================================================
       FIND AUCTION
    ========================================================= */

    const auction =
      await Auction.findOne({
        publicId: id,
      }).lean();

    if (!auction) {
      return NextResponse.json(
        {
          success: false,
          message: "Result not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================================================
       CALCULATE REAL STATUS
    ========================================================= */

    const status =
      getAuctionStatus(auction);

    if (status !== "completed") {
      return NextResponse.json(
        {
          success: false,
          message: "Result not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================================================
       CALCULATE + SAVE WINNER
    ========================================================= */

    const needsWinner =
      !auction.winningBidId ||
      !auction.winnerUserId;

    if (needsWinner) {
      const winner =
        await calculateWinner(
          auction._id.toString()
        );

      const updateData: Record<
        string,
        unknown
      > = {
        status: "completed",
      };

      if (!auction.completedAt) {
        updateData.completedAt =
          auction.endsAt;
      }

      if (winner) {
        updateData.winningBidId =
          winner._id;

        updateData.winnerUserId =
          winner.userId;

        auction.winningBidId =
          winner._id;

        auction.winnerUserId =
          winner.userId;
      }

      await Auction.updateOne(
        {
          _id: auction._id,
        },
        {
          $set: updateData,
        }
      );
    } else if (
      auction.status !== "completed" ||
      !auction.completedAt
    ) {
      await Auction.updateOne(
        {
          _id: auction._id,
        },
        {
          $set: {
            status: "completed",

            ...(auction.completedAt
              ? {}
              : {
                  completedAt:
                    auction.endsAt,
                }),
          },
        }
      );
    }

    /* =========================================================
       GET ALL BIDS
       
       We need the userId for every bid so that we can display
       the masked phone number of every bidder.
    ========================================================= */

    const allBids =
      await Bid.find({
        auctionId: auction._id,
      })
        .select(
          "amount userId createdAt"
        )
        .sort({
          amount: 1,
          createdAt: 1,
        })
        .lean();

    /* =========================================================
       GET ALL BIDDER USERS
    ========================================================= */

    const userIds = [
      ...new Set(
        allBids.map((bid) =>
          bid.userId.toString()
        )
      ),
    ];

    const users =
      userIds.length > 0
        ? await User.find({
            _id: {
              $in: userIds,
            },
          })
            .select("_id phone")
            .lean()
        : [];

    /* =========================================================
       USER PHONE MAP
    ========================================================= */

    const userPhoneMap =
      new Map<
        string,
        string | null
      >();

    for (const user of users) {
      userPhoneMap.set(
        user._id.toString(),
        maskPhone(user.phone)
      );
    }

    /* =========================================================
       GROUP BIDS BY AMOUNT
    ========================================================= */

    type BreakdownGroup = {
      amount: number;
      phoneNumbers: string[];
    };

    const breakdownMap =
      new Map<
        number,
        BreakdownGroup
      >();

    for (const bid of allBids) {
      const amount = Number(
        bid.amount
      );

      const phone =
        userPhoneMap.get(
          bid.userId.toString()
        ) ?? "****";

      const existing =
        breakdownMap.get(amount);

      if (existing) {
        existing.phoneNumbers.push(
          phone
        );
      } else {
        breakdownMap.set(amount, {
          amount,
          phoneNumbers: [phone],
        });
      }
    }

    /* =========================================================
       WINNING BID
    ========================================================= */

    const winningBid =
      auction.winningBidId
        ? await Bid.findById(
            auction.winningBidId
          )
            .select(
              "amount userId"
            )
            .lean()
        : null;

    /* =========================================================
       WINNER
    ========================================================= */

    let winner = null;

    if (auction.winnerUserId) {
      winner =
        await User.findById(
          auction.winnerUserId
        )
          .select("name phone")
          .lean();
    }

    /* =========================================================
       WINNING AMOUNT
    ========================================================= */

    const winningAmount =
      winningBid
        ? Number(
            winningBid.amount
          )
        : null;

    /* =========================================================
       FINAL BREAKDOWN
    ========================================================= */

    const breakdown =
      Array.from(
        breakdownMap.values()
      )
        .sort(
          (a, b) =>
            a.amount - b.amount
        )
        .map((item) => {
          const submissions =
            item.phoneNumbers.length;

          return {
            amount: item.amount,

            submissions,

            phoneNumbers:
              item.phoneNumbers,

            unique:
              submissions === 1,

            winner:
              submissions === 1 &&
              winningAmount !==
                null &&
              item.amount ===
                winningAmount,
          };
        });

    /* =========================================================
       RESPONSE
    ========================================================= */

    return NextResponse.json({
      success: true,

      result: {
        id: auction.publicId,

        title:
          auction.title?.[language] ||
          auction.title?.en ||
          "",

        subtitle:
          auction.subtitle?.[
            language
          ] ||
          auction.subtitle?.en ||
          "",

        description:
          auction.description?.[
            language
          ] ||
          auction.description?.en ||
          "",

        image:
          auction.image,

        category:
          auction.category,

        date:
          auction.completedAt ||
          auction.endsAt ||
          auction.updatedAt,

        bidCount:
          auction.bidCount || 0,

        winningBid:
          winningBid?.amount ||
          null,

        winnerName:
          winner?.name ||
          null,

        /*
         * Winner phone is already masked
         * before being sent to the browser.
         */
        winnerPhone:
          maskPhone(
            winner?.phone
          ),

        /*
         * Every amount contains the masked
         * phone numbers of everyone who
         * submitted that amount.
         */
        breakdown,
      },
    });
  } catch (error) {
    console.error(
      "RESULT_DETAIL_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load result.",
      },
      {
        status: 500,
      }
    );
  }
}