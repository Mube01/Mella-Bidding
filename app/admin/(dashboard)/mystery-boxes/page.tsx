"use client";

import {
  Boxes,
  Edit3,
  Eye,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import AdminHeader from "../../../components/admin/AdminHeader";
import AdminSidebar from "../../../components/admin/AdminSidebar";

const mysteryBoxes = [
  {
    id: "MB-013",
    title: "Mystery Box #13",
    value: "ETB 25,000+",
    entries: 750,
    status: "Live",
    items: 12,
  },
  {
    id: "MB-012",
    title: "Mystery Box #12",
    value: "ETB 15,000+",
    entries: 426,
    status: "Live",
    items: 8,
  },
  {
    id: "MB-011",
    title: "Mystery Box #11",
    value: "ETB 10,000+",
    entries: 517,
    status: "Completed",
    items: 10,
  },
  {
    id: "MB-014",
    title: "Mystery Box #14",
    value: "ETB 30,000+",
    entries: 0,
    status: "Upcoming",
    items: 15,
  },
];

const statuses = ["All", "Live", "Upcoming", "Completed"];

export default function MysteryBoxesAdminPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredBoxes = useMemo(() => {
    const query = search.toLowerCase().trim();

    return mysteryBoxes.filter((box) => {
      const matchesSearch =
        box.title.toLowerCase().includes(query) ||
        box.id.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || box.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const liveCount = mysteryBoxes.filter(
    (box) => box.status === "Live"
  ).length;

  const upcomingCount = mysteryBoxes.filter(
    (box) => box.status === "Upcoming"
  ).length;

  const completedCount = mysteryBoxes.filter(
    (box) => box.status === "Completed"
  ).length;

  const totalEntries = mysteryBoxes.reduce(
    (total, box) => total + box.entries,
    0
  );

  const totalItems = mysteryBoxes.reduce(
    (total, box) => total + box.items,
    0
  );

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
            ADMIN HEADER
        =================================================== */}
        <AdminHeader
          title="Mystery Box Management"
          description="Manage your mystery boxes"
        />

        {/* ===================================================
            CONTENT
        =================================================== */}
        <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
          {/* PAGE INTRO */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-[#F78000]">
                MYSTERY BOXES
              </p>

              <h2 className="mt-3 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                Manage mystery boxes.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/45">
                Build, manage and monitor Mella mystery boxes
                from one place.
              </p>
            </div>

            <a
              href="/admin/mystery-boxes/new"
              className="flex items-center justify-center gap-2 rounded-full bg-[#F78000] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#F78000]/20 transition hover:bg-[#D96E00]"
            >
              <Plus size={17} />
              Create Mystery Box
            </a>
          </div>

          {/* =================================================
              STATS
          ================================================= */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Live Boxes"
              value={liveCount.toLocaleString()}
              icon={<Boxes size={19} />}
            />

            <StatCard
              label="Total Entries"
              value={totalEntries.toLocaleString()}
              icon={<Package size={19} />}
            />

            <StatCard
              label="Items in Boxes"
              value={totalItems.toLocaleString()}
              icon={<Package size={19} />}
            />
          </div>

          {/* =================================================
              BOX SECTION
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
                    placeholder="Search mystery boxes..."
                    className="h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#F78000] focus:ring-2 focus:ring-[#F78000]/10"
                  />
                </div>

                {/* STATUS FILTER */}
                <div className="w-full lg:w-auto">
                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black/60 outline-none transition focus:border-[#F78000] focus:ring-2 focus:ring-[#F78000]/10 lg:w-auto"
                  >
                    {statuses.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* =================================================
                DESKTOP CARDS
            ================================================= */}
            <div className="hidden p-5 md:block">
              {filteredBoxes.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredBoxes.map((box) => (
                    <MysteryBoxCard
                      key={box.id}
                      box={box}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>

            {/* =================================================
                MOBILE CARDS
            ================================================= */}
            <div className="divide-y divide-black/5 md:hidden">
              {filteredBoxes.length > 0 ? (
                filteredBoxes.map((box) => (
                  <MobileMysteryBoxCard
                    key={box.id}
                    box={box}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          </section>

          {/* SUMMARY */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
            <p className="text-xs text-black/35">
              Showing{" "}
              <span className="font-semibold text-black/55">
                {filteredBoxes.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-black/55">
                {mysteryBoxes.length}
              </span>{" "}
              mystery boxes
            </p>

            <div className="flex gap-4 text-xs text-black/35">
              <span>
                Upcoming:{" "}
                <strong className="text-black/55">
                  {upcomingCount}
                </strong>
              </span>

              <span>
                Completed:{" "}
                <strong className="text-black/55">
                  {completedCount}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   DESKTOP MYSTERY BOX CARD
============================================================ */

function MysteryBoxCard({
  box,
}: {
  box: (typeof mysteryBoxes)[number];
}) {
  return (
    <div className="group rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg">
      {/* TOP */}
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#F78000]/10 text-[#F78000]">
          <Boxes size={21} />
        </div>

        <StatusBadge status={box.status} />
      </div>

      {/* TITLE */}
      <h3 className="mt-6 text-lg font-semibold">
        {box.title}
      </h3>

      <p className="mt-1 font-mono text-[10px] text-black/30">
        {box.id}
      </p>

      {/* INFO */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Info
          label="Value"
          value={box.value}
        />

        <Info
          label="Entries"
          value={box.entries.toLocaleString()}
        />

        <Info
          label="Items"
          value={String(box.items)}
        />
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex gap-2 border-t border-black/10 pt-4">
        <a
          href={`/admin/mystery-boxes/${box.id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 py-2.5 text-xs font-semibold transition hover:border-[#1681C5] hover:text-[#1681C5]"
        >
          <Eye size={14} />
          View
        </a>

        <a
          href={`/admin/mystery-boxes/${box.id}/edit`}
          className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 text-black/50 transition hover:border-[#1681C5] hover:text-[#1681C5]"
          title="Edit mystery box"
        >
          <Edit3 size={15} />
        </a>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 text-black/50 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          title="Delete mystery box"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MOBILE MYSTERY BOX CARD
============================================================ */

function MobileMysteryBoxCard({
  box,
}: {
  box: (typeof mysteryBoxes)[number];
}) {
  return (
    <div className="p-5">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F78000]/10 text-[#F78000]">
            <Boxes size={17} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              {box.title}
            </p>

            <p className="mt-1 font-mono text-[10px] text-black/30">
              {box.id}
            </p>
          </div>
        </div>

        <StatusBadge status={box.status} />
      </div>

      {/* INFO */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Info
          label="Value"
          value={box.value}
        />

        <Info
          label="Entries"
          value={box.entries.toLocaleString()}
        />

        <Info
          label="Items"
          value={String(box.items)}
        />
      </div>

      {/* ACTIONS */}
      <div className="mt-5 flex gap-2 border-t border-black/10 pt-4">
        <a
          href={`/admin/mystery-boxes/${box.id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 py-2.5 text-xs font-semibold transition hover:border-[#1681C5] hover:text-[#1681C5]"
        >
          <Eye size={14} />
          View
        </a>

        <a
          href={`/admin/mystery-boxes/${box.id}/edit`}
          className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 text-black/50 transition hover:border-[#1681C5] hover:text-[#1681C5]"
          title="Edit mystery box"
        >
          <Edit3 size={15} />
        </a>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 text-black/50 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          title="Delete mystery box"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-black/40">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {value}
          </p>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#F78000]/10 text-[#F78000]">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INFO
============================================================ */

function Info({
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
      className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-[#F78000]/10 text-[#F78000]">
        <Boxes size={21} />
      </div>

      <h3 className="mt-5 font-display text-2xl">
        No mystery boxes found
      </h3>

      <p className="mt-2 text-sm text-black/40">
        Try changing your search or filter.
      </p>
    </div>
  );
}