"use client";

import {
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  Gavel,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";

const auctions = [
  {
    id: "A-001",
    title: "iPhone 17 Pro Max",
    category: "Electronics",
    participants: 842,
    bids: 3240,
    time: "02:14:38",
    status: "Live",
    entry: "ETB 75",
  },
  {
    id: "A-002",
    title: "BYD Seagull",
    category: "Automotive",
    participants: 1284,
    bids: 6842,
    time: "18:42:11",
    status: "Live",
    entry: "ETB 350",
  },
  {
    id: "A-003",
    title: "Mystery Box #12",
    category: "Mystery Box",
    participants: 426,
    bids: 1832,
    time: "01:08:22",
    status: "Live",
    entry: "ETB 75",
  },
  {
    id: "A-004",
    title: 'Samsung 65" OLED TV',
    category: "Electronics",
    participants: 638,
    bids: 2148,
    time: "2 days",
    status: "Upcoming",
    entry: "ETB 75",
  },
  {
    id: "A-005",
    title: "LG French Door Refrigerator",
    category: "Home",
    participants: 392,
    bids: 1450,
    time: "4 days",
    status: "Upcoming",
    entry: "ETB 75",
  },
  {
    id: "A-006",
    title: "iPhone 16 Pro",
    category: "Electronics",
    participants: 1128,
    bids: 5210,
    time: "Ended",
    status: "Completed",
    entry: "ETB 75",
  },
  {
    id: "A-007",
    title: "Mystery Box #11",
    category: "Mystery Box",
    participants: 517,
    bids: 2280,
    time: "Ended",
    status: "Completed",
    entry: "ETB 75",
  },
];

const categories = [
  "All",
  "Electronics",
  "Automotive",
  "Home",
  "Mystery Box",
];

const statuses = [
  "All",
  "Live",
  "Upcoming",
  "Completed",
];

export default function AuctionsAdminPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredAuctions = useMemo(() => {
    return auctions.filter((auction) => {
      const matchesSearch =
        auction.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        auction.id
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        auction.category === category;

      const matchesStatus =
        status === "All" ||
        auction.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [search, category, status]);

  const liveCount = auctions.filter(
    (auction) => auction.status === "Live"
  ).length;

  const upcomingCount = auctions.filter(
    (auction) => auction.status === "Upcoming"
  ).length;

  const completedCount = auctions.filter(
    (auction) => auction.status === "Completed"
  ).length;

  return (
    <main className="min-h-screen bg-[#F7F8FA]">

      {/* =====================================================
          ADMIN SIDEBAR
      ===================================================== */}
      <AdminSidebar />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}
      <div className="lg:pl-64">

        {/* ===================================================
            SHARED ADMIN HEADER
        =================================================== */}
        <AdminHeader
          title="Auction Management"
          description="Manage your auctions"
        />

        {/* ===================================================
            CONTENT
        =================================================== */}
        <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">

          {/* PAGE INTRO */}
          <div className="mb-8">

            <p className="text-[10px] font-bold tracking-[0.25em] text-[#1681C5]">
              AUCTIONS
            </p>

            <h2 className="mt-3 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
              Manage your auctions.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/45">
              Create, monitor and manage every Mella auction
              from one place.
            </p>

          </div>

          {/* STATS */}
          <div className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-black/40">
                    Live Auctions
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {liveCount}
                  </p>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Gavel size={19} />
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-black/40">
                    Upcoming
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {upcomingCount}
                  </p>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
                  <Clock3 size={19} />
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-black/40">
                    Completed
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {completedCount}
                  </p>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-black/5 text-black/50">
                  <Eye size={19} />
                </div>

              </div>
            </div>

          </div>

          {/* TABLE */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">

            {/* FILTER BAR */}
            <div className="border-b border-black/10 p-5">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                {/* SEARCH */}
                <div className="relative w-full lg:max-w-sm">

                  <Search
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search auctions..."
                    className="h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#1681C5] focus:ring-2 focus:ring-[#1681C5]/10"
                  />

                </div>

                {/* FILTERS */}
                <div className="flex flex-wrap gap-2">

                  <div className="relative">

                    <select
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value)
                      }
                      className="h-11 appearance-none rounded-xl border border-black/10 bg-white pl-4 pr-10 text-sm text-black/60 outline-none focus:border-[#1681C5]"
                    >
                      {categories.map((item) => (
                        <option key={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/30"
                    />

                  </div>

                  <div className="relative">

                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(event.target.value)
                      }
                      className="h-11 appearance-none rounded-xl border border-black/10 bg-white pl-4 pr-10 text-sm text-black/60 outline-none focus:border-[#1681C5]"
                    >
                      {statuses.map((item) => (
                        <option key={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/30"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[950px]">

                <thead>
                  <tr className="border-b border-black/10 bg-black/[0.02] text-left">

                    <th className="px-6 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35">
                      AUCTION
                    </th>

                    <th className="px-4 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35">
                      CATEGORY
                    </th>

                    <th className="px-4 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35">
                      PARTICIPANTS
                    </th>

                    <th className="px-4 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35">
                      BIDS
                    </th>

                    <th className="px-4 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35">
                      TIME
                    </th>

                    <th className="px-4 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35">
                      STATUS
                    </th>

                    <th className="px-6 py-4 text-right text-[9px] font-bold tracking-[0.15em] text-black/35">
                      ACTIONS
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredAuctions.map((auction) => (
                    <tr
                      key={auction.id}
                      className="border-b border-black/5 transition hover:bg-black/[0.015]"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
                            <Gavel size={17} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              {auction.title}
                            </p>

                            <p className="mt-1 font-mono text-[10px] text-black/30">
                              {auction.id}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-4 py-5">
                        <span className="rounded-full bg-black/5 px-3 py-1.5 text-[10px] font-medium text-black/55">
                          {auction.category}
                        </span>
                      </td>

                      <td className="px-4 py-5">

                        <div className="flex items-center gap-2 text-sm">
                          <Users
                            size={14}
                            className="text-black/30"
                          />

                          {auction.participants.toLocaleString()}
                        </div>

                      </td>

                      <td className="px-4 py-5 text-sm font-semibold">
                        {auction.bids.toLocaleString()}
                      </td>

                      <td className="px-4 py-5">

                        <div className="flex items-center gap-2">

                          <Clock3
                            size={14}
                            className={
                              auction.status === "Live"
                                ? "text-red-500"
                                : "text-black/25"
                            }
                          />

                          <span
                            className={`font-mono text-xs ${
                              auction.status === "Live"
                                ? "font-semibold text-red-500"
                                : "text-black/40"
                            }`}
                          >
                            {auction.time}
                          </span>

                        </div>

                      </td>

                      <td className="px-4 py-5">
                        <StatusBadge
                          status={auction.status}
                        />
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-1">

                          <a
                            href={`/auctions/${auction.id}`}
                            className="grid h-9 w-9 place-items-center rounded-lg text-black/40 transition hover:bg-black/5 hover:text-[#1681C5]"
                            title="View auction"
                          >
                            <Eye size={16} />
                          </a>

                          <a
                            href={`/admin/auctions/${auction.id}/edit`}
                            className="grid h-9 w-9 place-items-center rounded-lg text-black/40 transition hover:bg-black/5 hover:text-[#1681C5]"
                            title="Edit auction"
                          >
                            <Edit3 size={16} />
                          </a>

                          <button
                            type="button"
                            className="grid h-9 w-9 place-items-center rounded-lg text-black/40 transition hover:bg-red-50 hover:text-red-500"
                            title="Delete auction"
                          >
                            <Trash2 size={16} />
                          </button>

                          <button
                            type="button"
                            className="grid h-9 w-9 place-items-center rounded-lg text-black/40 transition hover:bg-black/5"
                            title="More options"
                          >
                            <MoreHorizontal size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            {/* MOBILE CARDS */}
            <div className="divide-y divide-black/5 md:hidden">

              {filteredAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className="p-5"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
                        <Gavel size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {auction.title}
                        </p>

                        <p className="mt-1 font-mono text-[10px] text-black/30">
                          {auction.id}
                        </p>
                      </div>

                    </div>

                    <StatusBadge
                      status={auction.status}
                    />

                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">

                    <InfoItem
                      label="Category"
                      value={auction.category}
                    />

                    <InfoItem
                      label="Participants"
                      value={auction.participants.toLocaleString()}
                    />

                    <InfoItem
                      label="Bids"
                      value={auction.bids.toLocaleString()}
                    />

                  </div>

                  <div className="mt-5 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <Clock3
                        size={14}
                        className={
                          auction.status === "Live"
                            ? "text-red-500"
                            : "text-black/30"
                        }
                      />

                      <span className="font-mono text-xs text-black/50">
                        {auction.time}
                      </span>

                    </div>

                    <div className="flex gap-1">

                      <a
                        href={`/auctions/${auction.id}`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-black/40"
                      >
                        <Eye size={15} />
                      </a>

                      <a
                        href={`/admin/auctions/${auction.id}/edit`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-black/40"
                      >
                        <Edit3 size={15} />
                      </a>

                      <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-black/40"
                      >
                        <MoreHorizontal size={15} />
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>

            {/* EMPTY */}
            {filteredAuctions.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#1681C5]/10 text-[#1681C5]">
                  <Search size={21} />
                </div>

                <h3 className="mt-5 font-display text-2xl">
                  No auctions found
                </h3>

                <p className="mt-2 text-sm text-black/40">
                  Try changing your search or filters.
                </p>

              </div>
            )}

          </section>

        </div>
      </div>

    </main>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles = {
    Live: "bg-emerald-50 text-emerald-600",
    Upcoming: "bg-[#1681C5]/10 text-[#1681C5]",
    Completed: "bg-black/5 text-black/45",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
  );
}

/* ============================================================
   MOBILE INFO
============================================================ */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.12em] text-black/30">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-black/70">
        {value}
      </p>
    </div>
  );
}