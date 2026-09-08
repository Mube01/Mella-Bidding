"use client";

import {
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  Gavel,
  Menu,
  MoreHorizontal,
  Search,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { DragEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

type AdminAuction = {
  id: string;
  title: string;
  category: string;
  participants: number;
  bids: number;
  time: string;
  status: string;
  entry: string;
  featured?: boolean;
  order: number;
};

const auctions: AdminAuction[] = [
  {
    id: "A-001",
    title: "iPhone 17 Pro Max",
    category: "Electronics",
    participants: 842,
    bids: 3240,
    time: "02:14:38",
    status: "Live",
    entry: "ETB 75",
    order: 0,
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
    order: 1,
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
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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

function isFeatured(auction: Record<string, unknown>) {
  return Boolean(auction.featured);
}

export default function AuctionsAdminPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const [databaseAuctions, setDatabaseAuctions] =
    useState<AdminAuction[]>([]);

  const [loading, setLoading] = useState(true);

  // ============================================================
  // DRAG / DROP STATE
  // ============================================================

  const [draggedAuctionId, setDraggedAuctionId] =
    useState<string | null>(null);

  const [dragOverAuctionId, setDragOverAuctionId] =
    useState<string | null>(null);

  const [savingOrder, setSavingOrder] =
    useState(false);

  const router = useRouter();

  // ============================================================
  // LOAD AUCTIONS
  // ============================================================

  useEffect(() => {
    fetch("/api/admin/auctions", {
      cache: "no-store",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDatabaseAuctions(
            data.auctions.map((auction: any) => ({
              id: auction.publicId,
              title: auction.title,
              category: auction.category,
              participants: auction.participantCount,
              bids: auction.bidCount,
              time: new Date(
                auction.endsAt
              ).toLocaleString(),

              status:
                auction.status === "live"
                  ? "Live"
                  : auction.status === "upcoming"
                  ? "Upcoming"
                  : "Completed",

              entry: `ETB ${auction.entryCost}`,

              featured: Boolean(
                auction.featured
              ),

              order:
                typeof auction.order === "number"
                  ? auction.order
                  : 0,
            }))
          );
        }
      })
      .catch(() =>
        setDatabaseAuctions([])
      )
      .finally(() => setLoading(false));
  }, []);

  // ============================================================
  // SOURCE AUCTIONS
  // ============================================================

  const sourceAuctions =
    databaseAuctions.length
      ? databaseAuctions
      : auctions;

  // ============================================================
  // REORDERING IS ONLY ALLOWED WITHOUT FILTERS
  // ============================================================

  const canReorder =
    search.trim() === "" &&
    category === "All" &&
    status === "All";

  // ============================================================
  // FILTERED AUCTIONS
  // ============================================================

  const filteredAuctions = useMemo(() => {
    return sourceAuctions.filter((auction) => {
      const matchesSearch =
        auction.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        auction.id
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

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
  }, [
    search,
    category,
    status,
    sourceAuctions,
  ]);

  // ============================================================
  // STATS
  // ============================================================

  const liveCount = sourceAuctions.filter(
    (auction) =>
      auction.status === "Live"
  ).length;

  const upcomingCount = sourceAuctions.filter(
    (auction) =>
      auction.status === "Upcoming"
  ).length;

  const completedCount = sourceAuctions.filter(
    (auction) =>
      auction.status === "Completed"
  ).length;

  // ============================================================
  // UPDATE AUCTION
  // ============================================================

  async function updateAuction(
    id: string,
    method: "DELETE" | "PATCH",
    body?: object
  ) {
    const response = await fetch(
      `/api/admin/auctions/${encodeURIComponent(
        id
      )}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: body
          ? JSON.stringify(body)
          : undefined,
      }
    );

    if (!response.ok) {
      throw new Error(
        "Auction update failed"
      );
    }

    setDatabaseAuctions((current) =>
      current.filter(
        (auction) => auction.id !== id
      )
    );
  }

  // ============================================================
  // DELETE
  // ============================================================

  async function handleDelete(id: string) {
    if (
      !window.confirm(
        "Delete this auction? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await updateAuction(
        id,
        "DELETE"
      );
    } catch {
      window.alert(
        "Unable to delete auction."
      );
    }
  }

  // ============================================================
  // COMPLETE
  // ============================================================

  async function handleComplete(id: string) {
    try {
      await updateAuction(
        id,
        "PATCH",
        {
          status: "completed",
        }
      );
    } catch {
      window.alert(
        "Unable to complete auction."
      );
    }
  }

  // ============================================================
  // FEATURE
  // ============================================================

  async function handleFeature(id: string) {
    try {
      const response = await fetch(
        `/api/admin/auctions/${encodeURIComponent(
          id
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            featured: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Feature update failed"
        );
      }

      setDatabaseAuctions(
        (current) =>
          current.map((auction) => ({
            ...auction,
            featured:
              auction.id === id,
          }))
      );
    } catch {
      window.alert(
        "Unable to change featured auction."
      );
    }
  }

  // ============================================================
  // DRAG START
  // ============================================================

  function handleDragStart(
    event: DragEvent,
    id: string
  ) {
    if (!canReorder || savingOrder) {
      event.preventDefault();
      return;
    }

    setDraggedAuctionId(id);

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      id
    );
  }

  // ============================================================
  // DRAG OVER
  // ============================================================

  function handleDragOver(
    event: DragEvent,
    id: string
  ) {
    if (!canReorder || savingOrder) {
      return;
    }

    event.preventDefault();

    if (
      !draggedAuctionId ||
      draggedAuctionId === id
    ) {
      return;
    }

    event.dataTransfer.dropEffect =
      "move";

    setDragOverAuctionId(id);
  }

  // ============================================================
  // DROP
  // ============================================================

  async function handleDrop(
    event: DragEvent,
    targetId: string
  ) {
    event.preventDefault();

    if (!canReorder || savingOrder) {
      return;
    }

    const sourceId =
      draggedAuctionId ||
      event.dataTransfer.getData(
        "text/plain"
      );

    if (
      !sourceId ||
      sourceId === targetId
    ) {
      setDraggedAuctionId(null);
      setDragOverAuctionId(null);
      return;
    }

    const currentAuctions =
      [...databaseAuctions];

    const sourceIndex =
      currentAuctions.findIndex(
        (auction) =>
          auction.id === sourceId
      );

    const targetIndex =
      currentAuctions.findIndex(
        (auction) =>
          auction.id === targetId
      );

    if (
      sourceIndex === -1 ||
      targetIndex === -1
    ) {
      setDraggedAuctionId(null);
      setDragOverAuctionId(null);
      return;
    }

    const reordered =
      [...currentAuctions];

    const [movedAuction] =
      reordered.splice(
        sourceIndex,
        1
      );

    reordered.splice(
      targetIndex,
      0,
      movedAuction
    );

    const normalized =
      reordered.map(
        (auction, index) => ({
          ...auction,
          order: index,
        })
      );

    // Immediately update UI
    setDatabaseAuctions(
      normalized
    );

    setDraggedAuctionId(null);
    setDragOverAuctionId(null);

    // Save to database
    await saveAuctionOrder(
      normalized
    );
  }

  // ============================================================
  // DRAG END
  // ============================================================

  function handleDragEnd() {
    setDraggedAuctionId(null);
    setDragOverAuctionId(null);
  }

  // ============================================================
  // SAVE ORDER TO DATABASE
  // ============================================================

  async function saveAuctionOrder(
    newAuctions: AdminAuction[]
  ) {
    try {
      setSavingOrder(true);

      const auctionIds =
        newAuctions.map(
          (auction) => auction.id
        );

      const response = await fetch(
        "/api/admin/auctions/reorder",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            auctionIds,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to save auction order."
        );
      }

      // Normalize local order
      setDatabaseAuctions(
        newAuctions.map(
          (auction, index) => ({
            ...auction,
            order: index,
          })
        )
      );
    } catch (error) {
      console.error(
        "SAVE_AUCTION_ORDER_ERROR:",
        error
      );

      window.alert(
        "Unable to save auction order."
      );

      // Reload the original order
      try {
        const response =
          await fetch(
            "/api/admin/auctions",
            {
              cache: "no-store",
              credentials:
                "include",
            }
          );

        const data =
          await response.json();

        if (data.success) {
          setDatabaseAuctions(
            data.auctions.map(
              (auction: any) => ({
                id: auction.publicId,
                title: auction.title,
                category:
                  auction.category,
                participants:
                  auction.participantCount,
                bids:
                  auction.bidCount,
                time: new Date(
                  auction.endsAt
                ).toLocaleString(),

                status:
                  auction.status ===
                  "live"
                    ? "Live"
                    : auction.status ===
                      "upcoming"
                    ? "Upcoming"
                    : "Completed",

                entry: `ETB ${auction.entryCost}`,

                featured:
                  Boolean(
                    auction.featured
                  ),

                order:
                  typeof auction.order ===
                  "number"
                    ? auction.order
                    : 0,
              })
            )
          );
        }
      } catch (reloadError) {
        console.error(
          "AUCTION_ORDER_RELOAD_ERROR:",
          reloadError
        );
      }
    } finally {
      setSavingOrder(false);
      setDraggedAuctionId(null);
      setDragOverAuctionId(null);
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA]">
        <LoadingSpinner size="lg" />
      </main>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

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

            {/* LIVE */}

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

            {/* UPCOMING */}

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

            {/* COMPLETED */}

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
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search auctions..."
                    className="h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#1681C5] focus:ring-2 focus:ring-[#1681C5]/10"
                  />

                </div>

                {/* FILTERS */}

                <div className="flex flex-wrap gap-2">

                  {/* CATEGORY */}

                  <div className="relative">

                    <select
                      value={category}
                      onChange={(event) =>
                        setCategory(
                          event.target.value
                        )
                      }
                      className="h-11 appearance-none rounded-xl border border-black/10 bg-white pl-4 pr-10 text-sm text-black/60 outline-none focus:border-[#1681C5]"
                    >
                      {categories.map(
                        (item) => (
                          <option
                            key={item}
                          >
                            {item}
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/30"
                    />

                  </div>

                  {/* STATUS */}

                  <div className="relative">

                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target.value
                        )
                      }
                      className="h-11 appearance-none rounded-xl border border-black/10 bg-white pl-4 pr-10 text-sm text-black/60 outline-none focus:border-[#1681C5]"
                    >
                      {statuses.map(
                        (item) => (
                          <option
                            key={item}
                          >
                            {item}
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/30"
                    />

                  </div>

                </div>

              </div>

              {/* REORDER INFO */}

              {canReorder && (
                <div className="mt-4 flex items-center gap-2 text-xs text-black/40">

                  <Menu
                    size={15}
                    className="text-[#1681C5]"
                  />

                  <span>
                    Drag the handle to change the order users see.
                  </span>

                  {savingOrder && (
                    <span className="font-medium text-[#1681C5]">
                      Saving...
                    </span>
                  )}

                </div>
              )}

              {!canReorder && (
                <div className="mt-4 rounded-xl bg-[#1681C5]/5 px-4 py-3 text-xs text-[#1681C5]">
                  Clear the search and filters to reorder auctions.
                </div>
              )}

            </div>

            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[1000px]">

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

                  {filteredAuctions.map(
                    (auction) => (
                      <tr
                        key={auction.id}
                        draggable={
                          canReorder &&
                          !savingOrder
                        }
                        onDragStart={(
                          event
                        ) =>
                          handleDragStart(
                            event,
                            auction.id
                          )
                        }
                        onDragOver={(
                          event
                        ) =>
                          handleDragOver(
                            event,
                            auction.id
                          )
                        }
                        onDrop={(event) =>
                          handleDrop(
                            event,
                            auction.id
                          )
                        }
                        onDragEnd={
                          handleDragEnd
                        }
                        className={`border-b border-black/5 transition ${
                          dragOverAuctionId ===
                          auction.id
                            ? "bg-[#1681C5]/5"
                            : "hover:bg-black/[0.015]"
                        } ${
                          draggedAuctionId ===
                          auction.id
                            ? "opacity-40"
                            : ""
                        }`}
                      >

                        {/* AUCTION */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            {/* DRAG HANDLE */}

                            <button
                              type="button"
                              draggable={
                                canReorder &&
                                !savingOrder
                              }
                              onDragStart={(
                                event
                              ) =>
                                handleDragStart(
                                  event,
                                  auction.id
                                )
                              }
                              onDragEnd={
                                handleDragEnd
                              }
                              disabled={
                                !canReorder ||
                                savingOrder
                              }
                              className={`flex h-9 w-7 shrink-0 items-center justify-center rounded-lg text-black/25 transition ${
                                canReorder
                                  ? "cursor-grab hover:bg-black/5 hover:text-[#1681C5] active:cursor-grabbing"
                                  : "cursor-default opacity-40"
                              }`}
                              title={
                                canReorder
                                  ? "Drag to reorder"
                                  : "Clear filters to reorder"
                              }
                              aria-label={`Reorder ${auction.title}`}
                            >
                              <Menu
                                size={18}
                                strokeWidth={
                                  2
                                }
                              />
                            </button>

                            {/* AUCTION ICON */}

                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
                              <Gavel
                                size={17}
                              />
                            </div>

                            {/* TITLE */}

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

                        {/* CATEGORY */}

                        <td className="px-4 py-5">

                          <span className="rounded-full bg-black/5 px-3 py-1.5 text-[10px] font-medium text-black/55">
                            {auction.category}
                          </span>

                        </td>

                        {/* PARTICIPANTS */}

                        <td className="px-4 py-5">

                          <div className="flex items-center gap-2 text-sm">

                            <Users
                              size={14}
                              className="text-black/30"
                            />

                            {auction.participants.toLocaleString()}

                          </div>

                        </td>

                        {/* BIDS */}

                        <td className="px-4 py-5 text-sm font-semibold">
                          {auction.bids.toLocaleString()}
                        </td>

                        {/* TIME */}

                        <td className="px-4 py-5">

                          <div className="flex items-center gap-2">

                            <Clock3
                              size={14}
                              className={
                                auction.status ===
                                "Live"
                                  ? "text-red-500"
                                  : "text-black/25"
                              }
                            />

                            <span
                              className={`font-mono text-xs ${
                                auction.status ===
                                "Live"
                                  ? "font-semibold text-red-500"
                                  : "text-black/40"
                              }`}
                            >
                              {auction.time}
                            </span>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-5">

                          <StatusBadge
                            status={
                              auction.status
                            }
                          />

                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">

                          <div className="flex justify-end gap-1">

                            {/* VIEW */}

                            <a
                              href={`/auctions/${auction.id}`}
                              className="grid h-9 w-9 place-items-center rounded-lg text-black/40 transition hover:bg-black/5 hover:text-[#1681C5]"
                              title="View auction"
                            >
                              <Eye
                                size={16}
                              />
                            </a>

                            {/* EDIT */}

                            <a
                              href={`/admin/auctions/${auction.id}/edit`}
                              className="grid h-9 w-9 place-items-center rounded-lg text-black/40 transition hover:bg-black/5 hover:text-[#1681C5]"
                              title="Edit auction"
                            >
                              <Edit3
                                size={16}
                              />
                            </a>

                            {/* FEATURE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleFeature(
                                  auction.id
                                )
                              }
                              className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                                isFeatured(
                                  auction
                                )
                                  ? "bg-[#F78000]/10 text-[#F78000]"
                                  : "text-black/40 hover:bg-[#F78000]/10 hover:text-[#F78000]"
                              }`}
                              title={
                                isFeatured(
                                  auction
                                )
                                  ? "Featured auction"
                                  : "Make featured auction"
                              }
                            >
                              <Star
                                size={16}
                                fill={
                                  isFeatured(
                                    auction
                                  )
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  auction.id
                                )
                              }
                              className="grid h-9 w-9 place-items-center rounded-lg text-black/40 transition hover:bg-red-50 hover:text-red-500"
                              title="Delete auction"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>

                            {/* MORE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleComplete(
                                  auction.id
                                )
                              }
                              className="grid h-9 w-9 place-items-center rounded-lg text-black/40 transition hover:bg-black/5"
                              title="More options"
                            >
                              <MoreHorizontal
                                size={16}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* =================================================
                MOBILE CARDS
            ================================================= */}

            <div className="divide-y divide-black/5 md:hidden">

              {filteredAuctions.map(
                (auction) => (
                  <div
                    key={auction.id}
                    draggable={
                      canReorder &&
                      !savingOrder
                    }
                    onDragStart={(
                      event
                    ) =>
                      handleDragStart(
                        event,
                        auction.id
                      )
                    }
                    onDragOver={(
                      event
                    ) =>
                      handleDragOver(
                        event,
                        auction.id
                      )
                    }
                    onDrop={(event) =>
                      handleDrop(
                        event,
                        auction.id
                      )
                    }
                    onDragEnd={
                      handleDragEnd
                    }
                    className={`p-5 transition ${
                      dragOverAuctionId ===
                      auction.id
                        ? "bg-[#1681C5]/5"
                        : ""
                    } ${
                      draggedAuctionId ===
                      auction.id
                        ? "opacity-40"
                        : ""
                    }`}
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">

                        {/* DRAG HANDLE */}

                        <button
                          type="button"
                          draggable={
                            canReorder &&
                            !savingOrder
                          }
                          onDragStart={(
                            event
                          ) =>
                            handleDragStart(
                              event,
                              auction.id
                            )
                          }
                          onDragEnd={
                            handleDragEnd
                          }
                          disabled={
                            !canReorder ||
                            savingOrder
                          }
                          className={`flex h-9 w-7 shrink-0 items-center justify-center rounded-lg text-black/25 ${
                            canReorder
                              ? "cursor-grab active:cursor-grabbing"
                              : "cursor-default opacity-40"
                          }`}
                          title={
                            canReorder
                              ? "Drag to reorder"
                              : "Clear filters to reorder"
                          }
                          aria-label={`Reorder ${auction.title}`}
                        >
                          <Menu
                            size={18}
                            strokeWidth={
                              2
                            }
                          />
                        </button>

                        {/* ICON */}

                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
                          <Gavel
                            size={17}
                          />
                        </div>

                        {/* TITLE */}

                        <div>

                          <p className="text-sm font-semibold">
                            {auction.title}
                          </p>

                          <p className="mt-1 font-mono text-[10px] text-black/30">
                            {auction.id}
                          </p>

                        </div>

                      </div>

                      {/* STATUS */}

                      <StatusBadge
                        status={
                          auction.status
                        }
                      />

                    </div>

                    {/* INFO */}

                    <div className="mt-5 grid grid-cols-3 gap-3">

                      <InfoItem
                        label="Category"
                        value={
                          auction.category
                        }
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

                    {/* BOTTOM */}

                    <div className="mt-5 flex items-center justify-between">

                      {/* TIME */}

                      <div className="flex items-center gap-2">

                        <Clock3
                          size={14}
                          className={
                            auction.status ===
                            "Live"
                              ? "text-red-500"
                              : "text-black/30"
                          }
                        />

                        <span className="font-mono text-xs text-black/50">
                          {auction.time}
                        </span>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex gap-1">

                        {/* VIEW */}

                        <a
                          href={`/auctions/${auction.id}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-black/40"
                          title="View auction"
                        >
                          <Eye
                            size={15}
                          />
                        </a>

                        {/* EDIT */}

                        <a
                          href={`/admin/auctions/${auction.id}/edit`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-black/40"
                          title="Edit auction"
                        >
                          <Edit3
                            size={15}
                          />
                        </a>

                        {/* FEATURE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleFeature(
                              auction.id
                            )
                          }
                          className={`grid h-9 w-9 place-items-center rounded-lg border border-black/10 ${
                            isFeatured(
                              auction
                            )
                              ? "text-[#F78000]"
                              : "text-black/40"
                          }`}
                          title={
                            isFeatured(
                              auction
                            )
                              ? "Featured auction"
                              : "Make featured auction"
                          }
                        >
                          <Star
                            size={15}
                            fill={
                              isFeatured(
                                auction
                              )
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              auction.id
                            )
                          }
                          className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-black/40 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                          title="Delete auction"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>

                        {/* COMPLETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleComplete(
                              auction.id
                            )
                          }
                          className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-black/40"
                          title="Complete auction"
                        >
                          <MoreHorizontal
                            size={15}
                          />
                        </button>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

            {/* =================================================
                EMPTY
            ================================================= */}

            {filteredAuctions.length ===
              0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#1681C5]/10 text-[#1681C5]">
                  <Search
                    size={21}
                  />
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
    Upcoming:
      "bg-[#1681C5]/10 text-[#1681C5]",
    Completed:
      "bg-black/5 text-black/45",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${
        styles[
          status as keyof typeof styles
        ]
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