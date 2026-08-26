"use client";

import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import AdminHeader from "../../../components/admin/AdminHeader";
import AdminSidebar from "../../../components/admin/AdminSidebar";

const transactions = [
  {
    id: "TX-10842",
    user: "Abebe K.",
    type: "Bid Package",
    description: "10 Bid Package",
    amount: "ETB 650",
    method: "Telebirr",
    status: "Completed",
    time: "5 min ago",
  },
  {
    id: "TX-10841",
    user: "Sara M.",
    type: "Bid Package",
    description: "5 Bid Package",
    amount: "ETB 350",
    method: "Telebirr",
    status: "Completed",
    time: "12 min ago",
  },
  {
    id: "TX-10840",
    user: "Mikael T.",
    type: "Bid Package",
    description: "2 Bid Package",
    amount: "ETB 140",
    method: "Telebirr",
    status: "Pending",
    time: "18 min ago",
  },
  {
    id: "TX-10839",
    user: "Hana A.",
    type: "Bid Package",
    description: "1 Bid Package",
    amount: "ETB 75",
    method: "Telebirr",
    status: "Failed",
    time: "25 min ago",
  },
];

const statuses = ["All", "Completed", "Pending", "Failed"];

export default function TransactionsAdminPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredTransactions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.id.toLowerCase().includes(query) ||
        transaction.user.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.method.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || transaction.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const completedCount = transactions.filter(
    (transaction) => transaction.status === "Completed"
  ).length;

  const pendingCount = transactions.filter(
    (transaction) => transaction.status === "Pending"
  ).length;

  const failedCount = transactions.filter(
    (transaction) => transaction.status === "Failed"
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
            ADMIN HEADER
        =================================================== */}
        <AdminHeader
          title="Transaction Management"
          description="Monitor payments and transactions"
        />

        {/* ===================================================
            CONTENT
        =================================================== */}
        <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
          {/* PAGE INTRO */}
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#1681C5]">
              PAYMENTS
            </p>

            <h2 className="mt-3 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
              Track transactions.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/45">
              Monitor bid package payments and Telebirr transactions
              across Mella.
            </p>
          </div>

          {/* =================================================
              STATS
          ================================================= */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Today's Revenue"
              value="ETB 28,450"
              icon={<CreditCard size={19} />}
            />

            <StatCard
              label="Completed"
              value={completedCount.toLocaleString()}
              icon={<CheckCircle2 size={19} />}
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              label="Pending"
              value={pendingCount.toLocaleString()}
              icon={<Clock3 size={19} />}
              iconClass="bg-[#1681C5]/10 text-[#1681C5]"
            />
          </div>

          {/* =================================================
              TRANSACTION TABLE
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
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search transactions..."
                    className="h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#1681C5] focus:ring-2 focus:ring-[#1681C5]/10"
                  />
                </div>

                {/* STATUS FILTER */}
                <div className="relative w-full sm:w-auto">
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-black/10 bg-white pl-4 pr-10 text-sm text-black/60 outline-none transition focus:border-[#1681C5] focus:ring-2 focus:ring-[#1681C5]/10 sm:w-auto"
                  >
                    {statuses.map((item) => (
                      <option key={item}>{item}</option>
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
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-black/10 bg-black/[0.02] text-left">
                    <Head>ID</Head>
                    <Head>User</Head>
                    <Head>Description</Head>
                    <Head>Amount</Head>
                    <Head>Method</Head>
                    <Head>Status</Head>
                    <Head>Time</Head>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-black/5 transition hover:bg-black/[0.015]"
                    >
                      {/* ID */}
                      <td className="px-6 py-5">
                        <p className="font-mono text-xs font-semibold">
                          {transaction.id}
                        </p>
                      </td>

                      {/* USER */}
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1681C5]/10 text-[#1681C5]">
                            <Users size={15} />
                          </div>

                          <span className="text-sm font-semibold">
                            {transaction.user}
                          </span>
                        </div>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="px-4 py-5">
                        <p className="text-sm font-semibold">
                          {transaction.description}
                        </p>

                        <p className="mt-1 text-[10px] text-black/35">
                          {transaction.type}
                        </p>
                      </td>

                      {/* AMOUNT */}
                      <td className="px-4 py-5">
                        <p className="text-sm font-bold">
                          {transaction.amount}
                        </p>
                      </td>

                      {/* METHOD */}
                      <td className="px-4 py-5">
                        <span className="rounded-full bg-[#1681C5]/10 px-3 py-1.5 text-[10px] font-semibold text-[#1681C5]">
                          {transaction.method}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-5">
                        <PaymentStatus status={transaction.status} />
                      </td>

                      {/* TIME */}
                      <td className="px-4 py-5 text-xs text-black/40">
                        {transaction.time}
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
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-5">
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
                        <CreditCard size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {transaction.user}
                        </p>

                        <p className="mt-1 font-mono text-[10px] text-black/30">
                          {transaction.id}
                        </p>
                      </div>
                    </div>

                    <PaymentStatus status={transaction.status} />
                  </div>

                  {/* INFO */}
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <InfoItem
                      label="Description"
                      value={transaction.description}
                    />

                    <InfoItem
                      label="Amount"
                      value={transaction.amount}
                    />

                    <InfoItem
                      label="Method"
                      value={transaction.method}
                    />

                    <InfoItem
                      label="Time"
                      value={transaction.time}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* =================================================
                EMPTY STATE
            ================================================= */}
            {filteredTransactions.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#1681C5]/10 text-[#1681C5]">
                  <Search size={21} />
                </div>

                <h3 className="mt-5 font-display text-2xl">
                  No transactions found
                </h3>

                <p className="mt-2 text-sm text-black/40">
                  Try changing your search or filter.
                </p>
              </div>
            )}
          </section>

          {/* OPTIONAL SUMMARY */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
            <p className="text-xs text-black/35">
              Showing{" "}
              <span className="font-semibold text-black/55">
                {filteredTransactions.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-black/55">
                {transactions.length}
              </span>{" "}
              transactions
            </p>

            {failedCount > 0 && (
              <p className="text-xs text-red-500">
                {failedCount} failed transaction
                {failedCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
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
  iconClass = "bg-[#1681C5]/10 text-[#1681C5]",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-black/40">{label}</p>

          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>

        <div
          className={`grid h-11 w-11 place-items-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TABLE HEAD
============================================================ */

function Head({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-4 text-[9px] font-bold tracking-[0.15em] text-black/35 first:pl-6">
      {children}
    </th>
  );
}

/* ============================================================
   PAYMENT STATUS
============================================================ */

function PaymentStatus({ status }: { status: string }) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-600",
    Pending: "bg-orange-50 text-orange-600",
    Failed: "bg-red-50 text-red-500",
  };

  const icons = {
    Completed: CheckCircle2,
    Pending: Clock3,
    Failed: XCircle,
  };

  const Icon = icons[status as keyof typeof icons];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold ${
        styles[status as keyof typeof styles]
      }`}
    >
      {Icon && <Icon size={12} />}
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