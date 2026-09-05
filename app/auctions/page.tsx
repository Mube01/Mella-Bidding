"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AuctionCard from "../components/AuctionCard";
import BidConfirmationModal from "../components/BidConfirmationModal";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import type { Auction } from "../components/data";
import { useLanguage } from "../context/LanguageContext";

export default function AuctionsPage() {
  const { t, language } = useLanguage();

  /* =========================================================
     AUCTION DATA
  ========================================================= */

  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     BID MODAL STATE
  ========================================================= */

  const [selectedAuction, setSelectedAuction] =
    useState<Auction | null>(null);

  const [selectedBidAmount, setSelectedBidAmount] =
    useState(1);

  const [showBidModal, setShowBidModal] =
    useState(false);

  const [bidLoading, setBidLoading] =
    useState(false);

  const [bidMessage, setBidMessage] =
    useState("");

  /* =========================================================
     SUCCESS STATE
  ========================================================= */

  const [successAuctionId, setSuccessAuctionId] =
    useState<string | number | null>(null);

  /* =========================================================
     FETCH AUCTIONS
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchAuctions = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/auctions?lang=${language}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (!data.success) {
          setAuctions([]);
          return;
        }

        setAuctions(
          data.auctions.map((auction: any) => ({
            id: auction.id,
            title: auction.title,
            subtitle: auction.subtitle,
            description: auction.description,
            category: auction.category,
            image: auction.image,
            time: "",
            endsAt: auction.endsAt,
            participants: auction.participantCount,
            entry: `${auction.entryCost} ${t("currency")}`,
          }))
        );
      } catch {
        if (!cancelled) {
          setAuctions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAuctions();

    return () => {
      cancelled = true;
    };
  }, [language]);

  /* =========================================================
     FILTERED AUCTIONS
  ========================================================= */

  const filteredAuctions = useMemo(() => {
    return auctions.filter((auction) => {
      const matchesCategory =
        category === "all" ||
        auction.category.toLowerCase() ===
          category.toLowerCase();

      const searchTerm = search.toLowerCase();

      const matchesSearch =
        auction.title
          .toLowerCase()
          .includes(searchTerm) ||
        auction.subtitle
          .toLowerCase()
          .includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [auctions, category, search]);

  /* =========================================================
     CATEGORIES
  ========================================================= */

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

  /* =========================================================
     OPEN BID CONFIRMATION MODAL
  ========================================================= */

  const handleBidRequest = (
    auction: Auction,
    bidAmount: number
  ) => {
    setSelectedAuction(auction);
    setSelectedBidAmount(bidAmount);
    setBidMessage("");
    setShowBidModal(true);
  };

  /* =========================================================
     CLOSE BID MODAL
  ========================================================= */

  const closeBidModal = () => {
    if (bidLoading) {
      return;
    }

    setShowBidModal(false);
    setSelectedAuction(null);
    setSelectedBidAmount(1);
    setBidMessage("");
  };

  /* =========================================================
     CONFIRM BID
  ========================================================= */

  const confirmBid = async () => {
    if (!selectedAuction) {
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
          auctionId: selectedAuction.id,
          amount: selectedBidAmount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const auctionId = selectedAuction.id;

        setShowBidModal(false);
        setSelectedAuction(null);
        setSelectedBidAmount(1);

        setSuccessAuctionId(auctionId);

        window.setTimeout(() => {
          setSuccessAuctionId((current) =>
            current === auctionId ? null : current
          );
        }, 3000);

        return;
      }

      setBidMessage(
        data.error ||
          (language === "am"
            ? "መጫረቻውን መላክ አልተቻለም።"
            : "Unable to submit bid.")
      );
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

  /* =========================================================
     SERVICE FEE
  ========================================================= */

  const selectedServiceFee = selectedAuction
    ? parseFloat(selectedAuction.entry) || 0
    : 0;

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <div className="pt-[120px]">
        {/* =================================================
            HERO
        ================================================= */}

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

        {/* =================================================
            AUCTION CONTENT
        ================================================= */}

        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          {/* =================================================
              FILTER BAR
          ================================================= */}

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

          {/* =================================================
              RESULTS HEADER
          ================================================= */}

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

          {/* =================================================
              AUCTION GRID
          ================================================= */}

          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredAuctions.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAuctions.map((auction) => (
                <div key={auction.id}>
                  <AuctionCard
                    auction={auction}
                    onBidRequest={handleBidRequest}
                  />

                  {/* =================================================
                      SUCCESS MESSAGE
                  ================================================= */}

                  {successAuctionId === auction.id && (
                    <div className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-50 px-4 text-sm font-bold text-green-700 shadow-md">
                      <span>✓</span>

                      {language === "am"
                        ? "መጫረቻ በተሳካ ሁኔታ ተልኳል"
                        : "Bid submitted successfully"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* =================================================
               EMPTY STATE
            ================================================= */

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

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <Footer />
      </div>

      {/* =======================================================
          PAGE-LEVEL BID CONFIRMATION MODAL

          IMPORTANT:
          This is outside the auction grid and outside every
          AuctionCard. There is only ONE modal for the page.
      ======================================================= */}

      <BidConfirmationModal
        isOpen={showBidModal && selectedAuction !== null}
        auctionTitle={selectedAuction?.title ?? ""}
        bidAmount={selectedBidAmount}
        serviceFee={selectedServiceFee}
        onConfirm={confirmBid}
        onCancel={closeBidModal}
        isLoading={bidLoading}
      />

      {/* =======================================================
          BID ERROR

          This appears if the API rejects the bid while the
          confirmation modal is open.
      ======================================================= */}

      {bidMessage && showBidModal && (
        <div className="fixed bottom-6 left-1/2 z-[10000] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-xs font-medium text-red-600 shadow-xl">
          {bidMessage}
        </div>
      )}
    </main>
  );
}