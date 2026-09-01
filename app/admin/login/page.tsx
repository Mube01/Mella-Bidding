"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthShell from "../../components/auth/AuthShell";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

type Notification = {
  type: "success" | "error";
  message: string;
} | null;

type LoginResponse = {
  success?: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    phone?: string;
    role?: "user" | "admin";
  };
};

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [notification, setNotification] =
    useState<Notification>(null);

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          remember,
          admin: true,
        }),
      });

      let data: LoginResponse = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok || !data.success) {
        showNotification(
          "error",
          data.message ||
            "Invalid administrator credentials."
        );

        setLoading(false);
        return;
      }

      if (data.user?.role !== "admin") {
        showNotification(
          "error",
          "This account does not have administrator access."
        );

        setLoading(false);
        return;
      }

      showNotification(
        "success",
        "Login successful. Redirecting..."
      );

      setTimeout(() => {
  router.replace("/admin");
}, 700);
    } catch (error) {
      console.error("ADMIN_LOGIN_ERROR:", error);

      showNotification(
        "error",
        "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <AuthShell admin>
      {/* =====================================================
          NOTIFICATION
      ===================================================== */}
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
            onClick={() => setNotification(null)}
            disabled={loading}
            className="shrink-0 opacity-50 transition hover:opacity-100 disabled:cursor-not-allowed"
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
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1681C5]/10 text-[#1681C5]">
            <ShieldCheck size={21} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1681C5]">
              MELLA ADMIN
            </p>

            <p className="mt-1 text-xs text-black/40">
              Administrator access
            </p>
          </div>
        </div>

        <h2 className="font-display text-4xl tracking-[-0.04em] sm:text-5xl">
          Sign in.
        </h2>

        <p className="mt-3 text-sm leading-6 text-black/45">
          Access the Mella administration dashboard.
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
            htmlFor="admin-email"
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45"
          >
            Admin Email
          </label>

          <div className="relative">
            <Mail
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
            />

            <input
              id="admin-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@mella.et"
              autoComplete="username"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
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
              htmlFor="admin-password"
              className="block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45"
            >
              Password
            </label>

            <Link
              href="/admin/forgot-password"
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
              id="admin-password"
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
              placeholder="Enter your password"
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
            disabled={loading}
            className="h-4 w-4 rounded border-black/20 accent-[#F78000]"
          />

          <span className="text-xs text-black/50">
            Keep me signed in
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

              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in to Admin</span>

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>

      {/* =====================================================
          SECURITY NOTICE
      ===================================================== */}
      <div className="mt-7 rounded-xl border border-[#F78000]/15 bg-[#F78000]/[0.03] p-4">
        <div className="flex gap-3">
          <div className="mt-0.5 shrink-0 text-[#F78000]">
            <ShieldCheck size={17} />
          </div>

          <div>
            <p className="text-xs font-semibold text-black">
              Authorized access only
            </p>

            <p className="mt-1 text-[11px] leading-5 text-black/40">
              This area is restricted to authorized
              Mella administrators. Administrative
              activity may be logged for security
              purposes.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          BACK TO USER LOGIN
      ===================================================== */}
      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="text-xs font-semibold text-black/45 transition hover:text-[#F78000]"
        >
          ← Back to user login
        </Link>
      </div>
    </AuthShell>
  );
}