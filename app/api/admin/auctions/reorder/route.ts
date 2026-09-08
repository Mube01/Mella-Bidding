import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import {
  isSameOriginRequest,
  requireAdmin,
} from "../../../../lib/auth";
import Auction from "../../../../models/auction";

export async function PATCH(request: Request) {
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
    const body: unknown = await request.json();

    /*
     * Validate request body
     */
    if (
      typeof body !== "object" ||
      body === null ||
      !("auctionIds" in body) ||
      !Array.isArray(body.auctionIds)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "auctionIds must be an array.",
        },
        { status: 400 }
      );
    }

    /*
     * Make sure every ID is a string
     */
    const auctionIds: string[] = body.auctionIds.filter(
      (id: unknown): id is string =>
        typeof id === "string" &&
        id.trim().length > 0
    );

    if (auctionIds.length !== body.auctionIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid auction IDs.",
        },
        { status: 400 }
      );
    }

    /*
     * Prevent duplicate IDs
     */
    if (
      new Set(auctionIds).size !== auctionIds.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate auction IDs are not allowed.",
        },
        { status: 400 }
      );
    }

    /*
     * Nothing to reorder
     */
    if (auctionIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No auctions to reorder.",
      });
    }

    /*
     * Connect to MongoDB
     */
    await connectDB();

    /*
     * Get existing auctions
     */
    const existingAuctions = await Auction.find(
      {
        publicId: {
          $in: auctionIds,
        },
      },
      {
        publicId: 1,
      }
    ).lean();

    /*
     * Convert existing IDs to strings.
     *
     * This explicit typing prevents the
     * implicit-any TypeScript errors.
     */
    const existingIds: string[] = existingAuctions
      .map((auction: { publicId?: unknown }) =>
        typeof auction.publicId === "string"
          ? auction.publicId
          : ""
      )
      .filter(
        (id: string) => id.length > 0
      );

    const existingIdSet = new Set<string>(
      existingIds
    );

    /*
     * Check that every requested auction exists
     */
    const missingAuction = auctionIds.some(
      (id: string) =>
        !existingIdSet.has(id)
    );

    if (missingAuction) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One or more auctions do not exist.",
        },
        { status: 400 }
      );
    }

    /*
     * Create bulk update operations
     *
     * The position in the array becomes
     * the auction's order.
     */
    const operations = auctionIds.map(
      (publicId: string, index: number) => ({
        updateOne: {
          filter: {
            publicId,
          },
          update: {
            $set: {
              order: index,
            },
          },
        },
      })
    );

    /*
     * Save the new order
     */
    await Auction.bulkWrite(operations);

    return NextResponse.json({
      success: true,
      message:
        "Auction order updated successfully.",
    });
  } catch (error) {
    console.error(
      "ADMIN_AUCTION_REORDER_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update auction order.",
      },
      { status: 500 }
    );
  }
}