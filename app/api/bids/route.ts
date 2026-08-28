import { NextResponse } from "next/server";

import { getSession } from "../../lib/auth";

export async function POST() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: "Bidding is not available until the auction database is connected",
      userId: session.userId,
    },
    { status: 501 }
  );
}