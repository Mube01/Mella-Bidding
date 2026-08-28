"use client";

import {
  CreditCard,
  Gavel,
  LayoutDashboard,
  LogOut,
  Settings,
  Trophy,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Auctions",
    href: "/admin/auctions",
    icon: Gavel,
  },
  {
    name: "Bids",
    href: "/admin/bids",
    icon: Trophy,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
];

const bottomNavigation = [
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  };

  async function handleLogout() {
    try {
      await fetch("/api/auth/admin-logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("ADMIN_LOGOUT_ERROR:", error);
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-black/10 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* =====================================================
            LOGO
        ===================================================== */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-black/10 px-6">
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center"
          >
            <span className="font-display text-3xl tracking-[0.08em] text-[#1681C5]">
              MELLA
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-black/50 transition hover:bg-black/5 hover:text-black lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
            Management
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#1681C5] text-white shadow-md shadow-[#1681C5]/20"
                      : "text-black/55 hover:bg-[#1681C5]/5 hover:text-[#1681C5]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 ${
                      active
                        ? "text-white"
                        : "text-black/35 group-hover:text-[#1681C5]"
                    }`}
                  />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* =====================================================
              SYSTEM
          ===================================================== */}
          <div className="mt-8">
            <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
              System
            </p>

            <nav className="space-y-1">
              {bottomNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-[#1681C5] text-white shadow-md shadow-[#1681C5]/20"
                        : "text-black/55 hover:bg-[#1681C5]/5 hover:text-[#1681C5]"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        active
                          ? "text-white"
                          : "text-black/35 group-hover:text-[#1681C5]"
                      }
                    />

                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* =====================================================
            ADMIN PROFILE
        ===================================================== */}
        <div className="shrink-0 border-t border-black/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-black/[0.03] p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1681C5] text-sm font-bold text-white">
              A
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-black">
                Administrator
              </p>

              <p className="truncate text-xs text-black/40">
                Admin account
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="rounded-lg p-2 text-black/35 transition hover:bg-white hover:text-[#F78000]"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}