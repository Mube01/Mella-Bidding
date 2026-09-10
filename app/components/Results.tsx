"use client";

import {
  ArrowRight,
  CalendarDays,
  Crown,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useLanguage } from "../context/LanguageContext";

type Result = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  winner: string;
  winningBid: number;
  winnerPhone: string;
  date: string;
  bidCount: number;
};

export default function Results() {
  const { t, language } = useLanguage();

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  /*
   * =========================================================
   * LOAD RESULTS
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    setLoading(true);

    fetch(`/api/results?lang=${language}`, {
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load results");
        }

        return response.json();
      })
      .then((data) => {
        if (cancelled) return;

        if (!data?.success || !Array.isArray(data.results)) {
          setResults([]);
          return;
        }

        const formattedResults: Result[] =
          data.results.map((result: any) => ({
            id: String(result.id ?? ""),

            title:
              result.title ||
              "",

            subtitle:
              result.subtitle ||
              "",

            image:
              result.image ||
              "",

            category:
              result.category ||
              "Electronics",

            winner:
              result.winner ||
              "Winner",

            winningBid:
              Number(result.winningBid ?? 0),

              winnerPhone:
                result.winnerPhone || "",

            date:
              result.date ||
              "",

            bidCount:
              Number(result.bidCount ?? 0),
          }));

        setResults(formattedResults);
      })
      .catch((error) => {
        if (cancelled) return;

        console.error(
          "HOME_RESULTS_ERROR:",
          error
        );

        setResults([]);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  /*
   * =========================================================
   * SHOW ONLY LATEST 3
   * =========================================================
   */

  const latestResults = results.slice(0, 3);

  /*
   * =========================================================
   * CATEGORY
   * =========================================================
   */

  const getCategoryLabel = (
    category: string
  ) => {
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

  /*
   * =========================================================
   * DATE
   * =========================================================
   */

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  if (language === "am") {
    return new Intl.DateTimeFormat("am-ET-u-ca-ethiopic", {
      calendar: "ethiopic",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(parsedDate);
  }

  return new Intl.DateTimeFormat("en-US", {
    calendar: "gregory",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
};

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute left-[-10%] top-20 h-[400px] w-[400px] rounded-full bg-[#F78000]/5 blur-[120px]" />

      <div className="pointer-events-none absolute right-[-10%] bottom-0 h-[450px] w-[450px] rounded-full bg-[#1681C5]/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div className="max-w-3xl">

            <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.28em] text-[#F78000]">

              <span className="h-px w-8 bg-[#F78000]" />

              {t("results")}

            </div>

            <h2
              className={`mt-5 text-4xl leading-[0.95] sm:text-5xl lg:text-6xl ${
                language === "am"
                  ? "font-sans tracking-normal"
                  : "font-display tracking-[-0.04em]"
              }`}
            >
              {t("seeTheWins")}
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-black/45 sm:text-base">
              {t("resultsPageDescription")}
            </p>

          </div>

          {/* VIEW ALL */}

          <Link
            href="/results"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold text-black transition hover:border-[#1681C5]/30 hover:text-[#1681C5]"
          >
            {t("viewAllResults")}

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

        </div>

        {/* ===================================================
            RESULTS
        =================================================== */}

        {loading ? (

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-black/10 bg-white"
              >

                <div className="aspect-[1.05/1] animate-pulse bg-black/5" />

                <div className="space-y-4 p-5">

                  <div className="h-5 w-2/3 animate-pulse rounded bg-black/5" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-black/5" />

                  <div className="h-16 animate-pulse rounded bg-black/5" />

                  <div className="h-11 animate-pulse rounded-xl bg-black/5" />

                </div>

              </div>
            ))}

          </div>

        ) : latestResults.length > 0 ? (

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {latestResults.map((result) => (

              <article
                key={result.id}
                className="group overflow-hidden rounded-2xl border border-[#999] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* =================================================
                    IMAGE
                ================================================= */}

                <Link href={`/results/${result.id}`}>

                  <div className="relative aspect-[1.05/1] overflow-hidden border-b border-black/10">

                    <img
                      src={result.image}
                      alt={result.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    {/* CATEGORY */}

                    <span className="absolute left-4 top-4 rounded-full bg-[#F78000] px-3 py-1.5 text-[9px] font-bold tracking-[0.16em] text-white shadow-md">
                      {getCategoryLabel(
                        result.category
                      )}
                    </span>

                    {/* TROPHY */}

                    <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#F78000] shadow-md backdrop-blur">
                      <Trophy size={17} />
                    </div>

                  </div>

                </Link>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="p-5">

                  {/* TITLE */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <Link
                        href={`/results/${result.id}`}
                      >
                        <h3
                          className={`text-xl text-black transition hover:text-[#1681C5] font-display`}
                        >
                          {result.title}
                        </h3>
                      </Link>

                      <p className="mt-1 text-sm text-black/50">
                        {result.subtitle}
                      </p>

                    </div>

                    {/* ID */}

                    <span className="shrink-0 rounded-md bg-black/5 px-2 py-1 font-mono text-[9px] text-black/40">
                      #{result.id}
                    </span>

                  </div>

                  {/* =================================================
                      WINNER / WINNING BID
                  ================================================= */}

                  <div className="mt-5 grid grid-cols-2 gap-2 border-y border-black/10 py-4">

                    {/* WINNER */}

                    <div className="min-w-0">

                      <p className="flex items-center gap-1 text-[8px] tracking-[0.18em] text-black/40">
                        <Crown size={10} />

                        {t("winnerLabel")}
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-[#1681C5]">
                        {result.winner}
                      </p>

                      {result.winnerPhone && (
                          <p className="mt-1 truncate text-xs text-gray-500">
                            {result.winnerPhone}
                          </p>
                        )}

                    </div>

                    {/* WINNING BID */}

                    <div>

                      <p className="flex items-center gap-1 text-[8px] tracking-[0.18em] text-black/40">
                        <Trophy size={10} />

                        {t("winningBidLabel")}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#F78000]">
                        ETB{" "}
                        {Number.isFinite(
                          result.winningBid
                        )
                          ? result.winningBid.toLocaleString()
                          : "0"}
                      </p>

                    </div>

                  </div>

                  {/* =================================================
                      DATE / PARTICIPANTS
                  ================================================= */}

                  <div className="mt-4 grid grid-cols-2 gap-2">

                    {/* DATE */}

                    <div>

                      <p className="flex items-center gap-1 text-[8px] tracking-[0.18em] text-black/40">
                        <CalendarDays size={10} />

                        {t("completedStatus")}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-black/70">
                        {formatDate(result.date)}
                      </p>

                    </div>

                    {/* PARTICIPANTS */}

                    <div>

                      <p className="flex items-center gap-1 text-[8px] tracking-[0.18em] text-black/40">
                        <Users size={10} />

                        {t("participantsLabel")}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-black/70">
                        {result.bidCount.toLocaleString(
                          language === "am"
                            ? "am-ET"
                            : "en-US"
                        )}
                      </p>

                    </div>

                  </div>

                  {/* =================================================
                      VIEW RESULT
                  ================================================= */}

                  <Link
                    href={`/results/${result.id}`}
                    className="group/button mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#F78000] px-4 text-sm font-bold text-white shadow-md shadow-[#F78000]/20 transition hover:bg-[#D96E00] hover:shadow-lg"
                  >
                    {t("viewResult")}

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover/button:translate-x-1"
                    />
                  </Link>

                  {/* STATUS */}

                  <p className="mt-3 text-center text-[12px] text-black/40">
                    {t("auctionCompletedStatus")}
                  </p>

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="mt-10 rounded-2xl border border-black/10 bg-black/[0.02] px-6 py-16 text-center">

            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F78000]/10 text-[#F78000]">
              <Trophy size={22} />
            </div>

            <h3
              className={`mt-5 text-2xl ${
                language === "am"
                  ? "font-sans"
                  : "font-display"
              }`}
            >
              {t("noResultsFound")}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/40">
              {t("noResultsDescription")}
            </p>

          </div>

        )}

        {/* ===================================================
            BOTTOM CTA
        =================================================== */}

        {latestResults.length > 0 && (
          <div className="mt-10 flex justify-center">

            <Link
              href="/results"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#1681C5] transition hover:text-[#F78000]"
            >
              {t("viewAllResults")}

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>
        )}

      </div>
    </section>
  );
}