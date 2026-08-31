"use client";

import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Search,
  ShieldCheck,
  Trophy,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";

export default function HowItWorksPage() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      icon: Search,
      title: t("chooseAuction"),
      description: t("chooseAuctionDescription"),
    },
    {
      number: "02",
      icon: Wallet,
      title: t("getYourBids"),
      description: t("getYourBidsDescription"),
    },
    {
      number: "03",
      icon: Trophy,
      title: t("seeTheResult"),
      description: t("seeTheResultDescription"),
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="pt-[120px]">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-black/10">
          <div className="absolute -left-40 top-10 h-[450px] w-[450px] rounded-full bg-violet-400/10 blur-[130px]" />

          <div className="absolute right-[-10%] top-0 h-[500px] w-[500px] rounded-full bg-[#1681C5]/10 blur-[130px]" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.28em] text-[#1681C5]">
                <span className="h-px w-8 bg-[#1681C5]" />
                {t("howMellaWorks")}
              </div>

              <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                {t("simpleEnough")}
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-black/50 sm:text-lg">
                {t("howMellaDescription")}
              </p>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative rounded-3xl border border-black/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
                      <Icon size={20} />
                    </div>

                    <span className="font-mono text-xs text-black/20">
                      {step.number}
                    </span>
                  </div>

                  <h2 className="mt-8 font-display text-2xl tracking-[-0.03em]">
                    {step.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-black/45">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAIR PLAY */}
        <section className="border-y border-black/10 bg-black/[0.02]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-[#F78000]">
                  <span className="h-px w-8 bg-[#F78000]" />
                  {t("transparent")}
                </div>

                <h2 className="mt-5 font-display text-4xl tracking-[-0.04em] sm:text-6xl">
                  {t("fairPlayTitle")}
                </h2>

                <p className="mt-6 max-w-xl text-base leading-7 text-black/50">
                  {t("fairPlayDescription")}
                </p>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
                <div className="flex gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F78000]/10 text-[#F78000]">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {t("trustFirstTitle")}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-black/45">
                      {t("trustFirstDescription")}
                    </p>
                  </div>
                </div>

                <div className="my-7 h-px bg-black/10" />

                <div className="space-y-4">
                  {[
                    t("transparent"),
                    t("localPayments"),
                    t("securePayments"),
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm font-medium"
                    >
                      <CheckCircle2
                        size={17}
                        className="text-[#1681C5]"
                      />

                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="overflow-hidden rounded-[2rem] bg-[#1681C5] px-7 py-14 text-white sm:px-12 lg:px-16">
            <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] text-white/60">
                  MELLA
                </p>

                <h2 className="mt-4 font-display text-4xl tracking-[-0.04em] sm:text-5xl">
                  {t("findYourNextWin")}
                </h2>
              </div>

              <Link
                href="/auctions"
                className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#F78000] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#D96E00]"
              >
                {t("exploreAuctions")}

                <ArrowRight
                  size={16}
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