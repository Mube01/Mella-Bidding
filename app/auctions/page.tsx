"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AuctionCard from "../components/AuctionCard";
import { auctions } from "../components/data";
import { useLanguage } from "../context/LanguageContext";

export default function AuctionsPage() {
  const { t } = useLanguage();

  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filteredAuctions = useMemo(() => {
    return auctions.filter((auction) => {
      const matchesCategory =
        category === "all" ||
        auction.category.toLowerCase() === category.toLowerCase();

      const matchesSearch =
        auction.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        auction.subtitle
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);
  
const categories = [
  {
    key: "all",
    label: t("all"),
  },
  {
    key: "electronics",
    label: t("electronics"),
  },
  {
    key: "automotive",
    label: t("automotive"),
  },
  {
    key: "home",
    label: t("home"),
  },
  {
    key: "mystery box",
    label: t("mysteryBox"),
  },
];
  return (
    <main className="min-h-screen bg-white">

      {/* HEADER */}
      <Header />

      {/* PAGE CONTENT */}
      <div className="pt-[120px]">

        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="relative overflow-hidden border-b border-black/10">

          {/* Background effects */}
          <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-violet-400/10 blur-[120px]" />

          <div className="absolute right-[-10%] top-0 h-[500px] w-[500px] rounded-full bg-[#1681C5]/10 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">

            <div className="max-w-3xl">

              {/* Label */}
              <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.28em] text-[#1681C5]">
                <span className="h-px w-8 bg-[#1681C5]" />

                {t("liveAuctions")}
              </div>

              {/* Heading */}
              <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-[-0.04em] sm:text-7xl">
                {t("findYourNextWin")}
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-2xl text-base leading-7 text-black/50 sm:text-lg">
                {t("auctionsPageDescription")}
              </p>

            </div>

          </div>
        </section>

        {/* =====================================================
            AUCTION CONTENT
        ===================================================== */}
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">

          {/* ===================================================
              FILTER BAR
          =================================================== */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2">

              {categories.map((item) => {
                const active = category === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setCategory(item.key)}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-[#1681C5] text-white shadow-md shadow-[#1681C5]/20"
                        : "border border-black/10 bg-white text-black/55 hover:border-[#1681C5]/40 hover:text-[#1681C5]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

            </div>

            {/* Search */}
            <div className="flex w-full items-center gap-3 sm:w-auto">

              <div className="relative w-full sm:w-[280px]">

                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder={t("searchAuctions")}
                  className="h-11 w-full rounded-full border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#1681C5] focus:ring-2 focus:ring-[#1681C5]/10"
                />

              </div>

              <button
                type="button"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-black/50 transition hover:border-[#1681C5] hover:text-[#1681C5]"
                aria-label={t("filters")}
              >
                <SlidersHorizontal size={17} />
              </button>

            </div>

          </div>

          {/* ===================================================
              RESULTS HEADER
          =================================================== */}
          <div className="mt-12 flex items-center justify-between border-b border-black/10 pb-4">

            <p className="text-sm text-black/45">
              <span className="font-semibold text-black">
                {filteredAuctions.length}
              </span>{" "}
              {t("auctionsAvailable")}
            </p>

            <p className="hidden text-xs text-black/30 sm:block">
              {t("endingSoon")}
            </p>

          </div>

          {/* ===================================================
              AUCTION GRID
          =================================================== */}
          {filteredAuctions.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {filteredAuctions.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                />
              ))}

            </div>
          ) : (

            /* EMPTY STATE */
            <div className="flex min-h-[350px] flex-col items-center justify-center text-center">

              <div className="grid h-16 w-16 place-items-center rounded-full bg-[#1681C5]/10 text-[#1681C5]">
                <Search size={24} />
              </div>

              <h2 className="mt-6 font-display text-3xl">
                {t("noAuctionsFound")}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-black/40">
                {t("tryAnotherSearch")}
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="mt-6 rounded-full bg-[#F78000] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#D96E00]"
              >
                {t("clearFilters")}
              </button>

            </div>
          )}

        </section>

        {/* FOOTER */}
        <Footer />

      </div>

    </main>
  );
}