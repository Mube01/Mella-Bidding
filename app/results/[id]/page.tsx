"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Crown,
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

type BidBreakdown = {
  amount: number;
  submissions: number;
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

/* =============================================================
   DATE FORMAT
   Amharic  → Ethiopian Calendar
   English  → Gregorian Calendar
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

  const [loading, setLoading] = useState(true);

  /* ===========================================================
     FETCH RESULT
  =========================================================== */

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

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

            /*
             * English:
             * Gregorian calendar
             *
             * Amharic:
             * Ethiopian calendar
             */
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
              match.winnerName ?? null,

            winnerPhone:
              match.winnerPhone ?? null,
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

              {/* =================================================
                  SMALL INFORMATION STRIP
              ================================================= */}

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
                        <p className="mt-1 text-xs text-black/45">
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

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[460px] text-left text-xs sm:min-w-[500px] sm:text-sm">

                    <thead className="bg-black/[0.02] text-[10px] uppercase tracking-wider text-black/40 sm:text-xs">

                      <tr>

                        <th className="px-4 py-3 sm:px-5">
                          {t(
                            "bidAmount"
                          )}
                        </th>

                        <th className="px-4 py-3 sm:px-5">
                          {t(
                            "submissions"
                          )}
                        </th>

                        <th className="px-4 py-3 sm:px-5">
                          {t(
                            "result"
                          )}
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {databaseResult.breakdown.map(
                        (bid) => (
                          <tr
                            key={`${bid.amount}-${bid.submissions}`}
                            className="border-t border-black/5"
                          >

                            <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold sm:px-5 sm:py-4">
                              {language ===
                              "am"
                                ? "ብር"
                                : "ETB"}{" "}
                              {bid.amount.toFixed(
                                2
                              )}
                            </td>

                            <td className="px-4 py-3 sm:px-5 sm:py-4">
                              {bid.submissions}
                            </td>

                            <td
                              className={`whitespace-nowrap px-4 py-3 font-semibold sm:px-5 sm:py-4 ${
                                bid.winner
                                  ? "text-[#F78000]"
                                  : bid.unique
                                  ? "text-[#1681C5]"
                                  : "text-black/45"
                              }`}
                            >
                              {bid.winner
                                ? t(
                                    "winnerLowestUniqueBid"
                                  )
                                : bid.unique
                                ? t(
                                    "unique"
                                  )
                                : t(
                                    "notUnique"
                                  )}
                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

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