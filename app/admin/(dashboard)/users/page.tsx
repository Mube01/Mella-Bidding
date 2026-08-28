"use client";

import {
  CheckCircle2,
  ChevronDown,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const sampleUsers = [
  {
    id: "U-00182",
    name: "Abebe Kebede",
    phone: "0911 234 567",
    bids: 84,
    spent: "ETB 6,300",
    status: "Active",
    joined: "Aug 24, 2026",
  },
  {
    id: "U-00181",
    name: "Sara Mekonnen",
    phone: "0922 345 678",
    bids: 126,
    spent: "ETB 9,450",
    status: "Active",
    joined: "Aug 23, 2026",
  },
  {
    id: "U-00180",
    name: "Mikael Tesfaye",
    phone: "0933 456 789",
    bids: 42,
    spent: "ETB 3,150",
    status: "Active",
    joined: "Aug 22, 2026",
  },
  {
    id: "U-00179",
    name: "Hana Alemu",
    phone: "0944 567 890",
    bids: 18,
    spent: "ETB 1,350",
    status: "Suspended",
    joined: "Aug 21, 2026",
  },
];

const statuses = [
  "All",
  "Active",
  "Suspended",
];

export default function UsersAdminPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [users, setUsers] = useState(sampleUsers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users.map((user: any) => ({
            id: user._id,
            name: user.name,
            phone: user.phone,
            bids: user.bids || 0,
            spent: "—",
            status: "Active",
            joined: new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          })));
        }
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" ||
        user.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, status]);

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const suspendedUsers = users.filter(
    (user) => user.status === "Suspended"
  ).length;

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA]"><LoadingSpinner size="lg" /></main>;
  }

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
          title="User Management"
          description="Manage Mella users"
        />

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">

          {/* =================================================
              PAGE INTRO
          ================================================= */}

          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-[10px] font-bold tracking-[0.25em] text-[#1681C5]">
                USERS
              </p>

              <h2 className="mt-3 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                Manage users.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/45">
                Manage Mella accounts and participant activity.
              </p>

            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/register";
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1681C5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#116d9f] sm:w-auto"
            >
              <UserPlus size={16} />
              Add User
            </button>

          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-3">

            {/* TOTAL USERS */}

            <StatCard
              label="Total Users"
              value={totalUsers.toLocaleString()}
              icon={<Users size={18} />}
            />

            {/* ACTIVE USERS */}

            <StatCard
              label="Active Users"
              value={activeUsers.toLocaleString()}
              icon={<CheckCircle2 size={18} />}
            />

            {/* VERIFIED USERS */}

            <StatCard
              label="Verified Users"
              value="3,874"
              icon={<ShieldCheck size={18} />}
            />

          </div>

          {/* =================================================
              USER TABLE
          ================================================= */}

          <section className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">

            {/* =================================================
                FILTER BAR
            ================================================= */}

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
                    placeholder="Search users..."
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

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/30"
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr className="border-b border-black/10 bg-black/[0.02] text-left">

                    <TableHead>
                      USER
                    </TableHead>

                    <TableHead>
                      PHONE
                    </TableHead>

                    <TableHead>
                      BIDS
                    </TableHead>

                    <TableHead>
                      SPENT
                    </TableHead>

                    <TableHead>
                      STATUS
                    </TableHead>

                    <TableHead>
                      JOINED
                    </TableHead>

                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-black/5 transition hover:bg-black/[0.015]"
                    >

                      {/* USER */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1681C5] text-xs font-bold text-white">
                            {user.name.charAt(0)}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold">
                              {user.name}
                            </p>

                            <p className="mt-1 font-mono text-[10px] text-black/30">
                              {user.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PHONE */}

                      <td className="px-4 py-5 text-sm text-black/60">
                        {user.phone}
                      </td>

                      {/* BIDS */}

                      <td className="px-4 py-5 text-sm font-semibold">
                        {user.bids.toLocaleString()}
                      </td>

                      {/* SPENT */}

                      <td className="px-4 py-5 text-sm font-semibold">
                        {user.spent}
                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-5">

                        <UserStatus
                          status={user.status}
                        />

                      </td>

                      {/* JOINED */}

                      <td className="px-4 py-5 text-xs text-black/45">
                        {user.joined}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

            {/* =================================================
                MOBILE USER CARDS
            ================================================= */}

            <div className="divide-y divide-black/5 md:hidden">

              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-5"
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1681C5] text-xs font-bold text-white">
                        {user.name.charAt(0)}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold">
                          {user.name}
                        </p>

                        <p className="mt-1 font-mono text-[10px] text-black/30">
                          {user.id}
                        </p>

                      </div>

                    </div>

                    <UserStatus
                      status={user.status}
                    />

                  </div>

                  {/* USER INFO */}

                  <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5">

                    <InfoItem
                      label="Phone"
                      value={user.phone}
                    />

                    <InfoItem
                      label="Bids"
                      value={user.bids.toLocaleString()}
                    />

                    <InfoItem
                      label="Spent"
                      value={user.spent}
                    />

                    <InfoItem
                      label="Joined"
                      value={user.joined}
                    />

                  </div>

                </div>
              ))}

            </div>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {filteredUsers.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#1681C5]/10 text-[#1681C5]">
                  <Search size={21} />
                </div>

                <h3 className="mt-5 font-display text-2xl">
                  No users found
                </h3>

                <p className="mt-2 text-sm text-black/40">
                  Try changing your search or filter.
                </p>

              </div>
            )}

          </section>

          {/* =================================================
              RESULT COUNT
          ================================================= */}

          {filteredUsers.length > 0 && (
            <div className="mt-4 flex justify-end">

              <p className="text-xs text-black/35">
                Showing {filteredUsers.length} of{" "}
                {users.length} users
              </p>

            </div>
          )}

        </div>

      </div>

    </main>
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
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs text-black/40">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
          </p>

        </div>

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
          {icon}
        </div>

      </div>

    </div>
  );
}

/* ============================================================
   TABLE HEAD
============================================================ */

function TableHead({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <th className="px-4 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35 first:pl-6">
      {children}
    </th>
  );
}

/* ============================================================
   USER STATUS
============================================================ */

function UserStatus({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold ${
        status === "Active"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-red-50 text-red-500"
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