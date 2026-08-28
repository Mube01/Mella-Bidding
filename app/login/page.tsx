"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthShell from "../components/auth/AuthShell";
import { useLanguage } from "../context/LanguageContext";

type LoginResponse = {
  success?: boolean;
  message?: string;
  user?: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
    role?: "user" | "admin";
  };
};

type Notification = {
  type: "success" | "error";
  message: string;
};

export default function LoginPage() {
  const { t } = useLanguage();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [remember, setRemember] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [notification, setNotification] =
    useState<Notification | null>(null);

  const showNotification = (
    type: "success" | "error",
    message: string
  ) => {
    setNotification({
      type,
      message,
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setNotification(null);
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            phone: phone.trim(),
            password,
            remember,
          }),
        }
      );

      let data: LoginResponse = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        showNotification(
          "error",
          data.message ||
            t("loginFailed") ||
            "Login failed. Please check your phone number and password."
        );

        setLoading(false);
        return;
      }

      if (data.success === false) {
        showNotification(
          "error",
          data.message ||
            t("loginFailed") ||
            "Login failed. Please check your phone number and password."
        );

        setLoading(false);
        return;
      }

      showNotification(
        "success",
        data.message ||
          "Signed in successfully."
      );

      setTimeout(() => {
        window.location.href = "/";
      }, 700);
    } catch (error) {
      console.error(
        "LOGIN_ERROR:",
        error
      );

      showNotification(
        "error",
        t("somethingWentWrong") ||
          "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <AuthShell>
      {/* NOTIFICATION */}
      {notification && (
        <div
          role="alert"
          className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            notification.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />
          ) : (
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />
          )}

          <p className="flex-1 leading-5">
            {notification.message}
          </p>

          <button
            type="button"
            onClick={() =>
              setNotification(null)
            }
            className="shrink-0 rounded-md p-0.5 opacity-50 transition hover:bg-black/5 hover:opacity-100"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* HEADER */}
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

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        {/* PHONE */}
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
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
            />

            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="09XX XXX XXX"
              autoComplete="tel"
              inputMode="tel"
              required
              disabled={loading}
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10 disabled:cursor-not-allowed disabled:bg-black/[0.02] disabled:opacity-60"
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
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
            />

            <input
              id="password"
              name="password"
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
              disabled={loading}
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10 disabled:cursor-not-allowed disabled:bg-black/[0.02] disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
              }
              disabled={loading}
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-black/30 transition hover:bg-[#F78000]/10 hover:text-[#F78000] disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* REMEMBER ME */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) =>
              setRemember(
                event.target.checked
              )
            }
            disabled={loading}
            className="h-4 w-4 rounded border-black/20 accent-[#F78000] disabled:cursor-not-allowed"
          />

          <span className="text-xs text-black/50">
            {t("keepMeSignedIn")}
          </span>
        </label>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1681C5] text-sm font-bold text-white shadow-lg shadow-[#1681C5]/20 transition hover:bg-[#116d9f] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden="true"
              />

              <span>
                Signing in...
              </span>
            </>
          ) : (
            <>
              <span>
                {t("signIn")}
              </span>

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>

      {/* REGISTER */}
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

      {/* ADMIN LOGIN */}
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