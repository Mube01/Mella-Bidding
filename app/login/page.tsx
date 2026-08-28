"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Phone,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import {
  FormEvent,
  useState,
} from "react";

import AuthShell from "../components/auth/AuthShell";
import { useLanguage } from "../context/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();

  const [showPassword, setShowPassword] =
    useState(false);

  const [remember, setRemember] =
    useState(false);

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        password,
        remember,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || t("loginFailed"));
      return;
    }

    window.location.href = "/auctions";
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    alert(t("somethingWentWrong"));
  }
};

  return (
    <AuthShell>
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#F78000]/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[#F78000]">
          <UserRound size={13} />

          {t("mellaAccount")}
        </div>

        <h2 className="font-display text-4xl tracking-[-0.04em] sm:text-5xl">
          {t("loginPageTitle")}
        </h2>

        <p className="mt-3 text-sm leading-6 text-black/45">
          {t("loginPageDescription")}
        </p>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        {/* PHONE NUMBER */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45"
          >
            {t("phoneNumber")}
          </label>

          <div className="relative">
            <Phone
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
            />

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="09XX XXX XXX"
              autoComplete="tel"
              inputMode="tel"
              required
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="password"
              className="block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45"
            >
              {t("password")}
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#F78000] transition hover:text-[#d96d00] hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <div className="relative">
            <LockKeyhole
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
            />

            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder={t(
                "enterPassword"
              )}
              autoComplete="current-password"
              required
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
              }
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-black/30 transition hover:bg-[#F78000]/10 hover:text-[#F78000]"
              aria-label={
                showPassword
                  ? t("hidePassword")
                  : t("showPassword")
              }
            >
              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>
        </div>

        {/* REMEMBER */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) =>
              setRemember(
                event.target.checked
              )
            }
            className="h-4 w-4 rounded border-black/20 accent-[#F78000]"
          />

          <span className="text-xs text-black/50">
            {t("keepMeSignedIn")}
          </span>
        </label>

        {/* SUBMIT */}
        <button
          type="submit"
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1681C5] text-sm font-bold text-white shadow-lg shadow-[#1681C5]/20 transition hover:bg-[#116d9f] active:scale-[0.99]"
        >
          {t("signIn")}

          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </form>

      {/* =====================================================
          REGISTER
      ===================================================== */}
      <div className="mt-8 text-center">
        <p className="text-sm text-black/40">
          {t("dontHaveAccount")}
        </p>

        <Link
          href="/register"
          className="mt-2 inline-block text-sm font-bold text-[#F78000] transition hover:text-[#d96d00] hover:underline"
        >
          {t("createAccount")}
        </Link>
      </div>

      {/* =====================================================
          ADMIN LOGIN
      ===================================================== */}
      <div className="mt-7 border-t border-black/10 pt-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.14em] text-black/30">
          {t("mellaStaff")}
        </p>

        <Link
          href="/admin/login"
          className="mt-2 inline-block text-xs font-semibold text-black/45 transition hover:text-[#1681C5]"
        >
          {t("administratorLogin")} →
        </Link>
      </div>
    </AuthShell>
  );
}