"use client";

import {
  BatteryCharging,
  Clock3,
  Zap,
} from "lucide-react";
import type { Auction } from "./data";
import { useLanguage } from "../context/LanguageContext";

export default function FeaturedAuction({
  auction,
}: {
  auction: Auction;
}) {
  const { t } = useLanguage();

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute -inset-10 rounded-[3rem] bg-gradient-to-r from-[#1681C5]/20 via-[#F78000]/10 to-emerald-400/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[1.8rem] border border-black/10 bg-white shadow-2xl">
        <div className="relative aspect-[4/4.3] overflow-hidden">

          {/* BYD IMAGE */}
          <img
            src="/images/byd2.avif"
            alt="BYD Seagull"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
          />

          {/* Dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

          {/* LIVE BADGE */}
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-[#F78000] px-3 py-1.5 text-[9px] font-bold tracking-[0.18em] text-white shadow-lg">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            {t("liveAuction")}
          </div>

          {/* ELECTRIC BADGE */}
          <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[9px] font-bold tracking-[0.12em] text-white backdrop-blur-md">
            <Zap
              size={12}
              className="text-[#F78000]"
            />
            {t("electric")}
          </div>

          {/* CONTENT */}
          <div className="absolute inset-x-5 bottom-5 text-white">

            <div className="mb-4 flex items-end justify-between gap-4">

              {/* TITLE */}
              <div>
                <p className="text-[9px] font-bold tracking-[0.22em] text-white/60">
                  {t("featuredAutomotiveAuction")}
                </p>

                <h2 className="mt-1 font-display text-3xl tracking-[-0.03em] sm:text-4xl">
                  BYD Seagull
                </h2>

                <p className="mt-1 text-sm text-white/65">
                  {t("electricBrandNew")}
                </p>
              </div>

              {/* COUNTDOWN */}
              <div className="shrink-0 rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-right backdrop-blur-md">

                <div className="flex items-center gap-2">
                  <Clock3
                    size={12}
                    className="text-[#F78000]"
                  />

                  <p className="text-[8px] tracking-[0.18em] text-white/50">
                    {t("endsIn")}
                  </p>
                </div>

                <p className="mt-1 font-mono text-lg font-bold text-red-500">
                  {auction.time}
                </p>

              </div>
            </div>

            {/* SPECS */}
            <div className="grid grid-cols-2 gap-2 border-t border-white/20 pt-4">

              {/* POWER */}
              <div className="flex items-center gap-2">
                <BatteryCharging
                  size={14}
                  className="text-[#F78000]"
                />

                <div>
                  <p className="text-[8px] uppercase tracking-[0.12em] text-white/40">
                    {t("power")}
                  </p>

                  <p className="text-xs font-semibold text-white">
                    {t("fullyElectric")}
                  </p>
                </div>
              </div>

              {/* CONDITION */}
              <div className="flex items-center gap-2">
                <Zap
                  size={14}
                  className="text-[#F78000]"
                />

                <div>
                  <p className="text-[8px] uppercase tracking-[0.12em] text-white/40">
                    {t("condition")}
                  </p>

                  <p className="text-xs font-semibold text-white">
                    {t("brandNew")}
                  </p>
                </div>
              </div>

            </div>

            {/* AUCTION INFO */}
            <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4 text-xs text-white/65">

              <span>
                {auction.participants.toLocaleString()}{" "}
                {t("participants")}
              </span>

              <span>
                {t("entryFrom")}{" "}
                <b className="text-white">
                  {auction.entry}
                </b>
              </span>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}