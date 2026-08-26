"use client";

import {
  Eye,
  Heart,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-[120px]">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-black/10">
          <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-[#F78000]/10 blur-[130px]" />

          <div className="absolute right-[-10%] top-10 h-[500px] w-[500px] rounded-full bg-[#1681C5]/10 blur-[130px]" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.28em] text-[#F78000]">
                <span className="h-px w-8 bg-[#F78000]" />
                {t("about")}
              </div>

              <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                {t("newAuctionTitle")}
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-black/50 sm:text-lg">
                {t("newAuctionDescription")}
              </p>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-[#1681C5]">
                MELLA
              </p>

              <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-0.04em] sm:text-6xl">
                {t("bidSmart")}
                <br />
                {t("winMore")}
              </h2>

              <p className="mt-7 max-w-xl text-base leading-7 text-black/50">
                {t("heroDescription")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ValueCard
                icon={<Eye size={20} />}
                title={t("fairPlayTitle")}
                description={t("fairPlayDescription")}
              />

              <ValueCard
                icon={<ShieldCheck size={20} />}
                title={t("trustFirstTitle")}
                description={t("trustFirstDescription")}
              />

              <ValueCard
                icon={<Sparkles size={20} />}
                title={t("newAuctionTitle")}
                description={t("newAuctionDescription")}
              />

              <ValueCard
                icon={<Heart size={20} />}
                title={t("localPayments")}
                description={t("heroDescription")}
              />
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="border-y border-black/10 bg-black/[0.02]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold tracking-[0.25em] text-[#F78000]">
                {t("trustFirst")}
              </p>

              <h2 className="mt-5 font-display text-4xl tracking-[-0.04em] sm:text-6xl">
                {t("howMellaWorks")}
              </h2>

              <p className="mt-5 text-base leading-7 text-black/50">
                {t("howMellaDescription")}
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              <ValueLarge
                icon={<Target size={21} />}
                title={t("fairPlayTitle")}
                description={t("fairPlayDescription")}
              />

              <ValueLarge
                icon={<Users size={21} />}
                title={t("trustFirstTitle")}
                description={t("trustFirstDescription")}
              />

              <ValueLarge
                icon={<Sparkles size={21} />}
                title={t("newAuctionTitle")}
                description={t("newAuctionDescription")}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm sm:p-12 lg:p-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-bold tracking-[0.25em] text-[#1681C5]">
                  MELLA
                </p>

                <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] sm:text-5xl">
                  {t("findYourNextWin")}
                </h2>

                <p className="mt-4 text-sm leading-6 text-black/45">
                  {t("auctionsPageDescription")}
                </p>
              </div>

              <Link
                href="/auctions"
                className="w-fit rounded-full bg-[#F78000] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#D96E00]"
              >
                {t("exploreAuctions")}
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

function ValueCard({
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
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
        {icon}
      </div>

      <h3 className="mt-6 text-sm font-bold">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-black/40">
        {description}
      </p>
    </div>
  );
}

function ValueLarge({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-8">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F78000]/10 text-[#F78000]">
        {icon}
      </div>

      <h3 className="mt-8 font-display text-2xl tracking-[-0.03em]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-black/45">
        {description}
      </p>
    </div>
  );
}