"use client";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import FeaturedAuction from "./FeaturedAuction";
import LoadingSpinner from "./ui/LoadingSpinner";
import type { Auction } from "./data";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState } from "react";

export default function Hero() {
  const { language, t } = useLanguage();
  const [featuredAuction, setFeaturedAuction] = useState<Auction | null>(null);

  useEffect(() => {
    setFeaturedAuction(null);
    fetch(`/api/auctions?featured=true&lang=${language}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        const auction = data.auctions?.[0];
        if (!data.success || !auction) return;
        setFeaturedAuction({
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
        });
      })
      .catch(() => undefined);
  }, [language]);

  return (
    <section className="relative min-h-[760px] overflow-hidden border-b border-black/10 pt-[120px]">
      <div className="hero-grid absolute inset-0 opacity-60" />

      {/* Colorful background lights */}
      <div className="absolute -left-40 top-40 h-[420px] w-[420px] rounded-full bg-violet-400/15 blur-[120px]" />

      <div className="absolute right-[-10%] top-28 h-[620px] w-[620px] rounded-full bg-cyan-400/10 blur-[120px]" />

      <div className="absolute bottom-[-15%] left-[35%] h-[400px] w-[400px] rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1fr_1.05fr] lg:px-10 lg:py-28">
        <div>

          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-mella-green">
            <Sparkles size={13} />

            {t("aNewWayToWin")}
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl font-display text-6xl leading-[0.92] tracking-[-0.04em] sm:text-7xl lg:text-[92px]">
            {language === "en" ? (
              <>
                Bid smart.
                <br />

                <span className="bg-gradient-to-r from-[#42A5E8] via-[#1681C5] to-[#0D5E96] bg-clip-text text-transparent">
                  Win more.
                </span>
              </>
            ) : (
              <>
                በብልሃት
                <br />

                <span className="bg-gradient-to-r from-[#42A5E8] via-[#1681C5] to-[#0D5E96] bg-clip-text text-transparent">
                  የበለጠ ያሸንፉ
                </span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-xl text-base leading-7 text-black/55 sm:text-lg">
            {t("heroDescription")}
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#auctions"
              className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-[#FFB15C] via-[#F78000] to-[#C85F00] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#F78000]/20 transition hover:-translate-y-0.5 hover:shadow-2xl"
            >
              {t("exploreAuctions")}

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <a
              href="#how"
              className="rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-semibold text-black/65 transition hover:border-violet-300 hover:text-[#1681C5]"
            >
              {t("howItWorks")}
            </a>
          </div>

          {/* Stats */}
          <div className="mt-14 flex gap-10 border-t border-black/10 pt-7">
            
            {/* Transparency */}
            <div>
              <p className="text-2xl font-bold text-[#1681C5]">
                100%
              </p>

              <p className="mt-1 text-[10px] tracking-[0.18em] text-black/40">
                {t("transparent")}
              </p>
            </div>

            {/* Local Payments */}
            <div>
              <p className="text-2xl font-bold text-[#1681C5]">
                ETB
              </p>

              <p className="mt-1 text-[10px] tracking-[0.18em] text-black/40">
                {t("localPayments")}
              </p>
            </div>

            {/* Auctions */}
            <div>
              <p className="text-2xl font-bold text-[#1681C5]">
                24/7
              </p>

              <p className="mt-1 text-[10px] tracking-[0.18em] text-black/40">
                {t("auctions247")}
              </p>
            </div>

          </div>
        </div>

        {featuredAuction ? (
          <FeaturedAuction auction={featuredAuction} />
        ) : (
          <div className="relative flex aspect-[4/5.5] items-center justify-center overflow-hidden rounded-[1.8rem] border border-black/10 bg-black/[0.02] sm:aspect-[4/4.3]">
            <LoadingSpinner size="lg" />
          </div>
        )}
      </div>
    </section>
  );
}