"use client";

import { useLanguage } from "../context/LanguageContext";

const steps = [
  {
    number: "01",
    title: "chooseAuction",
    description: "chooseAuctionDescription",
    color: "violet",
  },
  {
    number: "02",
    title: "getYourBids",
    description: "getYourBidsDescription",
    color: "blue",
  },
  {
    number: "03",
    title: "seeTheResult",
    description: "seeTheResultDescription",
    color: "emerald",
  },
] as const;

const colors = {
  violet:
    "border-violet-200 hover:border-violet-400 hover:bg-violet-50",
  blue:
    "border-blue-200 hover:border-blue-400 hover:bg-blue-50",
  orange:
    "border-orange-200 hover:border-orange-400 hover:bg-orange-50",
  emerald:
    "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50",
} as const;

const numberColors = {
  violet: "text-violet-600",
  blue: "text-blue-600",
  orange: "text-orange-600",
  emerald: "text-emerald-600",
} as const;

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section
      id="how"
      className="border-y border-black/10 bg-gradient-to-br from-violet-50 via-white to-blue-50"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        {/* SECTION LABEL */}
        <div className="mb-5 flex items-center gap-3 text-[10px] font-bold tracking-[0.28em] text-[#1681C5]">
          <span className="h-px w-8 bg-violet-400" />
          {t("howMellaWorks")}
        </div>

        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT SIDE */}
          <div>
            <h2 className="font-display text-5xl leading-[1] tracking-[-0.03em] sm:text-6xl">
              {t("simpleEnough")}
            </h2>

            <p className="mt-6 max-w-lg leading-7 text-black/45">
              {t("howMellaDescription")}
            </p>
          </div>

          {/* STEPS */}
          <div className="grid gap-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex gap-6 rounded-2xl border bg-white/70 p-6 transition ${
                  colors[step.color]
                }`}
              >
                {/* NUMBER */}
                <span
                  className={`font-mono text-xs font-bold ${
                    numberColors[step.color]
                  }`}
                >
                  {step.number}
                </span>

                {/* TEXT */}
                <div>
                  <h3 className="text-lg font-semibold">
                    {t(step.title)}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-black/40">
                    {t(step.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}