"use client";

import {
  ArrowRight,
  Clock3,
  Users,
  Minus,
  Plus,
} from "lucide-react";
import { useState } from "react";
import type { Auction } from "./data";
import { useLanguage } from "../context/LanguageContext";
import Link from "next/link";

export default function AuctionCard({
  auction,
}: {
  auction: Auction;
}) {
  const [bid, setBid] = useState(0);

  const { t } = useLanguage();

  const decreaseBid = () => {
    setBid((value) =>
      Math.max(0, Number((value - 0.01).toFixed(2)))
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
      setBid(0);
      return;
    }

    const number = Number(value);

    if (!Number.isNaN(number) && number >= 0) {
      setBid(Number(number.toFixed(2)));
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#999] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      
     <Link     href={`/auctions/${auction.id}`}>

      {/* IMAGE */}
      <div className="relative aspect-[1.05/1] overflow-hidden border-b border-black/10">
        <img
          src={auction.image}
          alt={auction.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {/* CATEGORY */}
        <span className="absolute left-4 top-4 rounded-full bg-[#F78000] px-3 py-1.5 text-[9px] font-bold tracking-[0.16em] text-white shadow-md">
          {auction.category}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* TITLE */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-black">
              {auction.title}
            </h3>

            <p className="mt-1 text-sm text-black/50">
              {auction.subtitle}
            </p>
          </div>

          {/* SIMPLE ID */}
          <span className="shrink-0 rounded-md bg-black/5 px-2 py-1 font-mono text-[9px] text-black/40">
            #{auction.id}
          </span>
        </div>

        {/* INFO */}
        <div className="mt-5 grid grid-cols-2 gap-2 border-y border-black/10 py-4">

          {/* ENDS IN */}
          <div>
            <p className="flex items-center gap-1 text-[8px] tracking-[0.18em] text-black/40">
              <Clock3 size={10} />
              {t("endsIn")}
            </p>

            <p className="mt-1 font-mono text-md font-semibold text-red-600">
              {auction.time}
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

        {/* BID */}
        <div className="mt-4">

          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-black/40">
            {t("enterYourBid")}
          </p>

          <div className="flex gap-2">

            {/* MINUS */}
            <button
              type="button"
              onClick={decreaseBid}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-black/10 bg-black/5 text-black transition hover:border-[#F78000] hover:bg-[#F78000] hover:text-white"
              aria-label="Decrease bid"
            >
              <Minus size={16} />
            </button>

            {/* INPUT */}
            <div className="relative flex flex-1 items-center rounded-xl border border-black/10 bg-white focus-within:border-[#F78000] focus-within:ring-2 focus-within:ring-[#F78000]/10">

              <input
                type="number"
                min="0"
                step="0.01"
                value={bid.toFixed(2)}
                onChange={handleBidChange}
                className="h-11 w-full bg-transparent px-4 pr-14 text-center font-mono text-md font-bold text-black outline-none"
                aria-label={`${t("enterYourBid")} ${auction.title}`}
              />

              <span className="absolute right-4 text-[10px] font-bold text-black/35">
                ETB
              </span>

            </div>

            {/* PLUS */}
            <button
              type="button"
              onClick={increaseBid}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-black/10 bg-black/5 text-black transition hover:border-[#F78000] hover:bg-[#F78000] hover:text-white"
              aria-label="Increase bid"
            >
              <Plus size={16} />
            </button>

          </div>
        </div>

        {/* SUBMIT */}
        <span
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#F78000] px-4 text-sm font-bold text-white shadow-md shadow-[#F78000]/20 transition hover:bg-[#D96E00] hover:shadow-lg"
        >
          {t("submitBid")}

          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>

        {/* ENTRY */}
        <p className="mt-3 text-center text-[12px] text-black/40">
          {t("entryFrom")}{" "}
          <span className="font-bold text-black/70">
            {auction.entry}
          </span>
        </p>

      </div>
      </Link>
    </article>
  );
}