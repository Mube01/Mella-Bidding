"use client";

import {
  Gavel,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

const cards = [
  {
    icon: Trophy,
    title: "fairPlayTitle",
    description: "fairPlayDescription",
    className:
      "border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50",
    iconClass: "text-violet-600",
  },
  {
    icon: ShieldCheck,
    title: "trustFirstTitle",
    description: "trustFirstDescription",
    className:
      "border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50",
    iconClass: "text-blue-600",
  },
  {
    icon: Gavel,
    title: "newAuctionTitle",
    description: "newAuctionDescription",
    className:
      "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50",
    iconClass: "text-orange-600",
  },
];

export default function TrustSection() {
  const { t } = useLanguage();

  return (
    <section
      id="results"
      className="mx-auto max-w-7xl px-6 py-24 lg:px-10"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`rounded-2xl border p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${card.className}`}
            >
              <Icon
                size={27}
                className={card.iconClass}
              />

              <h3 className="mt-8 font-display text-3xl">
                {t(card.title)}
              </h3>

              <p className="mt-4 text-sm leading-6 text-black/45">
                {t(card.description)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}