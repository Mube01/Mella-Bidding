"use client";

import PaymentPartners from "./PaymentPartners";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      id="about"
      className="border-t border-black/10 bg-gradient-to-br from-white via-violet-50/40 to-blue-50/40"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-start">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <p className="font-brand text-4xl">
                MELLA
              </p>
            </div>

            <p className="mt-2 text-sm text-black/35">
              {t("footerTagline")}
            </p>

            <PaymentPartners />
          </div>

          {/* LINKS */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-black/45">
            <a
              href="/auctions"
              className="transition hover:text-[#1681C5]"
            >
              {t("auctions")}
            </a>

            <a
              href="/how"
              className="transition hover:text-[#1681C5]"
            >
              {t("howItWorks")}
            </a>

            <a
              href="/results"
              className="transition hover:text-[#1681C5]"
            >
              {t("results")}
            </a>

            <a
              href="/"
              className="transition hover:text-[#1681C5]"
            >
              {t("terms")}
            </a>

          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-12 border-t border-black/10 pt-6 text-xs text-black/25">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}