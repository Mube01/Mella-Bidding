"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gavel,
  Trophy,
  XCircle,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

type AuctionStatus =
  | "active"
  | "won"
  | "ended"
  | "lost";

type MyAuction = {
  id: string;
  title: string;
  image: string;
  category: string;
  status: AuctionStatus;
  myBid: number;
  totalBids: number;
  endDate: string;
};

const sampleAuctions: MyAuction[] = [
  {
    id: "iphone-17-pro-max",
    title: "iPhone 17 Pro Max",
    image: "/images/iphone.avif",
    category: "Electronics",
    status: "active",
    myBid: 75,
    totalBids: 3,
    endDate: "August 30, 2026",
  },
  {
    id: "byd-seagull",
    title: "BYD Seagull",
    image: "/images/byd.jpg",
    category: "Automotive",
    status: "won",
    myBid: 350,
    totalBids: 8,
    endDate: "August 18, 2026",
  },
  {
    id: "samsung-neo-qled",
    title: "Samsung Neo QLED TV",
    image: "/images/tv.jpg",
    category: "Electronics",
    status: "ended",
    myBid: 150,
    totalBids: 5,
    endDate: "August 12, 2026",
  },
];

function LoadingCircle() {
  return <LoadingSpinner size="lg" />;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function StatusBadge({
  status,
  t,
}: {
  status: AuctionStatus;
  t: (key: "active" | "won" | "notWon" | "ended") => string;
}) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F78000]/10 px-3 py-1.5 text-xs font-bold text-[#F78000]">
        <Clock3 size={13} />
        {t("active")}
      </span>
    );
  }

  if (status === "won") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-mella-green/10 px-3 py-1.5 text-xs font-bold text-mella-green">
        <Trophy size={13} />
        {t("won")}
      </span>
    );
  }

  if (status === "lost") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
        <XCircle size={13} />
        {t("notWon")}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-500">
      <CheckCircle2 size={13} />
      {t("ended")}
    </span>
  );
}

