"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Phone,
  UserRound,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthShell from "../components/auth/AuthShell";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useLanguage } from "../context/LanguageContext";

export default function RegisterPage() {
  const { t } = useLanguage();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [terms, setTerms] = useState(false);

  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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

    if (loading) return;

    setNotification(null);

    if (password !== confirmPassword) {
      showNotification(
        "error",
        t("passwordsDoNotMatch")
      );
      return;
    }

    if (!terms) {
      showNotification(
        "error",
        t("pleaseAcceptTerms")
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showNotification(
          "error",
          data.message ||
            t("registrationFailed")
        );

        setLoading(false);
        return;
      }

      /*
       * Registration should automatically sign
       * the user in.
       *
       * The API should create the authentication
       * session/cookie during registration.
       *
       * We therefore go directly to the main
       * application instead of /login.
       */
      showNotification(
        "success",
        data.message ||
          "Account created successfully."
      );

      /*
       * Give the user a very short moment to see
       * the success notification before entering
       * the application.
       */
      setTimeout(() => {
        window.location.href = "/";
      }, 700);
    } catch {
      showNotification(
        "error",
        t("somethingWentWrong")
      );

      setLoading(false);
    }
  };

  return (
    <AuthShell>
      {/* =====================================================
          NOTIFICATION
      ===================================================== */}
      {notification && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            notification.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
          role="alert"
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
            className="shrink-0 opacity-50 transition hover:opacity-100"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#F78000]/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[#F78000]">
          <UserRound size={13} />

          {t("joinMella")}
        </div>

        <h2 className="font-display text-4xl tracking-[-0.04em] sm:text-5xl">
          {t("createYourAccount")}
        </h2>

        <p className="mt-3 text-sm leading-6 text-black/45">
          {t("registerPageDescription")}
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
            {t("fullName")}
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
              placeholder={t("yourFullName")}
              autoComplete="name"
              required
              disabled={loading}
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10 disabled:cursor-not-allowed disabled:bg-black/[0.02]"
            />
          </div>
        </div>

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
              disabled={loading}
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10 disabled:cursor-not-allowed disabled:bg-black/[0.02]"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label
            htmlFor="register-password"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45"
          >
            {t("password")}
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
              placeholder={t("createPassword")}
              autoComplete="new-password"
              required
              minLength={8}
              disabled={loading}
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10 disabled:cursor-not-allowed disabled:bg-black/[0.02]"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
              }
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-black/30 transition hover:bg-[#F78000]/10 hover:text-[#F78000] disabled:cursor-not-allowed"
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

          <p className="mt-2 text-[10px] text-black/30">
            {t("passwordRequirement")}
          </p>
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45"
          >
            {t("confirmPassword")}
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
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder={t(
                "confirmYourPassword"
              )}
              autoComplete="new-password"
              required
              disabled={loading}
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-4 focus:ring-[#1681C5]/10 disabled:cursor-not-allowed disabled:bg-black/[0.02]"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setShowConfirmPassword(
                  (value) => !value
                )
              }
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-black/30 transition hover:bg-[#F78000]/10 hover:text-[#F78000] disabled:cursor-not-allowed"
              aria-label={
                showConfirmPassword
                  ? t("hidePassword")
                  : t("showPassword")
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
              setTerms(
                event.target.checked
              )
            }
            required
            disabled={loading}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-black/20 accent-[#F78000]"
          />

          <span className="text-xs leading-5 text-black/45">
            {t("agreeToMella")}{" "}

            <Link
              href="/terms"
              className="font-semibold text-[#F78000] hover:underline"
            >
              {t("termsAndConditions")}
            </Link>{" "}

            {t("and")}{" "}

            <Link
              href="/privacy"
              className="font-semibold text-[#F78000] hover:underline"
            >
              {t("privacyPolicy")}
            </Link>
          </span>
        </label>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1681C5] text-sm font-bold text-white shadow-lg shadow-[#1681C5]/20 transition hover:bg-[#116d9f] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <LoadingSpinner
                size="sm"
                className="border-white/30 border-t-white"
              />

              <span>
                Creating account...
              </span>
            </>
          ) : (
            <>
              <span>
                {t("createAccount")}
              </span>

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>

      {/* =====================================================
          LOGIN
      ===================================================== */}
      <div className="mt-8 text-center">
        <p className="text-sm text-black/40">
          {t("alreadyHaveAccount")}
        </p>

        <Link
          href="/login"
          className="mt-2 inline-block text-sm font-bold text-[#F78000] transition hover:text-[#d96d00] hover:underline"
        >
          {t("signIn")}
        </Link>
      </div>
    </AuthShell>
  );
}