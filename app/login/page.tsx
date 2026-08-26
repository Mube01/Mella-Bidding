"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthShell from "../components/auth/AuthShell";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // TODO:
    // Connect this to your real user authentication API.

    console.log({
      email,
      password,
      remember,
    });
  };

  return (
    <AuthShell>

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#F78000]/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[#F78000]">
          <UserRound size={13} />
          MELLA ACCOUNT
        </div>

        <h2 className="font-display text-4xl tracking-[-0.04em] sm:text-5xl">
          Welcome back.
        </h2>

        <p className="mt-3 text-sm leading-6 text-black/45">
          Sign in to your Mella account and continue
          participating in auctions.
        </p>

      </div>

      {/* =====================================================
          FORM
      ===================================================== */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        {/* EMAIL */}
        <div>

          <label
            htmlFor="email"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45"
          >
            Email Address
          </label>

          <div className="relative">

            <Mail
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
            />

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10"
            />

          </div>

        </div>

        {/* PASSWORD */}
        <div>

          <div className="mb-2 flex items-center justify-between">

            <label
              htmlFor="password"
              className="block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#F78000] transition hover:text-[#d96d00] hover:underline"
            >
              Forgot password?
            </Link>

          </div>

          <div className="relative">

            <LockKeyhole
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((value) => !value)
              }
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-black/30 transition hover:bg-[#F78000]/10 hover:text-[#F78000]"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
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
              setRemember(event.target.checked)
            }
            className="h-4 w-4 rounded border-black/20 accent-[#F78000]"
          />

          <span className="text-xs text-black/50">
            Keep me signed in
          </span>

        </label>

        {/* SUBMIT */}
        <button
          type="submit"
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1681C5] text-sm font-bold text-white shadow-lg shadow-[#1681C5]/20 transition hover:bg-[#116d9f] active:scale-[0.99]"
        >
          Sign in

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
          Don't have a Mella account?
        </p>

        <Link
          href="/register"
          className="mt-2 inline-block text-sm font-bold text-[#F78000] transition hover:text-[#d96d00] hover:underline"
        >
          Create an account
        </Link>

      </div>

      {/* =====================================================
          ADMIN LOGIN
      ===================================================== */}
      <div className="mt-7 border-t border-black/10 pt-6 text-center">

        <p className="text-[10px] uppercase tracking-[0.14em] text-black/30">
          Mella Staff
        </p>

        <Link
          href="/admin/login"
          className="mt-2 inline-block text-xs font-semibold text-black/45 transition hover:text-[#1681C5]"
        >
          Administrator login →
        </Link>

      </div>

    </AuthShell>
  );
}