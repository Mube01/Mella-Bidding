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
  const [bid, setBid] = useState(1);
  const [successMessage, setSuccessMessage] = useState(false);

  const { language, t } = useLanguage();

  /* =========================================================
     BID CONTROLS
  ========================================================= */

  const decreaseBid = () => {
    setBid((value) =>
      Math.max(1, Number((value - 0.01).toFixed(2)))
    );
  };

  const increaseBid = () => {
    setBid((value) =>
      Number((value + 0.01).toFixed(2))
    );
  };

  const handleBidChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    if (value === "") {
      setBid(1);
      return;
    }

    const number = Number(value);

    if (!Number.isNaN(number) && number >= 1) {
      setBid(Number(number.toFixed(2)));
    }
  };

  /* =========================================================
     OPEN PAGE-LEVEL CONFIRMATION MODAL
  ========================================================= */

  const handleBid = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const serviceFee =
      parseFloat(String(auction.entry).replace(/[^\d.]/g, "")) || 0;

    onBidRequest(
      auction,
      bid,
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

            <p className="mt-1 font-mono text-[16px] font-semibold text-red-600">
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
                type="number"
                min="1"
                step="0.01"
                value={bid.toFixed(2)}
                onChange={handleBidChange}
                onFocus={onPriceFocus}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className="h-11 w-full bg-transparent px-4 pr-14 text-center font-mono text-md font-bold text-black outline-none"
                aria-label={`${t(
                  "enterYourBid"
                )} ${auction.title}`}
              />

              <span className="absolute right-4 text-[10px] font-bold text-black/35">
                ETB
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

        <p className="mt-3 text-center text-[12px] text-black/40">
          {t("entryFrom")}{" "}
          <span className="font-bold text-black/70">
            {auction.entry}
          </span>
        </p>
      </div>
    </article>
  );
}