"use client";

import {
  BatteryCharging,
  Clock3,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { Auction } from "./data";
import AuctionCountdown from "./AuctionCountdown";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function FeaturedAuction({
  auction,
}: {
  auction: Auction;
}) {
  const { t } = useLanguage();

  const [endsAt, setEndsAt] = useState(
    auction.endsAt
  );

  useEffect(() => {
    fetch(`/api/auctions/${auction.id}`, {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEndsAt(data.auction.endsAt);
        }
      })
      .catch(() => undefined);
  }, [auction.id]);

  /* =========================================================
     FORMAT ENTRY PRICE
  ========================================================= */

  const formattedEntry = (() => {
    const numericEntry = Number(
      String(auction.entry).replace(
        /[^\d.-]/g,
        ""
      )
    );

    if (Number.isNaN(numericEntry)) {
      return auction.entry;
    }

    return numericEntry.toLocaleString("en-US");
  })();

  return (
    <Link
      href={`/auctions/${auction.id}`}
      className="group relative block"
    >
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div className="absolute -inset-10 rounded-[3rem] bg-gradient-to-r from-[#1681C5]/15 via-[#F78000]/10 to-emerald-400/15 blur-3xl" />

      {/* =====================================================
          CARD
      ===================================================== */}

      <div className="relative overflow-hidden rounded-[1.8rem] border border-black/10 bg-white shadow-2xl transition duration-500 group-hover:-translate-y-1 group-hover:shadow-3xl">

        {/* ===================================================
            IMAGE AREA

            Taller image gives the vehicle more visual space.
        =================================================== */}

        <div className="relative aspect-[4/5.8] overflow-hidden sm:aspect-[4/4.8]">

          {/* =================================================
              BYD IMAGE
          ================================================= */}

          <img
            src={auction.image}
            alt={auction.title}
            className="absolute inset-0 h-full w-full object-cover object-[center_30%] transition duration-700 group-hover:scale-[1.03]"
          />

          {/* =================================================
              SOFT IMAGE GRADIENT

              Instead of darkening the whole image heavily,
              the darkness is concentrated toward the bottom.
          ================================================= */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 via-45% to-transparent" />

          {/* =================================================
              LIGHT BOTTOM FADE
          ================================================= */}

          <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* =================================================
              LIVE BADGE
          ================================================= */}

          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#F78000] px-3 py-1.5 text-[9px] font-bold tracking-[0.18em] text-white shadow-lg sm:left-5 sm:top-5">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />

            {t("liveAuction")}

          </div>

          {/* =================================================
              ELECTRIC BADGE
          ================================================= */}

          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] font-bold tracking-[0.12em] text-white backdrop-blur-md sm:right-5 sm:top-5">

            <Zap
              size={12}
              className="text-[#F78000]"
            />

            {t("electric")}

          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="absolute inset-x-4 bottom-4 text-white sm:inset-x-5 sm:bottom-5">

            {/* =================================================
                TITLE + COUNTDOWN
            ================================================= */}

            <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">

              {/* TITLE */}

              <div className="min-w-0">

                <p className="text-[8px] font-bold tracking-[0.2em] text-white/65 sm:text-[9px] sm:tracking-[0.22em]">
                  {t(
                    "featuredAutomotiveAuction"
                  )}
                </p>

                <h2 className="mt-1 font-display text-3xl leading-none tracking-[-0.03em] sm:text-4xl">
                  {auction.title}
                </h2>

                <p className="mt-1 text-xs text-white/65 sm:text-sm">
                  {auction.subtitle}
                </p>

              </div>

              {/* COUNTDOWN */}

              <div className="w-full shrink-0 rounded-lg border border-white/15 bg-black/35 px-3 py-2.5 backdrop-blur-md sm:w-[190px] sm:px-4 sm:py-3">

                <div className="flex items-center gap-1.5">

                  <Clock3
                    size={11}
                    className="text-[#F78000]"
                  />

                  <p className="text-[7px] tracking-[0.16em] text-white/50 sm:text-[8px]">
                    {t("endsIn")}
                  </p>

                </div>

                <p className="mt-0.5 font-mono text-[13px] font-bold text-red-400 sm:text-[14px]">

                  {endsAt ? (
                    <AuctionCountdown
                      endsAt={endsAt}
                    />
                  ) : (
                    auction.time
                  )}

                </p>

              </div>

            </div>

            {/* =================================================
                SPECS
            ================================================= */}

            <div className="grid grid-cols-2 gap-3 border-t border-white/15 pt-3 sm:gap-5 sm:pt-4">

              {/* POWER */}

              <div className="flex items-center gap-2">

                <BatteryCharging
                  size={14}
                  className="shrink-0 text-[#F78000]"
                />

                <div className="min-w-0">

                  <p className="text-[7px] uppercase tracking-[0.12em] text-white/40 sm:text-[8px]">
                    {t("power")}
                  </p>

                  <p className="truncate text-[11px] font-semibold text-white sm:text-xs">
                    {t("fullyElectric")}
                  </p>

                </div>

              </div>

              {/* CONDITION */}

              <div className="flex items-center gap-2">

                <Zap
                  size={14}
                  className="shrink-0 text-[#F78000]"
                />

                <div className="min-w-0">

                  <p className="text-[7px] uppercase tracking-[0.12em] text-white/40 sm:text-[8px]">
                    {t("condition")}
                  </p>

                  <p className="truncate text-[11px] font-semibold text-white sm:text-xs">
                    {t("brandNew")}
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                AUCTION INFO
            ================================================= */}

            <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3 text-[10px] text-white/65 sm:mt-4 sm:pt-4 sm:text-xs">

              <span>
                {auction.bidCount.toLocaleString()}{" "}
                {t("participants")}
              </span>

              <span>
                {t("entryFrom")}{" "}

                <b className="text-white">
                  {formattedEntry}{" "}
                  {t("currency")}
                </b>
              </span>

            </div>

          </div>
        </div>
      </div>
    </Link>
  );
}