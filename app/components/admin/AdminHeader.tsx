"use client";

import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

type AdminHeaderProps = {
  title?: string;
  description?: string;
  onMenuClick?: () => void;
};

export default function AdminHeader({
  title = "Dashboard",
  description = "Mella Admin",
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-black/10 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* =====================================================
          LEFT
      ===================================================== */}
      <div className="flex min-w-0 items-center gap-4">
        {/* MOBILE MENU */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-black/10 text-black/60 transition hover:border-[#1681C5] hover:text-[#1681C5] lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* PAGE TITLE */}
        <div className="min-w-0">
          <p className="text-[9px] font-bold tracking-[0.2em] text-[#1681C5]">
            MELLA ADMIN
          </p>

          <h1 className="truncate text-lg font-semibold leading-tight text-black">
            {title}
          </h1>

          {description && (
            <p className="hidden truncate text-[11px] text-black/40 sm:block">
              {description}
            </p>
          )}
        </div>

        {/* SEARCH */}
        <div className="relative ml-2 hidden lg:block">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25"
          />

          <input
            type="search"
            placeholder="Search..."
            className="h-10 w-56 rounded-full border border-black/10 bg-black/[0.02] pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-[#1681C5] focus:bg-white focus:ring-2 focus:ring-[#1681C5]/10"
          />
        </div>
      </div>

      {/* =====================================================
          RIGHT
      ===================================================== */}
      <div className="flex shrink-0 items-center gap-3">
        {/* MOBILE SEARCH */}
        <button
          type="button"
          aria-label="Search"
          className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-black/50 transition hover:border-[#1681C5] hover:text-[#1681C5] lg:hidden"
        >
          <Search size={18} />
        </button>

        {/* NOTIFICATIONS */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-black/10 text-black/50 transition hover:border-[#1681C5] hover:text-[#1681C5]"
        >
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F78000]" />
        </button>

        {/* DIVIDER */}
        <div className="hidden h-8 w-px bg-black/10 sm:block" />

        {/* ADMIN */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-black">
              Administrator
            </p>

            <p className="text-[11px] text-black/40">
              Mella Admin
            </p>
          </div>

          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#1681C5] text-sm font-bold text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
}