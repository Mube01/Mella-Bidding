"use client";

import {
  ArrowRight,
  Gavel,
  LogOut,
  Phone,
  UserRound,
  Trophy,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "../context/LanguageContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

type User = {
  id: string;
  name: string;
  phone: string;
  role: "user" | "admin";
  createdAt?: string;
};

export default function AccountPage() {
  const router = useRouter();

  const { t } = useLanguage();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [loggingOut, setLoggingOut] =
    useState(false);

  /*
   * Load authenticated user.
   */
  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          router.replace("/login");
          return;
        }

        setUser(data.user);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [router]);

  /*
   * Logout.
   */
  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

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

      router.replace("/");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <LoadingSpinner size="lg" />
          Loading...
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const firstName =
    user.name.split(" ")[0];

  return (
    <main className="min-h-screen bg-neutral-50 px-6 pb-20 pt-40 sm:pt-44">
      <div className="mx-auto max-w-5xl">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-mella-green">
            {t("mellaAccount")}
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            {t("welcome")}, {firstName}.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
            {t("accountDescription")}
          </p>
        </div>

        {/* =====================================================
            ACCOUNT CARD
        ===================================================== */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">

          {/* PROFILE */}
          <div className="border-b border-neutral-100 p-6 sm:p-8">
            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mella-green text-white">
                <UserRound size={24} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  {t("mellaMember")}
                </p>
              </div>

            </div>
          </div>

          {/* DETAILS */}
          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">

            {/* FULL NAME */}
            <div>
              <p className="text-xs font-bold tracking-wider text-neutral-400">
                {t("fullName")}
              </p>

              <p className="mt-2 text-sm font-medium text-neutral-900">
                {user.name}
              </p>
            </div>

            {/* PHONE */}
            <div>
              <p className="text-xs font-bold tracking-wider text-neutral-400">
                {t("phoneNumber")}
              </p>

              <div className="mt-2 flex items-center gap-2">

                <Phone
                  size={15}
                  className="text-neutral-400"
                />

                <p className="text-sm font-medium text-neutral-900">
                  {user.phone}
                </p>

              </div>
            </div>

          </div>
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          {/* =================================================
              EXPLORE AUCTIONS
          ================================================= */}
          <Link
            href="/auctions"
            className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <Gavel
                    size={15}
                    className="text-mella-green"
                  />

                  <p className="text-xs font-bold tracking-wider text-mella-green">
                    MELLA
                  </p>

                </div>

                <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                  {t("exploreAuctions")}
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  {t("findNextOpportunity")}
                </p>

              </div>

              <ArrowRight
                size={20}
                className="text-neutral-400 transition group-hover:translate-x-1"
              />

            </div>
          </Link>

          {/* =================================================
              MY AUCTIONS
          ================================================= */}
          <Link
            href="/my-auctions"
            className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <Gavel
                    size={15}
                    className="text-mella-green"
                  />

                  <p className="text-xs font-bold tracking-wider text-mella-green">
                    {t("myActivity")}
                  </p>

                </div>

                <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                  {t("myAuctions")}
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  {t("trackAuctionsAndBids")}
                </p>

              </div>

              <ArrowRight
                size={20}
                className="text-neutral-400 transition group-hover:translate-x-1"
              />

            </div>
          </Link>

          {/* =================================================
              RESULTS
          ================================================= */}
          <Link
            href="/results"
            className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <Trophy
                    size={15}
                    className="text-mella-green"
                  />

                  <p className="text-xs font-bold tracking-wider text-mella-green">
                    {t("results")}
                  </p>

                </div>

                <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                  {t("seeTheWins")}
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  {t("viewCompletedResults")}
                </p>

              </div>

              <ArrowRight
                size={20}
                className="text-neutral-400 transition group-hover:translate-x-1"
              />

            </div>
          </Link>

        </div>

        {/* =====================================================
            LOGOUT
        ===================================================== */}
        <div className="mt-8">

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={17} />

            {loggingOut
              ? t("signingOut")
              : t("signOut")}

          </button>

        </div>

      </div>
    </main>
  );
}