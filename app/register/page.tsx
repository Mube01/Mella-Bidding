"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthShell from "../components/auth/AuthShell";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [terms, setTerms] = useState(false);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!terms) {
      alert("Please accept the Terms & Conditions.");
      return;
    }

    // TODO:
    // Connect this to your real registration API.

    console.log({
      name,
      phone,
      email,
      password,
      confirmPassword,
      terms,
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
          JOIN MELLA
        </div>

        <h2 className="font-display text-4xl tracking-[-0.04em] sm:text-5xl">
          Create your account.
        </h2>

        <p className="mt-3 text-sm leading-6 text-black/45">
          Create your Mella account and start participating
          in exciting auctions.
        </p>

      </div>

      {/* =====================================================
          FORM
      ===================================================== */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4"
      >

        {/* NAME */}
        <div>

          <label
            htmlFor="name"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45"
          >
            Full Name
          </label>

          <div className="relative">

            <UserRound
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
            />

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Your full name"
              autoComplete="name"
              required
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10"
            />

          </div>

        </div>

        {/* PHONE */}
        <div>

          <label
            htmlFor="phone"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45"
          >
            Phone Number
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
              required
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10"
            />

          </div>

        </div>

        {/* EMAIL */}
        <div>

          <label
            htmlFor="register-email"
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
              id="register-email"
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

          <label
            htmlFor="register-password"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45"
          >
            Password
          </label>

          <div className="relative">

            <LockKeyhole
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
            />

            <input
              id="register-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Create a password"
              autoComplete="new-password"
              required
              minLength={8}
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

          <p className="mt-2 text-[10px] text-black/30">
            Password must contain at least 8 characters.
          </p>

        </div>

        {/* CONFIRM PASSWORD */}
        <div>

          <label
            htmlFor="confirm-password"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45"
          >
            Confirm Password
          </label>

          <div className="relative">

            <LockKeyhole
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
            />

            <input
              id="confirm-password"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (value) => !value
                )
              }
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-black/30 transition hover:bg-[#F78000]/10 hover:text-[#F78000]"
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>

          </div>

        </div>

        {/* TERMS */}
        <label className="flex cursor-pointer items-start gap-3 pt-2">

          <input
            type="checkbox"
            checked={terms}
            onChange={(event) =>
              setTerms(event.target.checked)
            }
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-black/20 accent-[#F78000]"
          />

          <span className="text-xs leading-5 text-black/45">

            I agree to Mella's{" "}

            <Link
              href="/terms"
              className="font-semibold text-[#F78000] hover:underline"
            >
              Terms & Conditions
            </Link>{" "}

            and{" "}

            <Link
              href="/privacy"
              className="font-semibold text-[#F78000] hover:underline"
            >
              Privacy Policy
            </Link>

          </span>

        </label>

        {/* SUBMIT */}
        <button
          type="submit"
          className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1681C5] text-sm font-bold text-white shadow-lg shadow-[#1681C5]/20 transition hover:bg-[#116d9f] active:scale-[0.99]"
        >
          Create Account

          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />

        </button>

      </form>

      {/* =====================================================
          LOGIN
      ===================================================== */}
      <div className="mt-8 text-center">

        <p className="text-sm text-black/40">
          Already have a Mella account?
        </p>

        <Link
          href="/login"
          className="mt-2 inline-block text-sm font-bold text-[#F78000] transition hover:text-[#d96d00] hover:underline"
        >
          Sign in
        </Link>

      </div>

    </AuthShell>
  );
}