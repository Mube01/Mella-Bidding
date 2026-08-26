"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import PartnerBar from "./PartnerBar";
import { useLanguage } from "../context/LanguageContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-mella-green backdrop-blur-xl">
      <PartnerBar />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* LOGO */}
        <a
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-3xl font-display tracking-[0.1em] text-white">
            MELLA
          </span>
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-9 text-sm text-white/60 md:flex">
          <a
            href="/auctions"
            className="font-medium transition hover:text-white"
          >
            {t("auctions")}
          </a>

          <a
            href="/how"
            className="transition hover:text-white"
          >
            {t("howItWorks")}
          </a>

          <a
            href="/results"
            className="transition hover:text-white"
          >
            {t("results")}
          </a>

          <a
            href="/about"
            className="transition hover:text-white"
          >
            {t("about")}
          </a>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">

          {/* DESKTOP LANGUAGE SWITCHER */}
          <div className="hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                language === "en"
                  ? "bg-white text-mella-green"
                  : "text-white/50 hover:text-white"
              }`}
            >
              EN
            </button>

            <span className="text-white/30">/</span>

            <button
              type="button"
              onClick={() => setLanguage("am")}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                language === "am"
                  ? "bg-white text-mella-green"
                  : "text-white/50 hover:text-white"
              }`}
            >
              አማ
            </button>
          </div>

          {/* LOGIN */}
          <a
            href="/login"
            className="hidden px-4 py-2 text-sm text-white/60 transition hover:text-white sm:block"
          >
            {t("login")}
          </a>

          {/* START BIDDING */}
          <a
            href="/register"
            className="rounded-full bg-[#F78000] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            {t("startBidding")}
          </a>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-white md:hidden"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <div
        className={`overflow-hidden border-t border-white/10 transition-all duration-300 md:hidden ${
          menuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-mella-green px-6 py-4">

          {/* AUCTIONS */}
          <a
            href="/auctions"
            onClick={() => setMenuOpen(false)}
            className="block border-b border-white/10 py-4 text-sm text-white/70 transition hover:text-white"
          >
            {t("auctions")}
          </a>

          {/* HOW IT WORKS */}
          <a
            href="/how"
            onClick={() => setMenuOpen(false)}
            className="block border-b border-white/10 py-4 text-sm text-white/70 transition hover:text-white"
          >
            {t("howItWorks")}
          </a>

          {/* RESULTS */}
          <a
            href="/results"
            onClick={() => setMenuOpen(false)}
            className="block border-b border-white/10 py-4 text-sm text-white/70 transition hover:text-white"
          >
            {t("results")}
          </a>

          {/* ABOUT */}
          <a
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="block py-4 text-sm text-white/70 transition hover:text-white"
          >
            {t("about")}
          </a>

          {/* MOBILE LANGUAGE SWITCHER */}
          <div className="mt-3 flex items-center justify-center gap-2 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition ${
                language === "en"
                  ? "bg-white text-mella-green"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              English
            </button>

            <button
              type="button"
              onClick={() => setLanguage("am")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition ${
                language === "am"
                  ? "bg-white text-mella-green"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              አማርኛ
            </button>
          </div>

        </nav>
      </div>
    </header>
  );
}