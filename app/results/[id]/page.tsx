"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Crown,
  Gavel,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLanguage } from "../../context/LanguageContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

/* =============================================================
   TYPES
============================================================= */

type BidBreakdown = {
  amount: number;
  submissions: number;
  phoneNumbers: string[];
  unique: boolean;
  winner: boolean;
};

type ResultItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  winner: string;
  winningBid: string;
  date: string;
  bidCount: number;
  description: string;
};

type DatabaseResult = ResultItem & {
  breakdown: BidBreakdown[];
  winnerName: string | null;
  winnerPhone: string | null;
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

/* =============================================================
   DATE FORMAT

   Amharic → Ethiopian Calendar
   English → Gregorian Calendar
============================================================= */

function formatResultDate(
  date: string | Date,
  language: "en" | "am"
) {
  if (!date) {
    return "";
  }

  const parsedDate =
    date instanceof Date
      ? date
      : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  if (language === "am") {
    return new Intl.DateTimeFormat(
      "am-ET-u-ca-ethiopic",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    ).format(parsedDate);
  }

  return new Intl.DateTimeFormat(
    "en-US-u-ca-gregory",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(parsedDate);
}

/* =============================================================
   PAGE
============================================================= */

export default function IndividualResultPage() {
  const params = useParams();
  const { t, language } = useLanguage();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [databaseResult, setDatabaseResult] =
    useState<DatabaseResult | null>(null);

  const [loading, setLoading] =
    useState(true);

  /* ===========================================================
     TRANSPARENT BID BREAKDOWN PAGINATION
  =========================================================== */

  const [breakdownPage, setBreakdownPage] =
    useState(1);

  const BREAKDOWN_PER_PAGE = 10;

  /* ===========================================================
     FETCH RESULT
  =========================================================== */

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    /*
     * Reset pagination whenever
     * result or language changes.
     */
    setBreakdownPage(1);

    fetch(
      `/api/results/${encodeURIComponent(
        String(id)
      )}?lang=${language}`,
      {
        cache: "no-store",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch result"
          );
        }

        return response.json();
      })
      .then((data) => {
        if (
          data.success &&
          data.result
        ) {
          const match = data.result;

          setDatabaseResult({
            ...match,

            winningBid: `ETB ${Number(
              match.winningBid
            ).toLocaleString()}`,

            date: formatResultDate(
              match.date,
              language
            ),

            category:
              match.category,

            breakdown:
              Array.isArray(
                match.breakdown
              )
                ? match.breakdown
                : [],

            winnerName:
              match.winnerName ??
              null,

            winnerPhone:
              match.winnerPhone ??
              null,
          });
        } else {
          setDatabaseResult(null);
        }
      })
      .catch((error) => {
        console.error(
          "Failed to load result:",
          error
        );

        setDatabaseResult(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, language]);

  /* ===========================================================
     RESULT
  =========================================================== */

  const result = databaseResult;

  /* ===========================================================
     BREAKDOWN PAGINATION
  =========================================================== */

  const breakdown =
    result?.breakdown ?? [];

  const breakdownTotalPages =
    Math.max(
      1,
      Math.ceil(
        breakdown.length /
          BREAKDOWN_PER_PAGE
      )
    );

  const safeBreakdownPage =
    Math.min(
      breakdownPage,
      breakdownTotalPages
    );

  const breakdownStartIndex =
    (safeBreakdownPage - 1) *
    BREAKDOWN_PER_PAGE;

  const paginatedBreakdown =
    breakdown.slice(
      breakdownStartIndex,
      breakdownStartIndex +
        BREAKDOWN_PER_PAGE
    );

  /* ===========================================================
     LOADING
  =========================================================== */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <LoadingSpinner size="lg" />
      </main>
    );
  }

  /* ===========================================================
     NOT FOUND
  =========================================================== */

  if (!databaseResult || !result) {
    return (
      <main className="min-h-screen bg-white">
        <Header />

        <div className="pt-[100px] sm:pt-[120px]">
          <div className="flex min-h-[75vh] items-center justify-center px-5 sm:px-6">
            <div className="max-w-md text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#F78000]/10 text-[#F78000]">
                <Trophy size={25} />
              </div>

              <h1 className="mt-6 font-display text-3xl tracking-[-0.04em] sm:text-4xl">
                {t("resultNotFound")}
              </h1>

              <p className="mt-3 text-sm leading-6 text-black/40">
                {t(
                  "resultNotFoundDescription"
                )}
              </p>

              <Link
                href="/results"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1681C5] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#116d9f]"
              >
                <ArrowLeft size={16} />
                {t("backToResults")}
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  /* ===========================================================
     MAIN PAGE
  =========================================================== */

  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <Header />

      <div className="pt-[100px] sm:pt-[120px]">

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-6 sm:pt-8 lg:px-10">
          <Link
            href="/results"
            className="inline-flex items-center gap-2 text-xs font-semibold text-black/40 transition hover:text-[#1681C5]"
          >
            <ArrowLeft size={14} />
            {t("allResults")}
          </Link>
        </div>

        {/* =====================================================
            MAIN RESULT
        ===================================================== */}

        <section className="mx-auto max-w-7xl px-5 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-12">

          <div className="grid gap-7 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

            {/* =================================================
                IMAGE
            ================================================= */}

            <div className="min-w-0">

              <div className="relative overflow-hidden rounded-[22px] border border-black/10 bg-black/[0.02] sm:rounded-[28px]">

                {/* COMPLETED BADGE */}

                <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-bold tracking-[0.1em] text-[#1681C5] shadow-sm backdrop-blur sm:left-5 sm:top-5 sm:gap-2 sm:px-4 sm:py-2 sm:text-[10px]">

                  <CheckCircle2 size={12} />

                  {t("completed")}

                </div>

                {/* TROPHY */}

                <div className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-[#F78000] text-white shadow-lg sm:right-5 sm:top-5 sm:h-11 sm:w-11">

                  <Trophy
                    size={16}
                    className="sm:h-[18px] sm:w-[18px]"
                  />

                </div>

                {/* IMAGE */}

                <div className="aspect-square w-full overflow-hidden sm:aspect-[1.05/1]">

                  <img
                    src={result.image}
                    alt={result.title}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />

                </div>

              </div>

              {/* SMALL INFORMATION STRIP */}

              <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">

                <SmallStat
                  icon={
                    <Users
                      size={14}
                      className="sm:h-4 sm:w-4"
                    />
                  }
                  label={t(
                    "participantsLabel"
                  )}
                  value={result.bidCount.toLocaleString()}
                />

                <SmallStat
                  icon={
                    <CalendarDays
                      size={14}
                      className="sm:h-4 sm:w-4"
                    />
                  }
                  label={t(
                    "completedLabel"
                  )}
                  value={result.date}
                />

                <SmallStat
                  icon={
                    <Trophy
                      size={14}
                      className="sm:h-4 sm:w-4"
                    />
                  }
                  label={t(
                    "resultLabel"
                  )}
                  value={`#${result.id}`}
                />

              </div>

            </div>

            {/* =================================================
                RESULT DETAILS
            ================================================= */}

            <div className="min-w-0">

              {/* CATEGORY */}

              <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.18em] text-[#1681C5] sm:gap-3 sm:text-[10px] sm:tracking-[0.22em]">

                <span className="h-px w-5 bg-[#1681C5] sm:w-7" />

                {getCategoryLabel(
                  result.category,
                  language
                )}

              </div>

              {/* TITLE */}

              <div className="mt-4 flex items-start justify-between gap-3 sm:mt-5 sm:gap-4">

                <div className="min-w-0">

                  <h1 className="break-words font-display text-4xl leading-[0.95] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                    {result.title}
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-black/50 sm:mt-4 sm:text-base sm:leading-7">
                    {result.subtitle}
                  </p>

                </div>

                <span className="shrink-0 rounded-md bg-black/5 px-1.5 py-1 font-mono text-[8px] text-black/40 sm:px-2 sm:text-[9px]">
                  #{result.id}
                </span>

              </div>

              {/* DESCRIPTION */}

              <p className="mt-4 text-sm leading-6 text-black/45 sm:mt-5">
                {result.description}
              </p>

              <div className="my-6 h-px bg-black/10 sm:my-7" />

              {/* =================================================
                  WINNER CARD
              ================================================= */}

              <div className="rounded-2xl border border-[#F78000]/20 bg-[#F78000]/5 p-4 sm:p-5">

                <div className="flex items-center justify-between gap-3">

                  <div>

                    <p className="text-[9px] font-bold tracking-[0.12em] text-[#F78000] sm:text-[10px] sm:tracking-[0.15em]">
                      {t("winningResult")}
                    </p>

                    <h2 className="mt-1 text-base font-semibold sm:text-lg">
                      {t("auctionWinner")}
                    </h2>

                  </div>

                  <Trophy
                    size={18}
                    className="shrink-0 text-[#F78000] sm:h-5 sm:w-5"
                  />

                </div>

                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

                  {/* WINNER */}

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F78000] text-white shadow-md sm:h-11 sm:w-11">

                      <Crown
                        size={18}
                        className="sm:h-[19px] sm:w-[19px]"
                      />

                    </div>

                    <div className="min-w-0">

                      <p className="text-[8px] font-bold tracking-[0.15em] text-black/30 sm:text-[9px]">
                        {t("winner")}
                      </p>

                      <p className="mt-1 truncate text-sm font-bold sm:text-base">
                        {databaseResult.winnerName ||
                          t("winner")}
                      </p>

                      {databaseResult.winnerPhone && (
                        <p className="mt-1 font-mono text-xs tracking-wide text-black/45">
                          {databaseResult.winnerPhone}
                        </p>
                      )}

                    </div>

                  </div>

                  {/* WINNING BID */}

                  <div className="border-t border-[#F78000]/10 pt-4 text-left sm:border-t-0 sm:pt-0 sm:text-right">

                    <p className="text-[8px] font-bold tracking-[0.15em] text-black/30 sm:text-[9px]">
                      {t("winningBid")}
                    </p>

                    <p className="mt-1 font-mono text-lg font-bold text-[#1681C5] sm:text-xl">
                      {result.winningBid}
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                  TRANSPARENT BID BREAKDOWN
              ================================================= */}

              <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm sm:mt-6">

                {/* HEADER */}

                <div className="border-b border-black/10 p-4 sm:p-5">

                  <p className="text-[9px] font-bold tracking-[0.12em] text-[#1681C5] sm:text-[10px] sm:tracking-[0.15em]">
                    {t(
                      "transparentBidBreakdown"
                    )}
                  </p>

                  <h2 className="mt-1 text-base font-semibold sm:text-lg">
                    {t(
                      "everySubmittedAmount"
                    )}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-black/45">
                    {t(
                      "bidderIdentitiesPrivate"
                    )}
                  </p>

                </div>

                {/* =================================================
                    BID BREAKDOWN TABLE
                ================================================= */}

                <div className="w-full overflow-hidden">

                  <table className="w-full table-fixed text-left text-[9px] sm:text-sm">

                    <thead className="bg-neutral-50">

                      <tr>

                        <th className="w-[24%] px-2 py-3 font-bold text-neutral-400 sm:px-5 sm:py-3.5">
                          {language === "am"
                            ? "የጨረታ መጠን"
                            : "Bid Amount"}
                        </th>

                        <th className="w-[17%] px-2 py-3 font-bold text-neutral-400 sm:px-5 sm:py-3.5">
                          {language === "am"
                            ? "ብዛት"
                            : "Submissions"}
                        </th>

                        <th className="w-[31%] px-2 py-3 font-bold text-neutral-400 sm:px-5 sm:py-3.5">
                          {language === "am"
                            ? "ተወዳዳሪ"
                            : "Bidder"}
                        </th>

                        <th className="w-[28%] px-2 py-3 font-bold text-neutral-400 sm:px-5 sm:py-3.5">
                          {language === "am"
                            ? "ውጤት"
                            : "Result"}
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {paginatedBreakdown.length > 0 ? (
                        paginatedBreakdown.map(
                          (bid, index) => (
                            <tr
                              key={`${bid.amount}-${bid.submissions}-${index}`}
                              className={`border-t transition ${
                                bid.winner
                                  ? "border-mella-green/30 bg-gradient-to-r from-mella-green/10 via-[#F78000]/10 to-yellow-400/10"
                                  : "border-black/5 hover:bg-black/[0.02]"
                              }`}
                            >

                              {/* BID AMOUNT */}

                              <td className="px-2 py-3 sm:px-5 sm:py-4">

                                <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">

                                  {bid.winner && (
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F78000] to-yellow-400 text-white shadow-sm sm:h-7 sm:w-7">

                                      <Trophy
                                        size={11}
                                        className="sm:h-[13px] sm:w-[13px]"
                                      />

                                    </div>
                                  )}

                                  <span
                                    className={`min-w-0 break-words font-semibold ${
                                      bid.winner
                                        ? "font-bold text-mella-green"
                                        : "text-neutral-900"
                                    }`}
                                  >
                                    {formatAmount(
                                      bid.amount
                                    )}{" "}

                                    <span className="text-[8px] font-medium text-neutral-400 sm:text-xs">
                                      {language === "am"
                                        ? "ብር"
                                        : "ETB"}
                                    </span>
                                  </span>

                                </div>

                              </td>

                              {/* SUBMISSIONS */}

                              <td className="px-2 py-3 sm:px-5 sm:py-4">

                                <span
                                  className={
                                    bid.winner
                                      ? "font-bold text-[#F78000]"
                                      : "font-medium text-neutral-700"
                                  }
                                >
                                  {bid.submissions}
                                </span>

                              </td>

                              {/* BIDDER */}

                              <td className="px-2 py-3 sm:px-5 sm:py-4">

                                <div className="flex min-w-0 flex-col gap-1">

                                  {bid.phoneNumbers?.length > 0 ? (
                                    bid.phoneNumbers.map(
                                      (
                                        phone,
                                        index
                                      ) => (
                                        <span
                                          key={`${phone}-${index}`}
                                          className={`break-all font-mono text-[8px] tracking-wide sm:text-xs ${
                                            bid.winner
                                              ? "font-semibold text-mella-green"
                                              : "text-black/55"
                                          }`}
                                        >
                                          {phone}
                                        </span>
                                      )
                                    )
                                  ) : (
                                    <span className="text-black/30">
                                      —
                                    </span>
                                  )}

                                </div>

                              </td>

                              {/* RESULT */}

                              <td className="px-2 py-3 sm:px-5 sm:py-4">

                                {bid.winner ? (
                                  <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-gradient-to-r from-mella-green to-[#F78000] px-2 py-1 text-[8px] font-bold leading-tight text-white shadow-sm sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs">

                                    <Trophy
                                      size={10}
                                      className="shrink-0 sm:h-[14px] sm:w-[14px]"
                                    />

                                    <span className="break-words">
                                      {language === "am"
                                        ? "የአሸናፊ ጨረታ"
                                        : "Winning Bid"}
                                    </span>

                                  </span>
                                ) : bid.unique ? (
                                  <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-mella-green/10 px-2 py-1 text-[8px] font-semibold leading-tight text-mella-green sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">

                                    <CheckCircle2
                                      size={10}
                                      className="shrink-0 sm:h-[14px] sm:w-[14px]"
                                    />

                                    <span>
                                      {language === "am"
                                        ? "ልዩ"
                                        : "Unique"}
                                    </span>

                                  </span>
                                ) : (
                                  <span className="inline-flex max-w-full rounded-full bg-neutral-100 px-2 py-1 text-[8px] font-semibold leading-tight text-neutral-400 sm:px-3 sm:py-1.5 sm:text-xs">

                                    {language === "am"
                                      ? "የተደገመ"
                                      : "Repeated"}

                                  </span>
                                )}

                              </td>

                            </tr>
                          )
                        )
                      ) : (
                        <tr>

                          <td
                            colSpan={4}
                            className="px-5 py-8 text-center text-xs text-black/35"
                          >
                            —
                          </td>

                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>

                {/* =================================================
                    ARROW-ONLY PAGINATION
                ================================================= */}

                {breakdownTotalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-black/10 px-4 py-3 sm:px-5 sm:py-4">

                    <button
                      type="button"
                      disabled={
                        safeBreakdownPage === 1
                      }
                      onClick={() =>
                        setBreakdownPage(
                          (page) =>
                            Math.max(
                              1,
                              page - 1
                            )
                        )
                      }
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 text-xs font-semibold text-neutral-600 transition hover:border-[#1681C5] hover:text-[#1681C5] disabled:pointer-events-none disabled:opacity-30 sm:h-10 sm:px-4"
                      aria-label={
                        language === "am"
                          ? "የቀድሞ ገጽ"
                          : "Previous page"
                      }
                    >
                      <ChevronLeft
                        size={15}
                      />

                      <span>
                        {language === "am"
                          ? "ቀዳሚ"
                          : "Previous"}
                      </span>
                    </button>

                    <p className="text-[10px] font-medium text-black/35 sm:text-xs">
                      {language === "am"
                        ? `${safeBreakdownPage} / ${breakdownTotalPages}`
                        : `Page ${safeBreakdownPage} of ${breakdownTotalPages}`}
                    </p>

                    <button
                      type="button"
                      disabled={
                        safeBreakdownPage ===
                        breakdownTotalPages
                      }
                      onClick={() =>
                        setBreakdownPage(
                          (page) =>
                            Math.min(
                              breakdownTotalPages,
                              page + 1
                            )
                        )
                      }
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 text-xs font-semibold text-neutral-600 transition hover:border-[#1681C5] hover:text-[#1681C5] disabled:pointer-events-none disabled:opacity-30 sm:h-10 sm:px-4"
                      aria-label={
                        language === "am"
                          ? "ቀጣይ ገጽ"
                          : "Next page"
                      }
                    >
                      <span>
                        {language === "am"
                          ? "ቀጣይ"
                          : "Next"}
                      </span>

                      <ChevronRight
                        size={15}
                      />

                    </button>

                  </div>
                )}

              </div>

              {/* =================================================
                  META
              ================================================= */}

              <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">

                <SmallInfo
                  icon={
                    <CalendarDays
                      size={14}
                      className="sm:h-4 sm:w-4"
                    />
                  }
                  label={t(
                    "completedOn"
                  )}
                  value={result.date}
                />

                <SmallInfo
                  icon={
                    <Users
                      size={14}
                      className="sm:h-4 sm:w-4"
                    />
                  }
                  label={t(
                    "participantsLabel"
                  )}
                  value={result.bidCount.toLocaleString()}
                />

              </div>

              {/* =================================================
                  VIEW ALL RESULTS
              ================================================= */}

              <Link
                href="/results"
                className="group mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white text-xs font-bold transition hover:border-[#1681C5] hover:text-[#1681C5] sm:mt-5 sm:text-sm"
              >
                {t("viewAllResults")}

                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

            </div>

          </div>

        </section>

        {/* =====================================================
            RESULT INFORMATION
        ===================================================== */}

        <section className="border-y border-black/10 bg-black/[0.02]">

          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">

            <div className="max-w-2xl">

              <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] text-[#1681C5] sm:gap-3 sm:text-[10px] sm:tracking-[0.25em]">

                <span className="h-px w-6 bg-[#1681C5] sm:w-8" />

                {t("transparent")}

              </div>

              <h2 className="mt-4 font-display text-3xl leading-tight tracking-[-0.03em] sm:text-4xl md:text-5xl">
                {t("resultIsPublic")}
              </h2>

              <p className="mt-4 text-sm leading-6 text-black/45">
                {t(
                  "resultPublicDescription"
                )}
              </p>

            </div>

            <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3">

              <RuleCard
                icon={<Trophy size={18} />}
                title={t(
                  "publishedWinner"
                )}
                description={t(
                  "publishedWinnerDescription"
                )}
              />

              <RuleCard
                icon={
                  <CheckCircle2
                    size={18}
                  />
                }
                title={t(
                  "finalResult"
                )}
                description={t(
                  "finalResultDescription"
                )}
              />

              <RuleCard
                icon={<Users size={18} />}
                title={t(
                  "participationRecord"
                )}
                description={t(
                  "participationRecordDescription"
                )}
              />

            </div>

          </div>

        </section>

        {/* =====================================================
            STATUS
        ===================================================== */}

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-20">

          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3 sm:gap-4">

                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-500/10 text-green-600 sm:h-11 sm:w-11">

                  <CheckCircle2
                    size={18}
                    className="sm:h-5 sm:w-5"
                  />

                </div>

                <div>

                  <p className="text-[8px] font-bold tracking-[0.16em] text-black/30 sm:text-[9px] sm:tracking-[0.18em]">
                    {t("auctionStatus")}
                  </p>

                  <p className="mt-1 text-sm font-bold sm:text-base">
                    {t(
                      "auctionCompleted"
                    )}
                  </p>

                </div>

              </div>

              <Link
                href="/results"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 px-5 py-3 text-xs font-bold transition hover:border-[#1681C5] hover:text-[#1681C5] sm:w-auto"
              >

                {t("viewAllResults")}

                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />

              </Link>

            </div>

          </div>

        </section>

        <Footer />

      </div>

    </main>
  );
}

/* =============================================================
   CATEGORY TRANSLATION
============================================================= */

function getCategoryLabel(
  category: string,
  language: "en" | "am"
) {
  if (language !== "am") {
    return category.toUpperCase();
  }

  const categories: Record<
    string,
    string
  > = {
    Electronics: "ኤሌክትሮኒክስ",
    Automotive: "አውቶሞቲቭ",
    Home: "የቤት ዕቃዎች",
    "Mystery Box": "ሚስጥራዊ ሳጥን",
  };

  return (
    categories[category] ||
    category
  );
}

/* =============================================================
   SMALL STAT
============================================================= */

function SmallStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-black/10 bg-white p-2.5 sm:p-3">

      <div className="flex min-w-0 items-center gap-1.5 text-black/35 sm:gap-2">

        {icon}

        <span className="truncate text-[8px] font-bold uppercase tracking-[0.05em] sm:text-[9px] sm:tracking-[0.08em]">
          {label}
        </span>

      </div>

      <p className="mt-1.5 truncate text-[10px] font-bold sm:mt-2 sm:text-xs">
        {value}
      </p>

    </div>
  );
}

/* =============================================================
   SMALL INFO
============================================================= */

function SmallInfo({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-black/10 bg-white p-3 sm:p-4">

      <div className="flex min-w-0 items-center gap-1.5 text-black/35 sm:gap-2">

        {icon}

        <span className="truncate text-[8px] font-bold uppercase tracking-[0.05em] sm:text-[9px] sm:tracking-[0.08em]">
          {label}
        </span>

      </div>

      <p className="mt-1.5 truncate text-xs font-semibold sm:mt-2 sm:text-sm">
        {value}
      </p>

    </div>
  );
}

/* =============================================================
   RULE CARD
============================================================= */

function RuleCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">

      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5] sm:h-10 sm:w-10">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-semibold sm:mt-6 sm:text-base">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-black/40 sm:text-sm sm:leading-6">
        {description}
      </p>

    </div>
  );
}