export default function MyAuctionsPage() {
  const { t, language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [myAuctions, setMyAuctions] = useState<MyAuction[]>([]);

  const [activeFilter, setActiveFilter] =
    useState<"all" | AuctionStatus>("all");

  useEffect(() => {
    fetch(`/api/my-auctions?lang=${language}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) setMyAuctions(data.auctions);
      })
      .catch(() => setMyAuctions([]))
      .finally(() => setLoading(false));
  }, [language]);

  const filteredAuctions =
    activeFilter === "all"
      ? myAuctions
      : myAuctions.filter(
          (auction) =>
            auction.status === activeFilter
        );

  const activeCount = myAuctions.filter(
    (auction) => auction.status === "active"
  ).length;

  const wonCount = myAuctions.filter(
    (auction) => auction.status === "won"
  ).length;

  const endedCount = myAuctions.filter(
    (auction) =>
      auction.status === "ended" ||
      auction.status === "lost"
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 pb-20 pt-40 sm:pt-44">
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingCircle />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 pb-20 pt-40 sm:pt-44">
      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-mella-green">
            {t("myActivity")}
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            {t("myAuctionsTitle")}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
            {t("myAuctionsDescription")}
          </p>
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">

          {/* ACTIVE */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F78000]/10 text-[#F78000]">
                <Clock3 size={19} />
              </div>

              <div>
                <p className="text-xs font-bold tracking-wider text-neutral-400">
                  {t("active")}
                </p>

                <p className="mt-1 text-2xl font-semibold text-neutral-900">
                  {activeCount}
                </p>
              </div>
            </div>
          </div>

          {/* WON */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mella-green/10 text-mella-green">
                <Trophy size={19} />
              </div>

              <div>
                <p className="text-xs font-bold tracking-wider text-neutral-400">
                  {t("won")}
                </p>

                <p className="mt-1 text-2xl font-semibold text-neutral-900">
                  {wonCount}
                </p>
              </div>
            </div>
          </div>

          {/* ENDED */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                <Gavel size={19} />
              </div>

              <div>
                <p className="text-xs font-bold tracking-wider text-neutral-400">
                  {t("ended")}
                </p>

                <p className="mt-1 text-2xl font-semibold text-neutral-900">
                  {endedCount}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* =====================================================
            FILTERS
        ===================================================== */}
        <div className="mt-10 flex flex-wrap items-center gap-2">
          {[
            {
              value: "all" as const,
              label: t("allAuctions"),
            },
            {
              value: "active" as const,
              label: t("active"),
            },
            {
              value: "won" as const,
              label: t("won"),
            },
            {
              value: "ended" as const,
              label: t("ended"),
            },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                setActiveFilter(filter.value)
              }
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeFilter === filter.value
                  ? "bg-mella-green text-white shadow-sm"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* =====================================================
            AUCTIONS
        ===================================================== */}
        <div className="mt-6">
          {filteredAuctions.length === 0 ? (
            <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                <Gavel size={24} />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-neutral-900">
                {t("noAuctionsFound")}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                {t("noAuctionsDescription")}
              </p>

              <Link
                href="/auctions"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-mella-green px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("exploreAuctions")}
                <ArrowRight size={16} />
              </Link>

            </div>
          ) : (
            <div className="grid gap-5">

              {filteredAuctions.map(
                (auction) => (
                  <div
                    key={auction.id}
                    className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row">

                      {/* IMAGE */}
                      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-neutral-100 md:h-auto md:w-64">

                        <img
                          src={auction.image}
                          alt={auction.title}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />

                        <div className="absolute left-4 top-4">
                          <StatusBadge
                            status={auction.status}
                            t={t}
                          />
                        </div>

                      </div>

                      {/* CONTENT */}
                      <div className="flex flex-1 flex-col p-6 sm:p-7">

                        <div className="flex flex-col justify-between gap-5 sm:flex-row">

                          <div>

                            <p className="text-xs font-bold tracking-wider text-mella-green">
                              {auction.category.toUpperCase()}
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                              {auction.title}
                            </h2>

                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-500">

                              <span className="flex items-center gap-1.5">
                                <CalendarDays
                                  size={15}
                                />
                                {auction.endDate}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Gavel
                                  size={15}
                                />
                                {auction.totalBids}{" "}
                                {t("bids")}
                              </span>

                            </div>

                          </div>

                          {/* MY BID */}
                          <div className="sm:text-right">

                            <p className="text-xs font-bold tracking-wider text-neutral-400">
                              {t("myBid")}
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-neutral-900">
                              {formatAmount(
                                auction.myBid
                              )}{" "}
                              <span className="text-sm font-medium text-neutral-400">
                                {language === "am" ? "ብር" : "ETB"}
                              </span>
                            </p>

                          </div>

                        </div>

                        {/* BOTTOM */}
                        <div className="mt-6 flex flex-col gap-4 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            {auction.status ===
                              "active" && (
                              <p className="text-sm text-neutral-500">
                                {t(
                                  "auctionCurrentlyActive"
                                )}
                              </p>
                            )}

                            {auction.status ===
                              "won" && (
                              <p className="flex items-center gap-2 text-sm font-semibold text-mella-green">
                                <Trophy
                                  size={16}
                                />
                                {t(
                                  "congratulationsWon"
                                )}
                              </p>
                            )}

                            {auction.status ===
                              "ended" && (
                              <p className="text-sm text-neutral-500">
                                {t(
                                  "auctionHasEnded"
                                )}
                              </p>
                            )}

                            {auction.status ===
                              "lost" && (
                              <p className="text-sm text-neutral-500">
                                {t(
                                  "auctionHasEnded"
                                )}
                              </p>
                            )}

                          </div>

                          <Link
                            href={`/auctions/${auction.id}`}
                            className="group inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-mella-green hover:text-mella-green"
                          >
                            {t("viewAuction")}

                            <ArrowRight
                              size={16}
                              className="transition group-hover:translate-x-1"
                            />
                          </Link>

                        </div>

                      </div>
                    </div>
                  </div>
                )
              )}

            </div>
          )}
        </div>

        {/* =====================================================
            BROWSE MORE
        ===================================================== */}
        <div className="mt-8 rounded-3xl bg-mella-green p-7 text-white sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-bold tracking-[0.2em] text-white/50">
                {t("keepBidding")}
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {t("nextOpportunity")}
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-white/60">
                {t("exploreLiveAuctions")}
              </p>

            </div>

            <Link
              href="/auctions"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#F78000] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              {t("exploreAuctions")}

              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}