"use client";

import {
  ArrowRight,
  CalendarDays,
  Crown,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";

const results = [
  {
    id: "M0009",
    title: "iPhone 16 Pro Max",
    subtitle: "256GB • Brand New",
    image: "/images/iphone.avif",
    category: "Electronics",
    winner: "Samuel T.",
    winningBid: "ETB 1,250",
    date: "Aug 23, 2026",
    participants: 764,
  },
  {
    id: "M0008",
    title: "Samsung 55″ OLED TV",
    subtitle: "4K Smart TV",
    image: "/images/tv.jpg",
    category: "Electronics",
    winner: "Mimi A.",
    winningBid: "ETB 875",
    date: "Aug 21, 2026",
    participants: 528,
  },
  {
    id: "M0007",
    title: "Mystery Tech Box",
    subtitle: "Premium Technology Box",
    image: "/images/box.jpg",
    category: "Mystery Box",
    winner: "Daniel K.",
    winningBid: "ETB 420",
    date: "Aug 19, 2026",
    participants: 936,
  },
  {
    id: "M0006",
    title: "PlayStation 5",
    subtitle: "Slim Edition • 1TB",
    image: "/images/ps5.jpg",
    category: "Electronics",
    winner: "Abel M.",
    winningBid: "ETB 680",
    date: "Aug 17, 2026",
    participants: 692,
  },
  {
    id: "M0005",
    title: "LG Smart Refrigerator",
    subtitle: "450L • Inverter",
    image: "/images/refrigerator.avif",
    category: "Home",
    winner: "Hana B.",
    winningBid: "ETB 510",
    date: "Aug 15, 2026",
    participants: 401,
  },
  {
    id: "M0004",
    title: "MacBook Air",
    subtitle: "M4 • 16GB RAM • 256GB",
    image: "/images/macbook.jpg",
    category: "Electronics",
    winner: "Yonas G.",
    winningBid: "ETB 1,100",
    date: "Aug 12, 2026",
    participants: 613,
  },
];

export default function ResultsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const filteredResults = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return results;

    return results.filter(
      (result) =>
        result.title.toLowerCase().includes(query) ||
        result.subtitle.toLowerCase().includes(query) ||
        result.winner.toLowerCase().includes(query) ||
        result.id.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-[120px]">
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden border-b border-black/10">
          <div className="absolute left-[-10%] top-0 h-[450px] w-[450px] rounded-full bg-[#F78000]/10 blur-[130px]" />

          <div className="absolute right-[-10%] top-10 h-[500px] w-[500px] rounded-full bg-[#1681C5]/10 blur-[130px]" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.28em] text-[#F78000]">
                <span className="h-px w-8 bg-[#F78000]" />

                {t("results")}
              </div>

              <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                See the wins.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-black/50 sm:text-lg">
                See completed Mella auctions, their winners and published
                results. Transparency doesn't stop when the auction ends.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="flex flex-col justify-between gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-black/30">
                COMPLETED AUCTIONS
              </p>

              <p className="mt-2 text-sm text-black/45">
                {filteredResults.length} published results
              </p>
            </div>

            <div className="relative w-full sm:w-[300px]">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search results..."
                className="h-11 w-full rounded-full border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#1681C5] focus:ring-2 focus:ring-[#1681C5]/10"
              />
            </div>
          </div>

          {/* ===================================================
              RESULTS
          =================================================== */}

          {filteredResults.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResults.map((result) => (
                <article
                  key={result.id}
                  className="group overflow-hidden rounded-2xl border border-[#999] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link href={`/results/${result.id}`}>
                    {/* IMAGE */}

                    <div className="relative aspect-[1.05/1] overflow-hidden border-b border-black/10">
                      <img
                        src={result.image}
                        alt={result.title}
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      {/* CATEGORY */}

                      <span className="absolute left-4 top-4 rounded-full bg-[#F78000] px-3 py-1.5 text-[9px] font-bold tracking-[0.16em] text-white shadow-md">
                        {result.category}
                      </span>

                      {/* TROPHY */}

                      <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#F78000] shadow-md backdrop-blur">
                        <Trophy size={17} />
                      </div>
                    </div>

                    {/* CONTENT */}

                    <div className="p-5">
                      {/* TITLE */}

                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display text-2xl text-black">
                            {result.title}
                          </h3>

                          <p className="mt-1 text-sm text-black/50">
                            {result.subtitle}
                          </p>
                        </div>

                        {/* AUCTION ID */}

                        <span className="shrink-0 rounded-md bg-black/5 px-2 py-1 font-mono text-[9px] text-black/40">
                          #{result.id}
                        </span>
                      </div>

                      {/* WINNER / WINNING BID */}

                      <div className="mt-5 grid grid-cols-2 gap-2 border-y border-black/10 py-4">
                        {/* WINNER */}

                        <div>
                          <p className="flex items-center gap-1 text-[8px] tracking-[0.18em] text-black/40">
                            <Crown size={10} />

                            WINNER
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold text-[#1681C5]">
                            {result.winner}
                          </p>
                        </div>

                        {/* WINNING BID */}

                        <div>
                          <p className="flex items-center gap-1 text-[8px] tracking-[0.18em] text-black/40">
                            <Trophy size={10} />

                            WINNING BID
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#F78000]">
                            {result.winningBid}
                          </p>
                        </div>
                      </div>

                      {/* COMPLETION INFORMATION */}

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {/* COMPLETED */}

                        <div>
                          <p className="flex items-center gap-1 text-[8px] tracking-[0.18em] text-black/40">
                            <CalendarDays size={10} />

                            COMPLETED
                          </p>

                          <p className="mt-1 text-xs font-semibold text-black/70">
                            {result.date}
                          </p>
                        </div>

                        {/* PARTICIPANTS */}

                        <div>
                          <p className="flex items-center gap-1 text-[8px] tracking-[0.18em] text-black/40">
                            <Users size={10} />

                            PARTICIPANTS
                          </p>

                          <p className="mt-1 text-xs font-semibold text-black/70">
                            {result.participants.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* VIEW RESULT */}

                      <span className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#F78000] px-4 text-sm font-bold text-white shadow-md shadow-[#F78000]/20 transition hover:bg-[#D96E00] hover:shadow-lg">
                        View Result

                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>

                      {/* STATUS */}

                      <p className="mt-3 text-center text-[12px] text-black/40">
                        Auction completed
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            /* =================================================
               NO RESULTS
            ================================================= */

            <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-[#F78000]/10 text-[#F78000]">
                <Search size={24} />
              </div>

              <h2 className="mt-6 font-display text-3xl">
                No results found
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-black/40">
                Try searching for another auction, product or winner.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-6 rounded-full bg-[#1681C5] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#116d9f]"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        {/* =====================================================
            TRANSPARENCY
        ===================================================== */}

        <section className="border-y border-black/10 bg-black/[0.02]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] text-[#1681C5]">
                  {t("transparent")}
                </p>

                <h2 className="mt-5 font-display text-4xl tracking-[-0.04em] sm:text-5xl">
                  Results should be visible.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-black/45">
                  Every completed auction should have a clear record of its
                  result. Mella is designed so participants can understand
                  what happened after the countdown reaches zero.
                </p>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white p-7">
                <div className="space-y-5">
                  <ResultPoint
                    title="Published winner"
                    description="The winning participant is shown after the auction closes."
                  />

                  <ResultPoint
                    title="Auction record"
                    description="Each auction has a unique identifier and completion date."
                  />

                  <ResultPoint
                    title="Participant visibility"
                    description="The completed auction records participation information."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="rounded-[2rem] bg-[#1681C5] p-8 text-white sm:p-12 lg:p-16">
            <h2 className="font-display text-4xl tracking-[-0.04em] sm:text-5xl">
              Ready for your next win?
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
              Explore the auctions currently available on Mella.
            </p>

            <Link
              href="/auctions"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#F78000] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#D96E00]"
            >
              {t("exploreAuctions")}

              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

/* =============================================================
   RESULT POINT
============================================================= */

function ResultPoint({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#F78000]" />

      <div>
        <h3 className="text-sm font-bold">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-black/40">
          {description}
        </p>
      </div>
    </div>
  );
}