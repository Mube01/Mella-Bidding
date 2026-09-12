"use client";

import { FaTelegramPlane } from "react-icons/fa";

export default function TelegramSupport() {
  return (
    <a
      href="https://t.me/yourmella"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Mella Support on Telegram"
      className="
        group fixed bottom-5 right-5 z-[999]
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
          shadow-lg opacity-0
          transition-all duration-300
          group-hover:max-w-[150px]
          group-hover:px-4
          group-hover:opacity-100
        "
      >
        Telegram Support
      </span>

      {/* Telegram button */}
      <div
        className="
          flex h-14 w-14 items-center justify-center
          rounded-full bg-[#1681C5]
          text-white shadow-xl
          ring-4 ring-white/80
          transition-all duration-300
          group-hover:scale-110
          group-hover:bg-[#0f73aa]
        "
      >
        <FaTelegramPlane
          size={25}
          className="transition-transform duration-300 group-hover:-translate-y-0.5"
        />
      </div>
    </a>
  );
}