"use client";

import {
  Activity,
  Clock3,
  Gavel,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

type Stat = {
  label: string;
  value: string;
  icon: typeof Gavel;
  detail: string;
};

type ActiveAuction = {
  id: string;
  title: string;
  category: string;
  participants: number;
  bidCount: number;
  endsAt: string;
  status: string;
};

type ActivityItem = {
  type: string;
  title: string;
  description: string;
  time: string;
  timestamp: number;
};

type DashboardData = {
  stats: {
    live: number;
    users: number;
    bids: number;
    completed: number;
  };
  activeAuctions: ActiveAuction[];
  activities: ActivityItem[];
};

export default function AdminPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  /*
   * =========================================================
   * LOAD DASHBOARD DATA
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          "/api/admin/stats",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load dashboard"
          );
        }

        const data =
          await response.json();

        if (
          cancelled ||
          !data?.success
        ) {
          return;
        }

        setDashboard({
          stats: {
            live:
              Number(
                data.stats?.live
              ) || 0,

            users:
              Number(
                data.stats?.users
              ) || 0,

            bids:
              Number(
                data.stats?.bids
              ) || 0,

            completed:
              Number(
                data.stats?.completed
              ) || 0,
          },

          activeAuctions:
            Array.isArray(
              data.activeAuctions
            )
              ? data.activeAuctions
              : [],

          activities:
            Array.isArray(
              data.activities
            )
              ? data.activities
              : [],
        });
      } catch (error) {
        console.error(
          "ADMIN_DASHBOARD_ERROR:",
          error
        );

        if (!cancelled) {
          setError(true);
          setDashboard(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    /*
     * Refresh dashboard every 30 seconds.
     */

    const interval = setInterval(
      loadDashboard,
      30000
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  /*
   * =========================================================
   * STATS
   * =========================================================
   */

  const stats: Stat[] = useMemo(() => {
    if (!dashboard) return [];

    return [
      {
        label: "Active Auctions",
        value:
          dashboard.stats.live.toLocaleString(),
        icon: Gavel,
        detail: "Live now",
      },
      {
        label: "Total Users",
        value:
          dashboard.stats.users.toLocaleString(),
        icon: Users,
        detail: "Registered",
      },
      {
        label: "Total Bids",
        value:
          dashboard.stats.bids.toLocaleString(),
        icon: Activity,
        detail: "Submitted",
      },
      {
        label: "Completed Auctions",
        value:
          dashboard.stats.completed.toLocaleString(),
        icon: Trophy,
        detail: "Completed",
      },
    ];
  }, [dashboard]);

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <LoadingSpinner size="lg" />
      </main>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (error || !dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <p className="text-sm font-semibold text-red-500">
            Unable to load dashboard data.
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-4 rounded-xl bg-[#1681C5] px-5 py-2.5 text-sm font-bold text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-black">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <AdminSidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="lg:pl-[260px]">

        {/* ===================================================
            HEADER
        =================================================== */}

        <AdminHeader
          title="Dashboard"
          description="MELLA ADMIN"
        />

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">

          {/* =================================================
              INTRO
          ================================================= */}

          <div className="mb-8">

            <h2 className="font-display text-4xl tracking-[-0.03em] sm:text-5xl">
              Good afternoon, Admin.
            </h2>

            <p className="mt-2 text-sm text-black/45">
              Here's what's happening across Mella today.
            </p>

          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-xs font-medium text-black/40">
                        {stat.label}
                      </p>

                      <p className="mt-3 text-2xl font-bold tracking-tight">
                        {stat.value}
                      </p>

                      <p className="mt-2 text-[11px] font-medium text-[#1681C5]">
                        {stat.detail}
                      </p>

                    </div>

                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
                      <Icon size={18} />
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

            {/* ===============================================
                ACTIVE AUCTIONS
            =============================================== */}

            <section className="rounded-2xl border border-black/10 bg-white">

              <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">

                <div>

                  <h3 className="font-semibold">
                    Active Auctions
                  </h3>

                  <p className="mt-1 text-xs text-black/40">
                    Currently running auctions
                  </p>

                </div>

                <a
                  href="/admin/auctions"
                  className="text-xs font-bold text-[#1681C5] transition hover:underline"
                >
                  View all
                </a>

              </div>

              {dashboard.activeAuctions.length > 0 ? (

                <div className="divide-y divide-black/5">

                  {dashboard.activeAuctions.map(
                    (auction) => (
                      <ActiveAuctionRow
                        key={auction.id}
                        auction={auction}
                      />
                    )
                  )}

                </div>

              ) : (

                <div className="px-6 py-12 text-center">

                  <Gavel
                    size={24}
                    className="mx-auto text-black/20"
                  />

                  <p className="mt-3 text-sm font-semibold">
                    No active auctions
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    There are currently no live auctions.
                  </p>

                </div>

              )}

            </section>

            {/* ===============================================
                RECENT ACTIVITY
            =============================================== */}

            <section className="rounded-2xl border border-black/10 bg-white">

              <div className="border-b border-black/10 px-6 py-5">

                <h3 className="font-semibold">
                  Recent Activity
                </h3>

                <p className="mt-1 text-xs text-black/40">
                  Latest platform events
                </p>

              </div>

              {dashboard.activities.length > 0 ? (

                <div className="divide-y divide-black/5">

                  {dashboard.activities.map(
                    (activity, index) => (
                      <div
                        key={`${activity.timestamp}-${index}`}
                        className="flex gap-4 px-6 py-5"
                      >

                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1681C5]" />

                        <div className="min-w-0">

                          <p className="text-sm font-semibold">
                            {activity.title}
                          </p>

                          <p className="mt-1 text-xs text-black/40">
                            {activity.description}
                          </p>

                          <p className="mt-2 text-[10px] text-black/25">
                            {formatRelativeTime(
                              activity.time
                            )}
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>

              ) : (

                <div className="px-6 py-12 text-center">

                  <Activity
                    size={24}
                    className="mx-auto text-black/20"
                  />

                  <p className="mt-3 text-sm font-semibold">
                    No recent activity
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    Platform activity will appear here.
                  </p>

                </div>

              )}

            </section>

          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="mt-6">

            <div className="mb-4">

              <h3 className="font-semibold">
                Quick Actions
              </h3>

              <p className="mt-1 text-xs text-black/40">
                Frequently used administration tools
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* CREATE AUCTION */}

              <a
                href="/admin/auctions/new"
                className="group rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-1 hover:border-[#1681C5]/30 hover:shadow-lg"
              >

                <Gavel
                  size={20}
                  className="text-[#1681C5]"
                />

                <h4 className="mt-5 text-sm font-semibold">
                  Create Auction
                </h4>

                <p className="mt-1 text-xs text-black/40">
                  Add a new auction
                </p>

              </a>

              {/* VERIFY RESULTS */}

              <a
                href="/results"
                className="group rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-1 hover:border-[#1681C5]/30 hover:shadow-lg"
              >

                <ShieldCheck
                  size={20}
                  className="text-[#1681C5]"
                />

                <h4 className="mt-5 text-sm font-semibold">
                  Verify Results
                </h4>

                <p className="mt-1 text-xs text-black/40">
                  Review completed auctions
                </p>

              </a>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}

/* =============================================================
   ACTIVE AUCTION ROW
============================================================= */

function ActiveAuctionRow({
  auction,
}: {
  auction: ActiveAuction;
}) {
  const [timeLeft, setTimeLeft] =
    useState(
      getTimeLeft(auction.endsAt)
    );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(
        getTimeLeft(auction.endsAt)
      );
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [auction.endsAt]);

  return (
    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

      {/* AUCTION INFO */}

      <div className="flex items-center gap-4">

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F78000]/10 text-[#F78000]">
          <Gavel size={18} />
        </div>

        <div>

          <h4 className="text-sm font-semibold">
            {auction.title}
          </h4>

          <p className="mt-1 text-[11px] text-black/40">
            {auction.id} · {auction.category}
          </p>

        </div>

      </div>

      {/* AUCTION STATS */}

      <div className="flex items-center gap-6">

        <div>

          <p className="text-[10px] text-black/35">
            Participants
          </p>

          <p className="mt-1 text-sm font-semibold">
            {auction.participants.toLocaleString()}
          </p>

        </div>

        <div>

          <p className="flex items-center gap-1 text-[10px] text-black/35">
            <Activity size={11} />
            Bids
          </p>

          <p className="mt-1 text-sm font-semibold">
            {auction.bidCount.toLocaleString()}
          </p>

        </div>

        <div>

          <p className="flex items-center gap-1 text-[10px] text-black/35">
            <Clock3 size={11} />
            Ends
          </p>

          <p className="mt-1 font-mono text-xs font-semibold text-red-500">
            {timeLeft}
          </p>

        </div>

        <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 sm:block">
          {auction.status}
        </span>

      </div>

    </div>
  );
}

/* =============================================================
   TIME HELPERS
============================================================= */

function getTimeLeft(
  endsAt: string
) {
  const difference =
    new Date(endsAt).getTime() -
    Date.now();

  if (difference <= 0) {
    return "Ended";
  }

  const totalSeconds =
    Math.floor(difference / 1000);

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}

/* =============================================================
   RELATIVE TIME
============================================================= */

function formatRelativeTime(
  dateString: string
) {
  const date =
    new Date(dateString);

  const seconds = Math.floor(
    (Date.now() - date.getTime()) /
      1000
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days} day${
      days === 1 ? "" : "s"
    } ago`;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}