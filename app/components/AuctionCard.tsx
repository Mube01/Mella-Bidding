"use client";

import {
  ArrowRight,
  Clock3,
  Users,
  Minus,
  Plus,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { Auction } from "./data";
import AuctionCountdown from "./AuctionCountdown";
import { useLanguage } from "../context/LanguageContext";

type AuctionCardProps = {
  auction: Auction;
  onPriceFocus?: () => void;
  onBidRequest: (
    auction: Auction,
    bidAmount: number,
    serviceFee: number
  ) => void;
};

export default function AuctionCard({
  auction,
  onPriceFocus,
  onBidRequest,
}: AuctionCardProps) {
  const [bid, setBid] = useState<number>(1);
  const [bidInput, setBidInput] = useState<string>("1.00");

  const [successMessage, setSuccessMessage] = useState(false);

  const { language, t } = useLanguage();

  /* =========================================================
     BID CONTROLS
  ========================================================= */

  const decreaseBid = () => {
    const currentBid = Number(bidInput);

    const safeBid = Number.isFinite(currentBid)
      ? currentBid
      : bid;

    const newBid = Math.max(
      1,
      Number((safeBid - 0.01).toFixed(2))
    );

    setBid(newBid);
    setBidInput(newBid.toFixed(2));
  };

  const increaseBid = () => {
    const currentBid = Number(bidInput);

    const safeBid = Number.isFinite(currentBid)
      ? currentBid
      : bid;

    const newBid = Number(
      (safeBid + 0.01).toFixed(2)
    );

    setBid(newBid);
    setBidInput(newBid.toFixed(2));
  };

  /* =========================================================
     MANUAL BID INPUT
  ========================================================= */

  const handleBidChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    /*
      Allow:
      1
      1.
      1.2
      1.25
      10.50

      Reject:
      letters
      negative numbers
      multiple decimals
    */

    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }

    // Allow the user to temporarily have an empty input.
    if (value === "") {
      setBidInput("");
      return;
    }

    // Allow "1." while the user is still typing.
    if (value === ".") {
      setBidInput("0.");
      setBid(0);
      return;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return;
    }

    /*
      Bid cannot be below 1.

      We still allow the user to type "1." and "1.2"
      naturally.
    */
    if (numericValue < 1 && !value.startsWith("0.")) {
      return;
    }

    setBidInput(value);
    setBid(numericValue);
  };

  /* =========================================================
     OPEN PAGE-LEVEL CONFIRMATION MODAL
  ========================================================= */

  const handleBid = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const numericBid = Number(bidInput);

    // Validate before submitting.
    if (
      bidInput === "" ||
      Number.isNaN(numericBid) ||
      numericBid < 1
    ) {
      setBidInput("1");
      setBid(1);
      return;
    }

    const serviceFee =
      parseFloat(
        String(auction.entry).replace(/[^\d.]/g, "")
      ) || 0;

    onBidRequest(
      auction,
      Number(numericBid.toFixed(2)),
      serviceFee
    );
  };

  /* =========================================================
     CATEGORY TRANSLATION
  ========================================================= */

  const getCategoryLabel = (category: string) => {
    switch (category.toLowerCase()) {
      case "electronics":
        return t("electronics");

      case "automotive":
        return t("automotive");

      case "home":
        return t("home");

      case "mystery box":
        return t("mysteryBox");

      default:
        return category;
    }
  };

  /* =========================================================
     SUCCESS MESSAGE
  ========================================================= */

  const showSuccessMessage = () => {
    setSuccessMessage(true);

    window.setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#999] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* ===================================================
          IMAGE
      =================================================== */}

      <Link href={`/auctions/${auction.id}`}>
        <div className="relative aspect-[1.05/1] overflow-hidden border-b border-black/10">
          <img
            src={auction.image}
            alt={auction.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <span className="absolute left-4 top-4 rounded-full bg-[#F78000] px-3 py-1.5 text-[9px] font-bold tracking-[0.16em] text-white shadow-md">
            {getCategoryLabel(auction.category)}
          </span>
        </div>
      </Link>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="p-5">
        {/* =================================================
            TITLE
        ================================================= */}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/auctions/${auction.id}`}>
              <h3 className="font-display text-xl text-black transition hover:text-[#1681C5]">
                {auction.title}
              </h3>
            </Link>

            <p className="mt-1 text-sm text-black/50">
              {auction.subtitle}
            </p>
          </div>

          <span className="shrink-0 rounded-md bg-black/5 px-2 py-1 font-mono text-[9px] text-black/40">
            #{auction.id}
          </span>
        </div>

        {/* =================================================
            INFO
        ================================================= */}

        <div className="mt-5 grid grid-cols-[1.35fr_0.65fr] gap-2 border-y border-black/10 py-4">
          {/* ENDS IN */}

          <div>
            <p className="flex items-center gap-1 text-[8px] tracking-[0.18em] text-black/40">
              <Clock3 size={10} />
              {t("endsIn")}
            </p>

            <p className="mt-1 font-mono text-[15px] font-semibold text-red-600">
              {auction.endsAt ? (
                <AuctionCountdown endsAt={auction.endsAt} />
              ) : (
                auction.time
              )}
            </p>
          </div>

          {/* PARTICIPANTS */}

          <div>
            <p className="flex items-center gap-1 text-[8px] tracking-[0.18em] text-black/40">
              <Users size={10} />
              {t("participants")}
            </p>

            <p className="mt-1 text-md font-semibold text-[#1681C5]">
              {auction.participants}
            </p>
          </div>
        </div>

        {/* =================================================
            BID
        ================================================= */}

        <div className="mt-4">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-black/40">
            {t("enterYourBid")}
          </p>

          <div className="flex gap-2">
            {/* MINUS */}

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                decreaseBid();
              }}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-black/10 bg-black/5 text-black transition hover:border-[#F78000] hover:bg-[#F78000] hover:text-white"
              aria-label={t("decreaseBid")}
            >
              <Minus size={16} />
            </button>

            {/* INPUT */}

            <div className="relative flex flex-1 items-center rounded-xl border border-black/10 bg-white focus-within:border-[#F78000] focus-within:ring-2 focus-within:ring-[#F78000]/10">
              <input
                type="text"
                inputMode="decimal"
                value={bidInput}
                onChange={handleBidChange}
                onFocus={onPriceFocus}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onKeyDown={(event) => {
                  // Prevent invalid keyboard characters.
                  if (
                    event.key === "e" ||
                    event.key === "E" ||
                    event.key === "+" ||
                    event.key === "-"
                  ) {
                    event.preventDefault();
                  }

                  // Submit bid with Enter.
                  if (event.key === "Enter") {
                    event.preventDefault();

                    const numericBid = Number(bidInput);

                    if (
                      bidInput !== "" &&
                      !Number.isNaN(numericBid) &&
                      numericBid >= 1
                    ) {
                      const serviceFee =
                        parseFloat(
                          String(auction.entry).replace(
                            /[^\d.]/g,
                            ""
                          )
                        ) || 0;

                      onBidRequest(
                        auction,
                        Number(numericBid.toFixed(2)),
                        serviceFee
                      );
                    }
                  }

                  event.stopPropagation();
                }}
                onBlur={() => {
                  /*
                    If the user leaves the field empty or
                    enters something below 1, restore 1.
                  */

                  const numericValue = Number(bidInput);

                  if (
                    bidInput === "" ||
                    Number.isNaN(numericValue) ||
                    numericValue < 1
                  ) {
                    setBid(1);
                    setBidInput("1");
                    return;
                  }

                  // Normalize to max 2 decimal places on blur.
                  const normalized = Number(
                    numericValue.toFixed(2)
                  );

                  setBid(normalized);
                  setBidInput(normalized.toString());
                }}
                className="h-11 w-full bg-transparent px-4 pr-14 text-center font-mono text-md font-bold text-black outline-none"
                aria-label={`${t(
                  "enterYourBid"
                )} ${auction.title}`}
              />

            <span className="pointer-events-none absolute right-4 text-[10px] font-bold text-black/35">
              {t("currency")}
            </span>

            </div>

            {/* PLUS */}

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                increaseBid();
              }}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-black/10 bg-black/5 text-black transition hover:border-[#F78000] hover:bg-[#F78000] hover:text-white"
              aria-label={t("increaseBid")}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* =================================================
            SUBMIT
        ================================================= */}

        {successMessage ? (
          <div className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-50 px-4 text-sm font-bold text-green-700 shadow-md">
            <CheckCircle2 size={16} />

            {language === "am"
              ? "መጫረቻ በተሳካ ሁኔታ ተልኳል"
              : "Bid submitted successfully"}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleBid}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#F78000] px-4 text-sm font-bold text-white shadow-md shadow-[#F78000]/20 transition hover:bg-[#D96E00] hover:shadow-lg"
          >
            {t("submitBid")}

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        )}

        {/* =================================================
            ENTRY
        ================================================= */}

        <p className="mt-3 text-center text-[14px] text-black/60">
          {t("entryFrom")}{" "}
          <span className="font-bold text-black/90">
            {auction.entry}
          </span>
        </p>
      </div>
    </article>
  );
}