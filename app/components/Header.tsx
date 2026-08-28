"use client";

import {
  ChevronDown,
  Gavel,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import PartnerBar from "./PartnerBar";
import { useLanguage } from "../context/LanguageContext";

type CurrentUser = {
  id: string;
  name: string;
  phone: string;
  role: "user" | "admin";
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const accountMenuRef =
    useRef<HTMLDivElement>(null);

  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  /*
   * Never show the main header on
   * authentication pages.
   */
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/admin/login" ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  /*
   * Check authenticated user.
   */
  useEffect(() => {
    let cancelled = false;

    async function checkUser() {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!cancelled) {
          if (
            data.success &&
            data.user
          ) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setCheckingAuth(false);
        }
      }
    }

    checkUser();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  /*
   * Close menus when changing pages.
   */
  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  /*
   * Close desktop account dropdown
   * when clicking outside.
   */
  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(
          event.target as Node
        )
      ) {
        setAccountOpen(false);
      }
    }

    if (accountOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [accountOpen]);

  /*
   * Authentication pages have their own
   * layouts.
   */
  if (isAuthPage) {
    return null;
  }

  const firstName =
    user?.name?.split(" ")[0] || "";

  /*
   * Logout.
   */
  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);
    setAccountOpen(false);
    setMenuOpen(false);

    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Logout request failed"
        );
      }

      setUser(null);

      router.replace("/");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-mella-green backdrop-blur-xl">
      <PartnerBar />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* =====================================================
            LOGO
        ===================================================== */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => {
            setMenuOpen(false);
            setAccountOpen(false);
          }}
        >
          <span className="font-brand text-4xl text-white">
            MELLA
          </span>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}
        <nav className="hidden items-center gap-9 text-sm text-white/60 md:flex">
          <Link
            href="/auctions"
            className="font-medium transition hover:text-white"
          >
            {t("auctions")}
          </Link>

          <Link
            href="/how"
            className="transition hover:text-white"
          >
            {t("howItWorks")}
          </Link>

          <Link
            href="/results"
            className="transition hover:text-white"
          >
            {t("results")}
          </Link>

          <Link
            href="/about"
            className="transition hover:text-white"
          >
            {t("about")}
          </Link>
        </nav>

        {/* =====================================================
            RIGHT ACTIONS
        ===================================================== */}
        <div className="flex items-center gap-3">
          {/* LANGUAGE SWITCHER */}
          <div className="hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={() =>
                setLanguage("en")
              }
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                language === "en"
                  ? "bg-white text-mella-green"
                  : "text-white/50 hover:text-white"
              }`}
            >
              EN
            </button>

            <span className="text-white/30">
              /
            </span>

            <button
              type="button"
              onClick={() =>
                setLanguage("am")
              }
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                language === "am"
                  ? "bg-white text-mella-green"
                  : "text-white/50 hover:text-white"
              }`}
            >
              አማ
            </button>
          </div>

          {/* =================================================
              AUTH ACTIONS
          ================================================= */}
          {checkingAuth ? (
            <div className="hidden h-10 w-24 animate-pulse rounded-full bg-white/10 sm:block" />
          ) : user ? (
            /* USER DROPDOWN */
            <div
              ref={accountMenuRef}
              className="relative hidden sm:block"
            >
              {/* USER BUTTON */}
              <button
                type="button"
                onClick={() =>
                  setAccountOpen(
                    (value) => !value
                  )
                }
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                  <UserRound size={15} />
                </div>

                <span>
                  {firstName}
                </span>

                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    accountOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {/* DROPDOWN */}
              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl shadow-black/15"
                >
                  {/* USER INFO */}
                  <div className="border-b border-neutral-100 px-4 py-3">
                    <p className="text-sm font-semibold text-neutral-900">
                      {user.name}
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      {user.phone}
                    </p>
                  </div>

                  {/* MY ACCOUNT */}
                  <Link
                    href="/account"
                    role="menuitem"
                    onClick={() =>
                      setAccountOpen(false)
                    }
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 hover:text-mella-green"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mella-green/10 text-mella-green">
                      <UserRound size={17} />
                    </div>

                    <div>
                      <p className="font-semibold">
                        {t("myAccount")}
                      </p>

                      <p className="text-[11px] text-neutral-400">
                        {t("manageYourProfile")}
                      </p>
                    </div>
                  </Link>

                  {/* MY AUCTIONS */}
                  <Link
                    href="/my-auctions"
                    role="menuitem"
                    onClick={() =>
                      setAccountOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 hover:text-mella-green"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F78000]/10 text-[#F78000]">
                      <Gavel size={17} />
                    </div>

                    <div>
                      <p className="font-semibold">
                        {t("myAuctions")}
                      </p>

                      <p className="text-[11px] text-neutral-400">
                        {t("viewBiddingActivity")}
                      </p>
                    </div>
                  </Link>

                  {/* DIVIDER */}
                  <div className="my-2 border-t border-neutral-100" />

                  {/* LOGOUT */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                      <LogOut size={17} />
                    </div>

                    <div>
                      <p className="font-semibold">
                        {loggingOut
                          ? t("signingOut")
                          : t("logout")}
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* LOGIN */}
              <Link
                href="/login"
                className="hidden px-4 py-2 text-sm text-white/60 transition hover:text-white sm:block"
              >
                {t("login")}
              </Link>

              {/* START BIDDING */}
              <Link
                href="/register"
                className="rounded-full bg-[#F78000] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                {t("startBidding")}
              </Link>
            </>
          )}

          {/* =====================================================
              MOBILE MENU BUTTON
          ===================================================== */}
          <button
            type="button"
            aria-label={
              menuOpen
                ? t("closeMenu")
                : t("openMenu")
            }
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="p-2 text-white md:hidden"
          >
            {menuOpen ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}
      <div
        className={`overflow-hidden border-t border-white/10 transition-all duration-300 md:hidden ${
          menuOpen
            ? "max-h-[700px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-mella-green px-6 py-4">
          {/* AUCTIONS */}
          <Link
            href="/auctions"
            onClick={() =>
              setMenuOpen(false)
            }
            className="block border-b border-white/10 py-4 text-sm text-white/70 transition hover:text-white"
          >
            {t("auctions")}
          </Link>

          {/* HOW IT WORKS */}
          <Link
            href="/how"
            onClick={() =>
              setMenuOpen(false)
            }
            className="block border-b border-white/10 py-4 text-sm text-white/70 transition hover:text-white"
          >
            {t("howItWorks")}
          </Link>

          {/* RESULTS */}
          <Link
            href="/results"
            onClick={() =>
              setMenuOpen(false)
            }
            className="block border-b border-white/10 py-4 text-sm text-white/70 transition hover:text-white"
          >
            {t("results")}
          </Link>

          {/* ABOUT */}
          <Link
            href="/about"
            onClick={() =>
              setMenuOpen(false)
            }
            className="block border-b border-white/10 py-4 text-sm text-white/70 transition hover:text-white"
          >
            {t("about")}
          </Link>

          {/* =================================================
              MOBILE ACCOUNT
          ================================================= */}
          {!checkingAuth && (
            <>
              {user ? (
                <div className="mt-4 space-y-2">
                  {/* ACCOUNT HEADER */}
                  <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white">
                      <UserRound size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user.name}
                      </p>

                      <p className="mt-0.5 text-xs text-white/40">
                        {user.phone}
                      </p>
                    </div>
                  </div>

                  {/* MY ACCOUNT */}
                  <Link
                    href="/account"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15"
                  >
                    <UserRound size={17} />

                    <span>
                      {t("myAccount")}
                    </span>
                  </Link>

                  {/* MY AUCTIONS */}
                  <Link
                    href="/my-auctions"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15"
                  >
                    <Gavel size={17} />

                    <span>
                      {t("myAuctions")}
                    </span>
                  </Link>

                  {/* LOGOUT */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-left text-sm font-medium text-red-300 transition hover:bg-red-500/15 disabled:opacity-50"
                  >
                    <LogOut size={17} />

                    <span>
                      {loggingOut
                        ? t("signingOut")
                        : t("logout")}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {/* LOGIN */}
                  <Link
                    href="/login"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="rounded-full border border-white/15 px-5 py-3 text-center text-sm font-medium text-white"
                  >
                    {t("login")}
                  </Link>

                  {/* REGISTER */}
                  <Link
                    href="/register"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="rounded-full bg-[#F78000] px-5 py-3 text-center text-sm font-bold text-white"
                  >
                    {t("startBidding")}
                  </Link>
                </div>
              )}
            </>
          )}

          {/* =================================================
              MOBILE LANGUAGE
          ================================================= */}
          <div className="mt-4 flex items-center justify-center gap-2 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() =>
                setLanguage("en")
              }
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
              onClick={() =>
                setLanguage("am")
              }
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