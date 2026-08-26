"use client";

import {
  Bell,
  CreditCard,
  Globe,
  Lock,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";

export default function SettingsAdminPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-black">

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
          title="Platform Settings"
          description="Configure Mella's administration and platform preferences."
        />

        {/* ===================================================
            CONTENT
        =================================================== */}
        <div className="mx-auto max-w-[1200px] px-5 py-8 lg:px-8">

          {/* PAGE INTRO */}
          <div className="mb-8">

            <p className="text-[10px] font-bold tracking-[0.25em] text-[#1681C5]">
              SETTINGS
            </p>

            <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
              Platform settings.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/45">
              Configure Mella's administration, payments,
              notifications and platform preferences.
            </p>

          </div>

          {/* SETTINGS */}
          <div className="space-y-6">

            {/* =================================================
                GENERAL
            ================================================= */}
            <SettingsCard
              icon={<Globe size={18} />}
              title="General"
              description="Basic information about the Mella platform."
            >
              <Input
                label="Platform Name"
                defaultValue="Mella"
              />

              <Input
                label="Support Email"
                defaultValue="support@mella.et"
              />

              <Input
                label="Currency"
                defaultValue="ETB"
              />
            </SettingsCard>

            {/* =================================================
                PAYMENTS
            ================================================= */}
            <SettingsCard
              icon={<CreditCard size={18} />}
              title="Payments"
              description="Configure payment and bid package settings."
            >
              <Input
                label="Payment Provider"
                defaultValue="Telebirr"
              />

              <Input
                label="Single Bid Price"
                defaultValue="ETB 75"
              />

              <Input
                label="Maximum Bids Per Auction"
                defaultValue="100"
              />
            </SettingsCard>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}
            <SettingsCard
              icon={<Bell size={18} />}
              title="Notifications"
              description="Control administrator notifications."
            >
              <Toggle
                label="New user notifications"
                description="Notify administrators when a user registers."
              />

              <Toggle
                label="Payment notifications"
                description="Notify administrators when payments are received."
              />

              <Toggle
                label="Auction completion notifications"
                description="Notify administrators when an auction ends."
              />
            </SettingsCard>

            {/* =================================================
                SECURITY
            ================================================= */}
            <SettingsCard
              icon={<ShieldCheck size={18} />}
              title="Security"
              description="Manage administrator account security."
            >
              <Toggle
                label="Two-factor authentication"
                description="Require additional verification for administrator accounts."
              />

              <Toggle
                label="Login notifications"
                description="Notify administrators about new login activity."
              />
            </SettingsCard>

            {/* =================================================
                ADMINISTRATOR ACCOUNT
            ================================================= */}
            <SettingsCard
              icon={<User size={18} />}
              title="Administrator Account"
              description="Manage your administrator profile."
            >
              <Input
                label="Name"
                defaultValue="Administrator"
              />

              <Input
                label="Email"
                defaultValue="admin@mella.et"
              />

              <button
                type="button"
                className="flex items-center gap-2 text-sm font-semibold text-[#1681C5] transition hover:text-[#116d9f] hover:underline"
              >
                <Lock size={15} />
                Change Password
              </button>
            </SettingsCard>

          </div>

          {/* =================================================
              SAVE BUTTON
          ================================================= */}
          <div className="sticky bottom-5 z-20 mt-8 flex justify-end">

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-full bg-[#1681C5] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#1681C5]/20 transition hover:-translate-y-0.5 hover:bg-[#116d9f]"
            >
              <Save size={16} />

              {saved
                ? "Changes Saved"
                : "Save Changes"}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

/* ============================================================
   SETTINGS CARD
============================================================ */

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white">

      {/* CARD HEADER */}
      <div className="flex items-start gap-4 border-b border-black/10 p-6">

        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
          {icon}
        </div>

        <div>
          <h2 className="font-semibold">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-black/40">
            {description}
          </p>
        </div>

      </div>

      {/* CARD CONTENT */}
      <div className="space-y-5 p-6">
        {children}
      </div>

    </section>
  );
}

/* ============================================================
   INPUT
============================================================ */

function Input({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-xs font-semibold text-black/60">
        {label}
      </span>

      <input
        defaultValue={defaultValue}
        className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-[#1681C5] focus:ring-2 focus:ring-[#1681C5]/10"
      />

    </label>
  );
}

/* ============================================================
   TOGGLE
============================================================ */

function Toggle({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center justify-between gap-5">

      <div className="min-w-0">

        <p className="text-sm font-semibold">
          {label}
        </p>

        <p className="mt-1 max-w-2xl text-xs leading-5 text-black/40">
          {description}
        </p>

      </div>

      <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-[#1681C5]"
            : "bg-black/15"
        }`}
        aria-pressed={enabled}
        aria-label={label}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}