"use client";

import {
  Activity,
  BarChart3,
  Clock3,
  CreditCard,
  Gavel,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const stats = [
  {
    label: "Active Auctions",
    value: "12",
    icon: Gavel,
    detail: "+3 this week",
  },
  {
    label: "Total Users",
    value: "4,281",
    icon: Users,
    detail: "+184 this month",
  },
  {
    label: "Total Bids",
    value: "18,420",
    icon: Activity,
    detail: "+12.4%",
  },
  {
    label: "Revenue",
    value: "ETB 482,500",
    icon: CreditCard,
    detail: "+8.2%",
  },
];

const activeAuctions = [
  {
    id: "A-001",
    title: "iPhone 17 Pro Max",
    category: "Electronics",
    participants: 842,
    time: "02:14:38",
    status: "Live",
  },
  {
    id: "A-002",
    title: "BYD Seagull",
    category: "Automotive",
    participants: 1284,
    time: "18:42:11",
    status: "Live",
  },
  {
    id: "A-003",
    title: "Mystery Box #12",
    category: "Mystery Box",
    participants: 426,
    time: "01:08:22",
    status: "Live",
  },
];

const activities = [
  {
    title: "New auction created",
    description: "Mystery Box #13 was added",
    time: "5 min ago",
  },
  {
    title: "Auction completed",
    description: "iPhone 16 Pro Max auction closed",
    time: "24 min ago",
  },
  {
    title: "Payment received",
    description: "ETB 650 bid package purchase",
    time: "41 min ago",
  },
  {
    title: "New user registered",
    description: "A new Mella account was created",
    time: "1 hr ago",
  },
];

export default function AdminPage() {
  const [databaseStats, setDatabaseStats] = useState<typeof stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) return;
        setDatabaseStats([
          { ...stats[0], value: String(data.stats.live), detail: "Live now" },
          { ...stats[1], value: Number(data.stats.users).toLocaleString(), detail: "Registered" },
          { ...stats[2], value: Number(data.stats.bids).toLocaleString(), detail: "Submitted" },
          { ...stats[3], value: "—", detail: "Payments pending" },
        ]);
      })
      .catch(() => setDatabaseStats(null))
      .finally(() => setLoading(false));
  }, []);

  const visibleStats = databaseStats || stats;

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA]"><LoadingSpinner size="lg" /></main>;
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-black">

      {/* =====================================================
          SHARED SIDEBAR
      ===================================================== */}
      <AdminSidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div className="lg:pl-[260px]">

        {/* ===================================================
            SHARED HEADER
        =================================================== */}
        <AdminHeader
          title="Dashboard"
          description="MELLA ADMIN"
        />

        {/* ===================================================
            PAGE CONTENT
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

            {visibleStats.map((stat) => {
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

              <div className="divide-y divide-black/5">

                {activeAuctions.map((auction) => (
                  <div
                    key={auction.id}
                    className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >

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
                          <Clock3 size={11} />
                          Ends
                        </p>

                        <p className="mt-1 font-mono text-xs font-semibold text-red-500">
                          {auction.time}
                        </p>

                      </div>

                      <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 sm:block">
                        {auction.status}
                      </span>

                    </div>

                  </div>
                ))}

              </div>

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

              <div className="divide-y divide-black/5">

                {activities.map((activity) => (
                  <div
                    key={`${activity.title}-${activity.time}`}
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
                        {activity.time}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

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