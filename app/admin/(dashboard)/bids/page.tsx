"use client";

import {
  CheckCircle2,
  Clock3,
  Gavel,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";

const bids = [
  {
    id: "B-10482",
    user: "Abebe K.",
    auction: "iPhone 17 Pro Max",
    bid: "ETB 75",
    package: "5 Bids",
    status: "Accepted",
    time: "2 min ago",
  },
  {
    id: "B-10481",
    user: "Sara M.",
    auction: "BYD Seagull",
    bid: "ETB 350",
    package: "10 Bids",
    status: "Accepted",
    time: "5 min ago",
  },
  {
    id: "B-10480",
    user: "Daniel T.",
    auction: "Mystery Box #12",
    bid: "ETB 75",
    package: "1 Bid",
    status: "Accepted",
    time: "8 min ago",
  },
  {
    id: "B-10479",
    user: "Hana A.",
    auction: "iPhone 17 Pro Max",
    bid: "ETB 75",
    package: "2 Bids",
    status: "Pending",
    time: "12 min ago",
  },
  {
    id: "B-10478",
    user: "Michael G.",
    auction: "BYD Seagull",
    bid: "ETB 350",
    package: "5 Bids",
    status: "Accepted",
    time: "17 min ago",
  },
  {
    id: "B-10477",
    user: "Meron B.",
    auction: 'Samsung 65" OLED TV',
    bid: "ETB 75",
    package: "1 Bid",
    status: "Rejected",
    time: "21 min ago",
  },
];

const statuses = [
  "All",
  "Accepted",
  "Pending",
  "Rejected",
];

export default function BidsAdminPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredBids = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bids.filter((bid) => {
      const matchesSearch =
        bid.id.toLowerCase().includes(query) ||
        bid.user.toLowerCase().includes(query) ||
        bid.auction.toLowerCase().includes(query) ||
        bid.package.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || bid.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const acceptedCount = bids.filter(
    (bid) => bid.status === "Accepted"
  ).length;

  const pendingCount = bids.filter(
    (bid) => bid.status === "Pending"
  ).length;

  const rejectedCount = bids.filter(
    (bid) => bid.status === "Rejected"
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
          title="Bid Management"
          description="Monitor bidding activity"
        />

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">

          {/* PAGE INTRO */}

          <div className="mb-8">

            <p className="text-[10px] font-bold tracking-[0.25em] text-[#1681C5]">
              BIDS
            </p>

            <h2 className="mt-3 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
              Monitor every bid.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/45">
              Review bidding activity across all active and
              completed Mella auctions.
            </p>

          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-3">

            {/* ACCEPTED */}

            <div className="rounded-2xl border border-black/10 bg-white p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-black/40">
                    Accepted Bids
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {acceptedCount.toLocaleString()}
                  </p>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={19} />
                </div>

              </div>

            </div>

            {/* PENDING */}

            <div className="rounded-2xl border border-black/10 bg-white p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-black/40">
                    Pending Bids
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {pendingCount.toLocaleString()}
                  </p>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
                  <Clock3 size={19} />
                </div>

              </div>

            </div>

            {/* REJECTED */}

            <div className="rounded-2xl border border-black/10 bg-white p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-black/40">
                    Rejected Bids
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {rejectedCount.toLocaleString()}
                  </p>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-500">
                  <XCircle size={19} />
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

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
                    placeholder="Search bids..."
                    className="h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#1681C5] focus:ring-2 focus:ring-[#1681C5]/10"
                  />

                </div>

                {/* STATUS FILTER */}

                <div className="relative w-full sm:w-auto">

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value)
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-black/10 bg-white pl-4 pr-10 text-sm text-black/60 outline-none transition focus:border-[#1681C5] sm:w-auto"
                  >

                    {statuses.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}

                  </select>

                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/30"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>

                </div>

              </div>

            </div>

            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[950px]">

                <thead>

                  <tr className="border-b border-black/10 bg-black/[0.02] text-left">

                    <th className="px-6 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35">
                      BID
                    </th>

                    <th className="px-4 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35">
                      USER
                    </th>

                    <th className="px-4 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35">
                      AUCTION
                    </th>

                    <th className="px-4 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35">
                      PACKAGE
                    </th>

                    <th className="px-4 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35">
                      TIME
                    </th>

                    <th className="px-4 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35">
                      STATUS
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredBids.map((bid) => (
                    <tr
                      key={bid.id}
                      className="border-b border-black/5 transition hover:bg-black/[0.015]"
                    >

                      {/* BID */}

                      <td className="px-6 py-5">

                        <p className="font-mono text-[10px] text-black/30">
                          {bid.id}
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          {bid.bid}
                        </p>

                      </td>

                      {/* USER */}

                      <td className="px-4 py-5">

                        <div className="flex items-center gap-3">

                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1681C5]/10 text-[#1681C5]">
                            <User size={15} />
                          </div>

                          <span className="text-sm font-medium">
                            {bid.user}
                          </span>

                        </div>

                      </td>

                      {/* AUCTION */}

                      <td className="px-4 py-5">

                        <p className="text-sm font-semibold">
                          {bid.auction}
                        </p>

                      </td>

                      {/* PACKAGE */}

                      <td className="px-4 py-5">

                        <span className="rounded-full bg-black/5 px-3 py-1.5 text-[10px] font-medium text-black/55">
                          {bid.package}
                        </span>

                      </td>

                      {/* TIME */}

                      <td className="px-4 py-5">

                        <div className="flex items-center gap-2">

                          <Clock3
                            size={14}
                            className="text-black/25"
                          />

                          <span className="text-xs text-black/40">
                            {bid.time}
                          </span>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-5">

                        <StatusBadge
                          status={bid.status}
                        />

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            {/* =================================================
                MOBILE CARDS
            ================================================= */}

            <div className="divide-y divide-black/5 md:hidden">

              {filteredBids.map((bid) => (
                <div
                  key={bid.id}
                  className="p-5"
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
                        <Gavel size={17} />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold">
                          {bid.user}
                        </p>

                        <p className="mt-1 font-mono text-[10px] text-black/30">
                          {bid.id}
                        </p>

                      </div>

                    </div>

                    <StatusBadge
                      status={bid.status}
                    />

                  </div>

                  {/* INFO */}

                  <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5">

                    <InfoItem
                      label="Auction"
                      value={bid.auction}
                    />

                    <InfoItem
                      label="Bid"
                      value={bid.bid}
                    />

                    <InfoItem
                      label="Package"
                      value={bid.package}
                    />

                    <InfoItem
                      label="Time"
                      value={bid.time}
                    />

                  </div>

                </div>
              ))}

            </div>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {filteredBids.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#1681C5]/10 text-[#1681C5]">
                  <Gavel size={21} />
                </div>

                <h3 className="mt-5 font-display text-2xl">
                  No bids found
                </h3>

                <p className="mt-2 text-sm text-black/40">
                  Try changing your search or filter.
                </p>

              </div>
            )}

          </section>

          {/* RESULT COUNT */}

          {filteredBids.length > 0 && (
            <div className="mt-4 flex justify-end">

              <p className="text-xs text-black/35">
                Showing {filteredBids.length} of{" "}
                {bids.length} bids
              </p>

            </div>
          )}

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
    Accepted: "bg-emerald-50 text-emerald-600",
    Pending: "bg-[#1681C5]/10 text-[#1681C5]",
    Rejected: "bg-red-50 text-red-500",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold ${
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
    <div className="min-w-0">

      <p className="text-[9px] uppercase tracking-[0.12em] text-black/30">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-black/70">
        {value}
      </p>

    </div>
  );
}