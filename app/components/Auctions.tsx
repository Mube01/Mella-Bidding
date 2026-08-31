"use client";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  /*
   * When the user focuses the price input:
   * - automatic sliding pauses
   * - manual arrows still work
   * - mobile swipe still works
   * - slide indicators still work
   */
  const [editingBid, setEditingBid] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  /*
   * Touch/swipe state
   */
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const isDragging = useRef(false);

  /*
   * ============================================================
   * RESPONSIVE STATE
   * ============================================================
   */

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener(
        "resize",
        checkScreenSize
      );
    };
  }, []);

  /*
   * ============================================================
   * FETCH AUCTIONS
   * ============================================================
   */

  useEffect(() => {
    let cancelled = false;

    setLoading(true);

    fetch(`/api/auctions?lang=${language}`, {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;

        if (data.success) {
          const formattedAuctions: Auction[] =
            data.auctions.map((auction: any) => ({
              id: auction.id,
              title: auction.title,
              subtitle: auction.subtitle,
              description: auction.description,
              category: auction.category,
              image: auction.image,
              time: "",
              endsAt: auction.endsAt,
              participants:
                auction.participantCount,
              entry: `${auction.entryCost} ETB`,
            }));

          setAuctions(formattedAuctions);
        } else {
          setAuctions([]);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAuctions([]);
        }
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
   * ============================================================
   * SLIDE CONFIGURATION
   * ============================================================
   *
   * Desktop:
   * 3 auctions per slide
   *
   * Mobile:
   * 1 auction per slide
   */

  const cardsPerSlide = isMobile ? 1 : 3;

  const totalSlides = Math.ceil(
    auctions.length / cardsPerSlide
  );

  /*
   * Keep current slide valid when the screen changes
   * from mobile to desktop or vice versa.
   */

  useEffect(() => {
    if (totalSlides === 0) {
      setCurrentSlide(0);
      return;
    }

    setCurrentSlide((current) =>
      Math.min(current, totalSlides - 1)
    );
  }, [totalSlides]);

  /*
   * ============================================================
   * NEXT SLIDE
   * ============================================================
   */

  const nextSlide = () => {
    if (totalSlides <= 1) return;

    setCurrentSlide((current) =>
      current >= totalSlides - 1
        ? 0
        : current + 1
    );
  };

  /*
   * ============================================================
   * PREVIOUS SLIDE
   * ============================================================
   */

  const previousSlide = () => {
    if (totalSlides <= 1) return;

    setCurrentSlide((current) =>
      current <= 0
        ? totalSlides - 1
        : current - 1
    );
  };

  /*
   * ============================================================
   * GO TO SLIDE
   * ============================================================
   */

  const goToSlide = (index: number) => {
    if (totalSlides <= 0) return;

    setCurrentSlide(
      Math.max(
        0,
        Math.min(index, totalSlides - 1)
      )
    );
  };

  /*
   * ============================================================
   * AUTOMATIC SLIDING
   * ============================================================
   *
   * IMPORTANT:
   *
   * editingBid pauses ONLY automatic sliding.
   *
   * It does NOT disable:
   * - Previous button
   * - Next button
   * - Mobile swipe
   * - Slide indicators
   */

  useEffect(() => {
    if (
      loading ||
      totalSlides <= 1 ||
      editingBid
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentSlide((current) =>
        current >= totalSlides - 1
          ? 0
          : current + 1
      );
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    loading,
    totalSlides,
    editingBid,
  ]);

  /*
   * ============================================================
   * MOBILE TOUCH START
   * ============================================================
   */

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (!isMobile || totalSlides <= 1) {
      return;
    }

    touchStartX.current =
      event.touches[0]?.clientX ?? null;

    touchCurrentX.current =
      touchStartX.current;

    isDragging.current = true;
  };

  /*
   * ============================================================
   * MOBILE TOUCH MOVE
   * ============================================================
   */

  const handleTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (
      !isMobile ||
      !isDragging.current
    ) {
      return;
    }

    touchCurrentX.current =
      event.touches[0]?.clientX ?? null;
  };

  /*
   * ============================================================
   * MOBILE TOUCH END
   * ============================================================
   */

  const handleTouchEnd = () => {
    if (
      !isMobile ||
      !isDragging.current ||
      touchStartX.current === null ||
      touchCurrentX.current === null
    ) {
      return;
    }

    const distance =
      touchCurrentX.current -
      touchStartX.current;

    const swipeThreshold = 50;

    if (Math.abs(distance) >= swipeThreshold) {
      if (distance < 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    touchStartX.current = null;
    touchCurrentX.current = null;
    isDragging.current = false;
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <section
      id="auctions"
      className="mx-auto w-full max-w-7xl overflow-hidden px-6 py-24 lg:px-10"
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>
        <SectionLabel>
          {t("liveNow")}
        </SectionLabel>

        <h2 className="font-display text-5xl tracking-[-0.03em] sm:text-6xl">
          {t("auctionsWorthWatching")}
        </h2>
      </div>

      {/* ======================================================
          CAROUSEL
      ====================================================== */}

      <div className="relative mt-12 w-full min-w-0">
        {/* ====================================================
            DESKTOP PREVIOUS BUTTON
        ==================================================== */}
{totalSlides > 1 && (
  <button
    type="button"
    onClick={previousSlide}
    aria-label="Previous auctions"
    className="
      absolute
      -left-6
      top-1/2
      z-30
      hidden
      h-11
      w-11
      -translate-y-1/2
      items-center
      justify-center
      rounded-full
      border
      border-black/10
      bg-white/95
      text-black
      shadow-lg
      backdrop-blur-sm
      transition
      hover:-translate-x-1
      hover:border-[#1681C5]/40
      hover:text-[#1681C5]
      lg:flex
    "
  >
    <ArrowLeft size={18} />
  </button>
)}

        {/* ====================================================
            DESKTOP NEXT BUTTON
        ==================================================== */}

       {totalSlides > 1 && (
  <button
    type="button"
    onClick={nextSlide}
    aria-label="Next auctions"
    className="
      absolute
      -right-6
      top-1/2
      z-30
      hidden
      h-11
      w-11
      -translate-y-1/2
      items-center
      justify-center
      rounded-full
      border
      border-black/10
      bg-white/95
      text-black
      shadow-lg
      backdrop-blur-sm
      transition
      hover:translate-x-1
      hover:border-[#1681C5]/40
      hover:text-[#1681C5]
      lg:flex
    "
  >
    <ArrowRight size={18} />
  </button>
)}
        {/* ====================================================
            VIEWPORT

            VERY IMPORTANT:

            overflow-hidden
            w-full
            min-w-0

            This guarantees that the slide track cannot
            visually escape the parent container.
        ==================================================== */}

        <div
          className="
            relative
            w-full
            min-w-0
            overflow-hidden
          "
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {loading ? (
            <div className="flex min-h-[420px] w-full items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : auctions.length === 0 ? (
            <div className="flex min-h-[300px] w-full items-center justify-center rounded-3xl border border-black/10 bg-black/[0.02]">
              <p className="text-sm text-black/40">
                {language === "am"
                  ? "በአሁኑ ጊዜ ጨረታዎች የሉም።"
                  : "No auctions available right now."}
              </p>
            </div>
          ) : (
            /*
             * ==================================================
             * TRACK
             * ==================================================
             *
             * Every slide is EXACTLY 100% of the viewport.
             *
             * min-w-0 is important because it allows the grid
             * to shrink instead of forcing the parent wider.
             */

            <div
              className="
                flex
                w-full
                min-w-0
                transition-transform
                duration-500
                ease-out
                will-change-transform
              "
              style={{
                transform: `translateX(-${
                  currentSlide * 100
                }%)`,
              }}
            >
              {Array.from({
                length: totalSlides,
              }).map((_, slideIndex) => {
                const slideAuctions =
                  auctions.slice(
                    slideIndex * cardsPerSlide,
                    slideIndex * cardsPerSlide +
                      cardsPerSlide
                  );

                return (
                  <div
                    key={slideIndex}
                    className="
                      w-full
                      min-w-full
                      max-w-full
                      shrink-0
                      overflow-hidden
                    "
                  >
                    <div
                      className="
                        grid
                        w-full
                        min-w-0
                        max-w-full
                        grid-cols-1
                        gap-5
                        md:grid-cols-2
                        lg:grid-cols-3
                      "
                    >
                      {slideAuctions.map(
                        (auction) => (
                          <div
                            key={auction.id}
                            className="
                              min-w-0
                              max-w-full
                              overflow-hidden
                            "
                          >
                            <AuctionCard
                              auction={auction}
                              onPriceFocus={() =>
                                setEditingBid(true)
                              }
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          MOBILE SWIPE HINT
      ====================================================== */}

      {isMobile &&
        totalSlides > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.08em] text-black/30">
            <ArrowLeft size={12} />

            <span>
              {language === "am"
                ? "ለማየት ይንሸራተቱ"
                : "SWIPE TO EXPLORE"}
            </span>

            <ArrowRight size={12} />
          </div>
        )}

      {/* ======================================================
          SLIDE INDICATORS
      ====================================================== */}

      {totalSlides > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({
            length: totalSlides,
          }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to auction slide ${
                index + 1
              }`}
              aria-current={
                currentSlide === index
                  ? "true"
                  : undefined
              }
              className={`
                h-2
                rounded-full
                transition-all
                duration-300
                ${
                  currentSlide === index
                    ? "w-8 bg-[#1681C5]"
                    : "w-2 bg-black/15 hover:bg-[#1681C5]/50"
                }
              `}
            />
          ))}
        </div>
      )}

      {/* ======================================================
          BID EDITING STATUS
      ====================================================== */}

      {editingBid && (
        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.08em] text-[#1681C5]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1681C5]" />

          {language === "am"
            ? "ራስ-ሰር መንሸራተት ቆሟል"
            : "AUTO-SCROLL PAUSED"}
        </div>
      )}

      {/* ======================================================
          VIEW ALL AUCTIONS
      ====================================================== */}

      <div className="mt-10 flex justify-center">
        <a
          href="/auctions"
          className="
            group
            flex
            items-center
            gap-3
            rounded-full
            bg-gradient-to-r
            from-[#FFB15C]
            via-[#F78000]
            to-[#C85F00]
            px-8
            py-4
            text-sm
            font-bold
            text-white
            shadow-xl
            shadow-[#F78000]/25
            transition
            duration-300
            hover:-translate-y-1
            hover:shadow-2xl
            hover:shadow-[#F78000]/30
          "
        >
          {t("viewAllAuctions")}

          <ArrowRight
            size={17}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </a>
      </div>
    </section>
  );
}