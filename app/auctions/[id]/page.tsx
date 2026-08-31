"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Gavel,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AuctionCountdown from "../../components/AuctionCountdown";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useLanguage } from "../../context/LanguageContext";

type AuctionDetails = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  image: string;
  participantCount: number;
  entryCost: number;
  startsAt: string;
  endsAt: string;
  status: "upcoming" | "live" | "completed" | "cancelled";
};

export default function AuctionDetailsPage() {
  const params = useParams();
  const { language } = useLanguage();

  const auctionId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [auction, setAuction] = useState<AuctionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [bid, setBid] = useState("1.00");
  const [selectedPackage, setSelectedPackage] = useState<5 | 10>(5);
  const [packageMessage, setPackageMessage] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  const [bidMessage, setBidMessage] = useState("");

  const decreaseBid = () => {
    setBid((value) =>
      Math.max(
        1,
        Number((Number(value || 1) - 0.01).toFixed(2))
      ).toFixed(2)
    );
  };

  const increaseBid = () => {
    setBid((value) =>
      Number(Number(value || 1) + 0.01).toFixed(2)
    );
  };

  const handleBidChange = (value: string) => {
    if (value === "") {
      setBid("");
      return;
    }

    const number = Number(value);

    if (Number.isFinite(number) && number >= 1) {
      setBid(number.toFixed(2));
    }
  };

  const packageOptions = [
    {
      bids: 5 as const,
      discount: 5,
      price: 75 * 5 * 0.95,
    },
    {
      bids: 10 as const,
      discount: 12,
      price: 75 * 10 * 0.88,
    },
  ];

  const selectedPackageDetails =
    packageOptions.find(
      (option) => option.bids === selectedPackage
    ) || packageOptions[0];

  function handlePackagePurchase() {
    setPackageMessage(
      language === "am"
        ? "የክፍያ አገልግሎቱ ሲዘጋጅ ይህ ጥቅል ይገኛል።"
        : "Payment is not connected yet. This package is ready for checkout."
    );
  }

  /*
   * ============================================================
   * LOAD AUCTION
   * ============================================================
   */

  useEffect(() => {
    if (!auctionId) return;

    fetch(
      `/api/auctions/${encodeURIComponent(String(auctionId))}`,
      {
        cache: "no-store",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAuction(data.auction);
        }
      })
      .catch(() => {
        setAuction(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [auctionId]);

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <LoadingSpinner size="lg" />
      </main>
    );
  }

  /*
   * ============================================================
   * INVALID AUCTION
   * ============================================================
   */

  if (!auction) {
    return (
      <main className="min-h-screen bg-white">
        <Header />

        <div className="flex min-h-[80vh] items-center justify-center px-6 pt-[100px]">
          <div className="max-w-md text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#1681C5]/10 text-[#1681C5]">
              <Gavel size={24} />
            </div>

            <h1 className="mt-6 font-display text-4xl tracking-[-0.03em]">
              {language === "am"
                ? "ጨረታው አልተገኘም"
                : "Auction not found"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-black/45">
              {language === "am"
                ? "የጠየቁት ጨረታ አሁን አይገኝም ወይም ከስርዓቱ ተወግዷል።"
                : "The auction you're looking for doesn't exist or is no longer available."}
            </p>

            <Link
              href="/auctions"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1681C5] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#116d9f]"
            >
              <ArrowLeft size={16} />

              {language === "am"
                ? "ወደ ጨረታዎች ተመለስ"
                : "Back to auctions"}
            </Link>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  /*
   * ============================================================
   * SUBMIT BID
   * ============================================================
   */

  const handleBid = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!bid.trim() || bidLoading) {
      return;
    }

    setBidLoading(true);
    setBidMessage("");

    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          auctionId: auction.id,
          amount: Number(bid),
        }),
      });

      const data = await response.json();

      setBidMessage(
        response.ok
          ? language === "am"
            ? "መጫረቻዎ በተሳካ ሁኔታ ተልኳል።"
            : "Bid submitted successfully."
          : data.error ||
              (language === "am"
                ? "መጫረቻውን መላክ አልተቻለም።"
                : "Unable to submit bid.")
      );

      if (response.ok) {
        setBid("");
      }
    } catch {
      setBidMessage(
        language === "am"
          ? "መጫረቻውን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።"
          : "Unable to submit bid. Please try again."
      );
    } finally {
      setBidLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-[120px]">
        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-10">
          <Link
            href="/auctions"
            className="inline-flex items-center gap-2 text-xs font-semibold text-black/40 transition hover:text-[#1681C5]"
          >
            <ArrowLeft size={14} />

            {language === "am"
              ? "ሁሉም ጨረታዎች"
              : "All auctions"}
          </Link>
        </div>

        {/* =====================================================
            MAIN AUCTION
        ===================================================== */}

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-10">
            {/* =================================================
                IMAGE
            ================================================= */}

            <div className="min-w-0">
              <div className="relative overflow-hidden rounded-[24px] border border-black/10 bg-[#fff] sm:rounded-[28px]">
                {/* LIVE BADGE */}

                <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[9px] font-bold tracking-[0.12em] text-[#1681C5] shadow-sm backdrop-blur sm:left-5 sm:top-5 sm:px-4 sm:text-[10px]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#1681C5]" />

                  {language === "am"
                    ? "በቀጥታ"
                    : "LIVE NOW"}
                </div>

                <div className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[4/3]">
                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              {/* SMALL INFORMATION STRIP */}

              <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                <SmallStat
                  icon={<Users size={16} />}
                  label={
                    language === "am"
                      ? "ተሳታፊዎች"
                      : "Participants"
                  }
                  value={String(
                    auction.participantCount ?? 0
                  )}
                />

                <SmallStat
                  icon={<Clock3 size={16} />}
                  label={
                    language === "am"
                      ? "ሁኔታ"
                      : "Status"
                  }
                  value={
                    language === "am"
                      ? "በቀጥታ"
                      : "Live"
                  }
                />

                <SmallStat
                  icon={<Gavel size={16} />}
                  label={
                    language === "am"
                      ? "ጨረታ"
                      : "Auction"
                  }
                  value={`#${auction.id}`}
                />
              </div>
            </div>

            {/* =================================================
                AUCTION DETAILS
            ================================================= */}

            <div className="min-w-0">
              {/* CATEGORY */}

              <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.22em] text-[#1681C5]">
                <span className="h-px w-7 bg-[#1681C5]" />

                {auction.category.toUpperCase()}
              </div>

              {/* TITLE */}

              <h1 className="mt-5 break-words font-display text-4xl leading-[0.95] tracking-[-0.04em] sm:text-6xl">
                {auction.title}
              </h1>

              {/* SUBTITLE */}

              <p className="mt-4 text-base leading-7 text-black/50">
                {auction.subtitle}
              </p>

              {/* DESCRIPTION */}

              {auction.description && (
                <p className="mt-5 text-sm leading-6 text-black/45">
                  {auction.description}
                </p>
              )}

              {/* DIVIDER */}

              <div className="my-7 h-px bg-black/10" />

              {/* COUNTDOWN */}

              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-black/35">
                      {language === "am"
                        ? "የሚያበቃበት ጊዜ"
                        : "ENDS IN"}
                    </p>

                    <p className="mt-3 font-mono text-xl font-bold text-red-600">
                      <AuctionCountdown
                        endsAt={auction.endsAt}
                      />
                    </p>
                  </div>

                  <div className="hidden h-12 w-12 place-items-center rounded-xl bg-[#F78000]/10 text-[#F78000] sm:grid">
                    <Clock3 size={20} />
                  </div>
                </div>
              </div>

              {/* PARTICIPANTS */}

              <div className="mt-4 flex items-center justify-between rounded-xl border border-black/10 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-black/45">
                  <Users size={16} />

                  {language === "am"
                    ? "ተሳታፊዎች"
                    : "Participants"}
                </div>

                <span className="text-sm font-bold">
                  {auction.participantCount?.toLocaleString() ??
                    "0"}
                </span>
              </div>

              {/* =================================================
                  BID FORM
              ================================================= */}

              <form
                onSubmit={handleBid}
                className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#F78000]">
                      {language === "am"
                        ? "የመጫረቻ መጠን"
                        : "YOUR BID"}
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      {language === "am"
                        ? "መጫረቻዎን ያስገቡ"
                        : "Enter your bid"}
                    </h2>
                  </div>

                  <Gavel
                    size={20}
                    className="shrink-0 text-[#F78000]"
                  />
                </div>

                <div className="mt-5">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={decreaseBid}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-black/10 bg-black/5 text-black transition hover:border-[#F78000] hover:bg-[#F78000] hover:text-white"
                      aria-label="Decrease bid"
                    >
                      <Minus size={16} />
                    </button>

                    <div className="relative flex min-w-0 flex-1 items-center rounded-xl border border-black/10 bg-white focus-within:border-[#1681C5] focus-within:ring-2 focus-within:ring-[#1681C5]/10">
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={bid}
                        onChange={(event) =>
                          handleBidChange(
                            event.target.value
                          )
                        }
                        placeholder={
                          language === "am"
                            ? "የመጫረቻ መጠን"
                            : "Enter amount"
                        }
                        className="h-11 w-full min-w-0 bg-transparent px-3 pr-14 text-center font-mono text-md font-bold outline-none sm:px-4"
                      />

                      <span className="absolute right-3 text-[10px] font-bold text-black/35 sm:right-4">
                        ETB
                      </span>
                    </div>

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

                <button
                  type="submit"
                  disabled={bidLoading}
                  className="group mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#F78000] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#F78000]/20 transition hover:bg-[#D96E00] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {bidLoading
                    ? language === "am"
                      ? "በመላክ ላይ..."
                      : "Submitting..."
                    : language === "am"
                      ? "መጫረቻ ያስገቡ"
                      : "Submit Bid"}

                  {!bidLoading && (
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>

                {bidMessage && (
                  <p
                    role="status"
                    className="mt-3 text-center text-xs text-black/50"
                  >
                    {bidMessage}
                  </p>
                )}

                <p className="mt-3 text-center text-[10px] leading-5 text-black/35">
                  {language === "am"
                    ? "መጫረቻ ለማስገባት በመለያዎ መግባት እና በቂ የመጫረቻ ክሬዲት መኖር አለበት።"
                    : "You must be signed in and have enough bid credits to participate."}
                </p>
              </form>

              {/* =================================================
                  BID PACKAGES
              ================================================= */}

              <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#1681C5]">
                      {language === "am"
                        ? "የመጫረቻ ጥቅሎች"
                        : "BID PACKAGES"}
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      {language === "am"
                        ? "የመጫረቻ ጥቅል ይምረጡ"
                        : "Choose a bid package"}
                    </h2>
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-black/40">
                    ETB 75 / bid
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {packageOptions.map(
                    (option) => {
                      const active =
                        selectedPackage ===
                        option.bids;

                      return (
                        <button
                          key={option.bids}
                          type="button"
                          onClick={() => {
                            setSelectedPackage(
                              option.bids
                            );
                            setPackageMessage("");
                          }}
                          className={`rounded-xl border p-4 text-left transition ${
                            active
                              ? "border-[#1681C5] bg-[#1681C5]/[0.04] ring-2 ring-[#1681C5]/10"
                              : "border-black/10 hover:border-[#1681C5]/40"
                          }`}
                          aria-pressed={active}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-base font-bold">
                              {option.bids}{" "}
                              {language === "am"
                                ? "መጫረቻዎች"
                                : "bids"}
                            </span>

                            <span className="rounded-full bg-[#F78000]/10 px-2 py-1 text-[10px] font-bold text-[#F78000]">
                              -{option.discount}%
                            </span>
                          </div>

                          <p className="mt-2 text-lg font-bold text-[#1681C5]">
                            ETB{" "}
                            {option.price.toFixed(
                              2
                            )}
                          </p>

                          <p className="mt-1 text-xs text-black/40">
                            {language === "am"
                              ? "ቅናሽ ያለው ዋጋ"
                              : "Discounted package price"}
                          </p>
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  type="button"
                  onClick={handlePackagePurchase}
                  className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-[#1681C5] px-4 text-sm font-bold text-white transition hover:bg-[#116d9f]"
                >
                  {language === "am"
                    ? `${selectedPackageDetails.bids} መጫረቻዎችን ይግዙ`
                    : `Continue with ${selectedPackageDetails.bids} bids`}
                </button>

                {packageMessage && (
                  <p
                    role="status"
                    className="mt-3 text-center text-xs text-[#1681C5]"
                  >
                    {packageMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS / RULES
        ===================================================== */}

        <section className="border-y border-black/10 bg-black/[0.02]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-[#1681C5]">
                <span className="h-px w-8 bg-[#1681C5]" />

                {language === "am"
                  ? "እንዴት ይሰራል"
                  : "HOW IT WORKS"}
              </div>

              <h2 className="mt-4 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                {language === "am"
                  ? "ደንቦቹን ይረዱ"
                  : "Know the rules."}
              </h2>

              <p className="mt-4 text-sm leading-6 text-black/45">
                {language === "am"
                  ? "Mella የጨረታ ሂደቱ ግልጽና ለመረዳት ቀላል ሆኖ ተዘጋጅቷል።"
                  : "Mella is designed to keep the auction process transparent and easy to understand."}
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <RuleCard
                number="01"
                icon={<Gavel size={19} />}
                title={
                  language === "am"
                    ? "መጫረቻዎን ያስገቡ"
                    : "Place your bid"
                }
                description={
                  language === "am"
                    ? "የሚፈልጉትን መጠን ይምረጡና መጫረቻዎን ከጨረታው ጊዜ ከማለቁ በፊት ያስገቡ።"
                    : "Choose your amount and submit your bid before the auction closes."
                }
              />

              <RuleCard
                number="02"
                icon={<Users size={19} />}
                title={
                  language === "am"
                    ? "ከሌሎች ጋር ይወዳደሩ"
                    : "Compete strategically"
                }
                description={
                  language === "am"
                    ? "ሌሎች ተሳታፊዎችም የራሳቸውን ስትራቴጂ በመጠቀም ይሳተፋሉ።"
                    : "Other participants are competing using their own bidding strategies."
                }
              />

              <RuleCard
                number="03"
                icon={<ShieldCheck size={19} />}
                title={
                  language === "am"
                    ? "ውጤቱን ይመልከቱ"
                    : "See the result"
                }
                description={
                  language === "am"
                    ? "ጨረታው ሲያበቃ የአሸናፊው አመራረጥ ሂደት እና ውጤቱ ይፋ ይደረጋል።"
                    : "When the auction closes, the winning logic and result are published."
                }
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            TRUST SECTION
        ===================================================== */}

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-20">
          <div className="grid gap-5 md:grid-cols-3">
            <TrustCard
              icon={<ShieldCheck size={20} />}
              title={
                language === "am"
                  ? "ግልጽ ሂደት"
                  : "Transparent process"
              }
              description={
                language === "am"
                  ? "የጨረታ ደንቦች እና ውጤቶች በግልጽ ይታያሉ።"
                  : "Auction rules and results are presented clearly."
              }
            />

            <TrustCard
              icon={<CheckCircle2 size={20} />}
              title={
                language === "am"
                  ? "አስተማማኝ ክፍያ"
                  : "Secure payments"
              }
              description={
                language === "am"
                  ? "የክፍያ ሂደቱ ተጠቃሚዎች ምቹ ነው።"
                  : "The payment process is convenient for users."
              }
            />

            <TrustCard
              icon={<Sparkles size={20} />}
              title={
                language === "am"
                  ? "ልዩ የጨረታ ልምድ"
                  : "A different auction experience"
              }
              description={
                language === "am"
                  ? "Mella ከተለመዱት የጨረታ ስርዓቶች የተለየ ስትራቴጂያዊ ልምድ ያቀርባል።"
                  : "Mella offers a strategic experience different from traditional auctions."
              }
            />
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
    <div className="min-w-0 rounded-xl border border-black/10 bg-white p-2.5 sm:p-3">
      <div className="flex min-w-0 items-center gap-1.5 text-black/35 sm:gap-2">
        {icon}

        <span className="truncate text-[8px] font-bold uppercase tracking-[0.06em] sm:text-[9px] sm:tracking-[0.08em]">
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
   RULE CARD
============================================================= */

function RuleCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
          {icon}
        </div>

        <span className="font-mono text-xs text-black/20">
          {number}
        </span>
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

/* =============================================================
   TRUST CARD
============================================================= */

function TrustCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-6">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F78000]/10 text-[#F78000]">
        {icon}
      </div>

      <h3 className="mt-5 text-base font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-black/40">
        {description}
      </p>
    </div>
  );
}