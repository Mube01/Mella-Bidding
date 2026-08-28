"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import AuctionCard from "./AuctionCard";
import type { Auction } from "./data";
import LoadingSpinner from "./ui/LoadingSpinner";
import { useLanguage } from "../context/LanguageContext";

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-3 text-[10px] font-bold tracking-[0.28em] text-[#1681C5]">
      <span className="h-px w-8 bg-violet-400" />
      {children}
    </div>
  );
}

export default function Auctions() {
  const { t, language } = useLanguage();

  const cardsPerSlide = 3;
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBid, setEditingBid] = useState(false);
  const totalSlides = Math.ceil(auctions.length / cardsPerSlide);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch(`/api/auctions?lang=${language}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAuctions(data.auctions.map((auction: any) => ({
            id: auction.id,
            title: auction.title,
            subtitle: auction.subtitle,
            description: auction.description,
            category: auction.category,
            image: auction.image,
            time: "",
            endsAt: auction.endsAt,
            participants: auction.participantCount,
            entry: `${auction.entryCost} ETB`,
          })));
        }
      })
      .catch(() => setAuctions([]))
      .finally(() => setLoading(false));
  }, [language]);

  // Automatic slide
  useEffect(() => {
    if (totalSlides <= 1 || editingBid) return;

    const interval = setInterval(() => {
      setCurrentSlide((current) =>
        current === totalSlides - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides, editingBid]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section
      id="auctions"
      className="mx-auto max-w-7xl px-6 py-24 lg:px-10"
    >
      {/* HEADER */}
      <div>
        <SectionLabel>
          {t("liveNow")}
        </SectionLabel>

        <h2 className="font-display text-5xl tracking-[-0.03em] sm:text-6xl">
          {t("auctionsWorthWatching")}
        </h2>
      </div>

      {/* SLIDER */}
      <div className="mt-12 overflow-hidden">
        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => {
            const slideAuctions = auctions.slice(
              slideIndex * cardsPerSlide,
              slideIndex * cardsPerSlide + cardsPerSlide
            );

            return (
              <div
                key={slideIndex}
                className="min-w-full"
              >
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {slideAuctions.map((auction) => (
                    <AuctionCard
                      key={auction.id}
                      auction={auction}
                      onPriceFocus={() => setEditingBid(true)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* SLIDE INDICATORS */}
      {totalSlides > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to auction slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-[#1681C5]"
                  : "w-2 bg-black/15 hover:bg-[#1681C5]/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* VIEW ALL AUCTIONS */}
      <div className="mt-10 flex justify-center">
        <a
          href="/auctions"
          className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-[#FFB15C] via-[#F78000] to-[#C85F00] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#F78000]/25 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#F78000]/30"
        >
          {t("viewAllAuctions")}

          <ArrowRight
            size={17}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>
      </div>
    </section>
  );
}