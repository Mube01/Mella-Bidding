"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface AuthShellProps {
  children: ReactNode;
  admin?: boolean;
}

export default function AuthShell({
  children,
  admin = false,
}: AuthShellProps) {
  const { language } = useLanguage();

  const isAmharic = language === "am";

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px]">

        {/* =====================================================
            LEFT BRAND PANEL
        ===================================================== */}

        <div className="relative hidden w-1/2 overflow-hidden bg-[#1681C5] lg:flex">

          {/* Orange glow */}
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#F78000]/20 blur-3xl" />

          {/* Orange accent */}
          <div className="absolute bottom-20 right-20 h-24 w-24 rounded-full border border-[#F78000]/30" />

          {/* Blue / white glow */}
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />

          {/* Decorative lines */}
          <div className="absolute right-0 top-1/2 h-px w-40 bg-[#F78000]/40" />

          <div className="absolute right-0 top-[calc(50%+18px)] h-px w-24 bg-white/10" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              href="/"
              className="font-display text-3xl tracking-[-0.04em] text-white transition hover:text-[#F78000]"
            >
              MELLA
            </Link>

            {/* =================================================
                HERO
            ================================================= */}

            <div>

              {/* LABEL */}

              <p
                className={`text-[10px] font-bold text-[#F78000] ${
                  isAmharic
                    ? "font-sans tracking-[0.12em]"
                    : "tracking-[0.3em]"
                }`}
              >
                {admin
                  ? isAmharic
                    ? "አስተዳደር"
                    : "ADMINISTRATION"
                  : "MELLA"}
              </p>

              {/* HEADING */}

              <h1
                className={`mt-4 max-w-xl text-6xl leading-[0.95] text-white xl:text-7xl ${
                  isAmharic
                    ? "font-sans tracking-normal"
                    : "font-display tracking-[-0.05em]"
                }`}
              >
                {admin
                  ? isAmharic
                    ? "ሁሉንም ነገር በቁጥጥር ስር ያድርጉ።"
                    : "Everything under control."
                  : isAmharic
                    ? "ዕድልዎ። ድልዎ።"
                    : "Your chance. Your win."}
              </h1>

              {/* DESCRIPTION */}

              <p
                className={`mt-6 max-w-md text-sm leading-6 text-white/65 ${
                  isAmharic ? "font-sans" : ""
                }`}
              >
                {admin
                  ? isAmharic
                    ? "ጨረታዎችን፣ ተሳታፊዎችን፣ መጫረቻዎችን እና ግብይቶችን ከአንድ ደህንነታማ ቦታ ያስተዳድሩ።"
                    : "Manage auctions, participants, bids and transactions from one secure place."
                  : isAmharic
                    ? "በአስደሳች የሜላ ጨረታዎች ይሳተፉ እና ሊያሸንፉት የሚችሉትን ይወቁ።"
                    : "Participate in exciting Mella auctions and discover what you could win."}
              </p>

              {/* ACCENT */}

              <div className="mt-8 flex items-center gap-3">
                <div className="h-1 w-10 rounded-full bg-[#F78000]" />
                <div className="h-1 w-2 rounded-full bg-white/40" />
                <div className="h-1 w-2 rounded-full bg-white/20" />
              </div>

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <p
              className={`text-xs text-white/40 ${
                isAmharic ? "font-sans" : ""
              }`}
            >
              © {new Date().getFullYear()} Mella.{" "}
              {isAmharic
                ? "መብቱ በሙሉ የተጠበቀ ነው።"
                : "All rights reserved."}
            </p>

          </div>
        </div>

        {/* =====================================================
            FORM PANEL
        ===================================================== */}

        <div className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-12">

          <div className="w-full max-w-md">

            {/* =================================================
                MOBILE LOGO
            ================================================= */}

            <div className="mb-10 lg:hidden">

              <Link
                href="/"
                className="font-display text-3xl tracking-[-0.04em] text-black transition hover:text-[#1681C5]"
              >
                MELLA
              </Link>

              <div className="mt-3 h-1 w-10 rounded-full bg-[#F78000]" />

            </div>

            {/* =================================================
                PAGE CONTENT
            ================================================= */}

            {children}

          </div>

        </div>

      </div>
    </main>
  );
}