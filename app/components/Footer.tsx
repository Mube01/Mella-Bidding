"use client";

import PaymentPartners from "./PaymentPartners";
import { useLanguage } from "../context/LanguageContext";
import Image from "next/image";
import { FaTelegramPlane, FaFacebookF, FaTiktok } from "react-icons/fa";

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
              <Image
                src="/images/mella2.png"
                alt="Mella"
                width={140}
                height={50}
                className="h-auto w-[140px] object-contain"
              />
            </div>

            <p className="mt-2 text-sm text-black/35">
              {t("footerTagline")}
            </p>

            {/* PAYMENT PARTNERS */}
            <PaymentPartners />

            {/* SOCIAL MEDIA */}
            <div className="mt-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
                {t("followUs") || "Follow us"}
              </p>

              <div className="flex items-center gap-3">
                {/* TELEGRAM */}
                <a
                  href="https://t.me/yourmella"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#1681C5] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#1681C5]/30 hover:bg-[#1681C5] hover:text-white hover:shadow-md"
                >
                  <FaTelegramPlane className="text-[18px] transition-transform duration-200 group-hover:scale-110" />
                </a>

                {/* FACEBOOK */}
                <a
                  href="https://facebook.com/yourmella"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#1681C5] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#1681C5]/30 hover:bg-[#1681C5] hover:text-white hover:shadow-md"
                >
                  <FaFacebookF className="text-[17px] transition-transform duration-200 group-hover:scale-110" />
                </a>

                {/* TIKTOK */}
                <a
                  href="https://www.tiktok.com/@yourmella"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#1681C5] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#1681C5]/30 hover:bg-[#1681C5] hover:text-white hover:shadow-md"
                >
                  <FaTiktok className="text-[17px] transition-transform duration-200 group-hover:scale-110" />
                </a>
              </div>
            </div>
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
              href="/terms"
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