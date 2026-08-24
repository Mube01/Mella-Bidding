"use client";

import { ArrowRight } from "lucide-react";
import AuctionCard from "./AuctionCard";
import { auctions } from "./data";
import { useLanguage } from "../context/LanguageContext";

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-3 text-[10px] font-bold tracking-[0.28em] text-[#1681C5]">
      <span className="h-px w-8 bg-violet-400" />
      {children}
    </div>
  );
}

export default function Auctions() {
  const { t } = useLanguage();

  return (
    <section
      id="auctions"
      className="mx-auto max-w-7xl px-6 py-24 lg:px-10"
    >
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          {/* SECTION LABEL */}
          <SectionLabel>
            {t("liveNow")}
          </SectionLabel>

          {/* TITLE */}
          <h2 className="font-display text-5xl tracking-[-0.03em] sm:text-6xl">
            {t("auctionsWorthWatching")}
          </h2>
        </div>

        {/* VIEW ALL */}
        <a
          href="/auctions"
          className="flex items-center gap-2 text-sm font-bold text-[#1681C5] transition hover:gap-3"
        >
          {t("viewAllAuctions")}

          <ArrowRight size={16} />
        </a>
      </div>

      {/* AUCTION CARDS */}
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {auctions.map((auction) => (
          <AuctionCard
            key={auction.title}
            auction={auction}
          />
        ))}
      </div>
    </section>
  );
}