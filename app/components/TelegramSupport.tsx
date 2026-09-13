"use client";

import { FaTelegramPlane } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

export default function TelegramSupport() {
  const { language } = useLanguage();

  const supportText =
    language === "am" ? "የ Telegram ድጋፍ" : "Telegram Support";

  return (
    <a
      href="https://t.me/yourmella"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        language === "am"
          ? "የMELLA Telegram ድጋፍ"
          : "Contact Mella Support on Telegram"
      }
      className="
        group fixed bottom-8 right-8 z-[999]
        flex items-center
        transition-all duration-300
      "
    >
      {/* Hover text */}
      <span
        className="
          mr-2 max-w-0 overflow-hidden whitespace-nowrap
          rounded-full bg-white px-0 py-2
          text-sm font-semibold text-[#1681C5]
          opacity-0
          shadow-[0_8px_30px_rgba(0,0,0,0.20)]
          transition-all duration-300
          group-hover:max-w-[170px]
          group-hover:px-4
          group-hover:opacity-100
        "
      >
        {supportText}
      </span>

      {/* Telegram button */}
      <div
        className="
          flex h-14 w-14 items-center justify-center
          rounded-full bg-[#1681C5]
          text-white
          shadow-[0_10px_35px_rgba(22,129,197,0.45),0_6px_18px_rgba(0,0,0,0.25)]
          ring-4 ring-white/80
          transition-all duration-300
          group-hover:scale-110
          group-hover:bg-[#0f73aa]
          group-hover:shadow-[0_14px_45px_rgba(22,129,197,0.60),0_8px_25px_rgba(0,0,0,0.30)]
        "
      >
        <FaTelegramPlane
          size={25}
          className="
            transition-transform duration-300
            group-hover:-translate-y-0.5
          "
        />
      </div>
    </a>
  );
}