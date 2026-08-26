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

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLanguage } from "../../context/LanguageContext";

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
    description:
      "The iPhone 16 Pro Max auction has successfully concluded. The winning participant and final published result are shown below.",
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
    description:
      "The Samsung OLED TV auction has successfully concluded with the final result published for transparency.",
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
    description:
      "The Mystery Tech Box auction has ended and the winning participant has been published.",
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
    description:
      "The PlayStation 5 Slim auction has concluded. The final result and winning participant are shown below.",
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
    description:
      "The LG Smart Refrigerator auction has concluded and the final result has been published.",
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
    description:
      "The MacBook Air auction has successfully concluded. The winning participant and published result are shown below.",
  },
];

export default function IndividualResultPage() {
  const params = useParams();
  const { t, language } = useLanguage();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const result = results.find(
    (item) =>
      item.id.toLowerCase() === String(id).toLowerCase()
  );

  /*
   * ============================================================
   * RESULT NOT FOUND
   * ============================================================
   */

  if (!result) {
    return (
      <main className="min-h-screen bg-white">
        <Header />

        <div className="pt-[120px]">
          <div className="flex min-h-[75vh] items-center justify-center px-6">
            <div className="max-w-md text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#F78000]/10 text-[#F78000]">
                <Trophy size={25} />
              </div>

              <h1 className="mt-6 font-display text-4xl tracking-[-0.04em]">
                {language === "am"
                  ? "ውጤቱ አልተገኘም"
                  : "Result not found"}
              </h1>

              <p className="mt-3 text-sm leading-6 text-black/40">
                {language === "am"
                  ? "የፈለጉት የጨረታ ውጤት አልተገኘም።"
                  : "The auction result you're looking for does not exist."}
              </p>

              <Link
                href="/results"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1681C5] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#116d9f]"
              >
                <ArrowLeft size={16} />

                {language === "am"
                  ? "ወደ ውጤቶች ተመለስ"
                  : "Back to results"}
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-[120px]">

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
          <Link
            href="/results"
            className="inline-flex items-center gap-2 text-xs font-semibold text-black/40 transition hover:text-[#1681C5]"
          >
            <ArrowLeft size={14} />

            {language === "am"
              ? "ሁሉም ውጤቶች"
              : "All results"}
          </Link>
        </div>

        {/* =====================================================
            MAIN RESULT
        ===================================================== */}

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

            {/* =================================================
                IMAGE
            ================================================= */}

            <div>
              <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-black/[0.02]">

                {/* COMPLETED BADGE */}

                <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-[#1681C5] shadow-sm backdrop-blur">
                  <CheckCircle2 size={13} />

                  {language === "am"
                    ? "ተጠናቋል"
                    : "COMPLETED"}
                </div>

                {/* TROPHY */}

                <div className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-[#F78000] text-white shadow-lg">
                  <Trophy size={18} />
                </div>

                <div className="aspect-[1.05/1] overflow-hidden">
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

              <div className="mt-4 grid grid-cols-3 gap-3">
                <SmallStat
                  icon={<Users size={16} />}
                  label={
                    language === "am"
                      ? "ተሳታፊዎች"
                      : "Participants"
                  }
                  value={result.participants.toLocaleString()}
                />

                <SmallStat
                  icon={<CalendarDays size={16} />}
                  label={
                    language === "am"
                      ? "የተጠናቀቀ"
                      : "Completed"
                  }
                  value={result.date}
                />

                <SmallStat
                  icon={<Trophy size={16} />}
                  label={
                    language === "am"
                      ? "ውጤት"
                      : "Result"
                  }
                  value={`#${result.id}`}
                />
              </div>
            </div>

            {/* =================================================
                RESULT DETAILS
            ================================================= */}

            <div>

              {/* CATEGORY */}

              <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.22em] text-[#1681C5]">
                <span className="h-px w-7 bg-[#1681C5]" />

                {result.category.toUpperCase()}
              </div>

              {/* TITLE */}

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl">
                    {result.title}
                  </h1>

                  <p className="mt-4 text-base leading-7 text-black/50">
                    {result.subtitle}
                  </p>
                </div>

                <span className="shrink-0 rounded-md bg-black/5 px-2 py-1 font-mono text-[9px] text-black/40">
                  #{result.id}
                </span>
              </div>

              {/* DESCRIPTION */}

              <p className="mt-5 text-sm leading-6 text-black/45">
                {result.description}
              </p>

              <div className="my-7 h-px bg-black/10" />

              {/* =================================================
                  WINNER CARD
              ================================================= */}

              <div className="rounded-2xl border border-[#F78000]/20 bg-[#F78000]/5 p-5">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#F78000]">
                      {language === "am"
                        ? "የአሸናፊ ውጤት"
                        : "WINNING RESULT"}
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      {language === "am"
                        ? "የጨረታው አሸናፊ"
                        : "Auction winner"}
                    </h2>
                  </div>

                  <Trophy
                    size={20}
                    className="text-[#F78000]"
                  />
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">

                  {/* WINNER */}

                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-[#F78000] text-white shadow-md">
                      <Crown size={19} />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold tracking-[0.15em] text-black/30">
                        {language === "am"
                          ? "አሸናፊ"
                          : "WINNER"}
                      </p>

                      <p className="mt-1 text-base font-bold">
                        {result.winner}
                      </p>
                    </div>
                  </div>

                  {/* BID */}

                  <div className="text-right">
                    <p className="text-[9px] font-bold tracking-[0.15em] text-black/30">
                      {language === "am"
                        ? "የአሸናፊ መጫረቻ"
                        : "WINNING BID"}
                    </p>

                    <p className="mt-1 font-mono text-xl font-bold text-[#1681C5]">
                      {result.winningBid}
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  META
              ================================================= */}

              <div className="mt-4 grid grid-cols-2 gap-3">

                <SmallInfo
                  icon={<CalendarDays size={16} />}
                  label={
                    language === "am"
                      ? "የተጠናቀቀበት ቀን"
                      : "Completed"
                  }
                  value={result.date}
                />

                <SmallInfo
                  icon={<Users size={16} />}
                  label={
                    language === "am"
                      ? "ተሳታፊዎች"
                      : "Participants"
                  }
                  value={result.participants.toLocaleString()}
                />

              </div>

              {/* BACK BUTTON */}

              <Link
                href="/results"
                className="group mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white text-sm font-bold transition hover:border-[#1681C5] hover:text-[#1681C5]"
              >
                {language === "am"
                  ? "ሁሉንም ውጤቶች ይመልከቱ"
                  : "View all results"}

                <ArrowRight
                  size={15}
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
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">

            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-[#1681C5]">
                <span className="h-px w-8 bg-[#1681C5]" />

                {t("transparent")}
              </div>

              <h2 className="mt-4 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                {language === "am"
                  ? "ውጤቱ ግልጽ ነው።"
                  : "The result is public."}
              </h2>

              <p className="mt-4 text-sm leading-6 text-black/45">
                {language === "am"
                  ? "ጨረታው ከተጠናቀቀ በኋላ የአሸናፊው መረጃ እና የጨረታው ውጤት ለግልጽነት ይታያሉ።"
                  : "Once an auction closes, its result is published so participants can clearly see the outcome."}
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">

              <RuleCard
                icon={<Trophy size={19} />}
                title={
                  language === "am"
                    ? "አሸናፊ ታትሟል"
                    : "Published winner"
                }
                description={
                  language === "am"
                    ? "የጨረታው አሸናፊ ከጨረታው መጠናቀቅ በኋላ በግልጽ ይታያል።"
                    : "The winning participant is displayed after the auction closes."
                }
              />

              <RuleCard
                icon={<CheckCircle2 size={19} />}
                title={
                  language === "am"
                    ? "የመጨረሻ ውጤት"
                    : "Final result"
                }
                description={
                  language === "am"
                    ? "የአሸናፊው መጫረቻ እና የጨረታው መረጃ ታትሟል።"
                    : "The winning bid and completion information are published."
                }
              />

              <RuleCard
                icon={<Users size={19} />}
                title={
                  language === "am"
                    ? "የተሳታፊዎች መረጃ"
                    : "Participation record"
                }
                description={
                  language === "am"
                    ? "የጨረታው ተሳታፊዎች ቁጥር በውጤቱ ውስጥ ይታያል።"
                    : "The number of participants is included in the published result."
                }
              />

            </div>
          </div>
        </section>

        {/* =====================================================
            STATUS
        ===================================================== */}

        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">

          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="grid h-11 w-11 place-items-center rounded-full bg-green-500/10 text-green-600">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <p className="text-[9px] font-bold tracking-[0.18em] text-black/30">
                    {language === "am"
                      ? "የጨረታ ሁኔታ"
                      : "AUCTION STATUS"}
                  </p>

                  <p className="mt-1 text-base font-bold">
                    {language === "am"
                      ? "ጨረታው ተጠናቋል"
                      : "Auction completed"}
                  </p>
                </div>

              </div>

              <Link
                href="/results"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 px-5 py-3 text-xs font-bold transition hover:border-[#1681C5] hover:text-[#1681C5]"
              >
                {language === "am"
                  ? "ሁሉንም ውጤቶች"
                  : "View all results"}

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
   SMALL STAT
============================================================= */

function SmallStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-3">

      <div className="flex items-center gap-2 text-black/35">
        {icon}

        <span className="truncate text-[9px] font-bold uppercase tracking-[0.08em]">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-xs font-bold">
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
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">

      <div className="flex items-center gap-2 text-black/35">
        {icon}

        <span className="text-[9px] font-bold uppercase tracking-[0.08em]">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold">
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
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">

      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
        {icon}
      </div>

      <h3 className="mt-6 text-base font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-black/40">
        {description}
      </p>

    </div>
  );
}