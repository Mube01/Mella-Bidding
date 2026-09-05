"use client";

import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  Phone,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthShell from "../components/auth/AuthShell";
import { useLanguage } from "../context/LanguageContext";

type Step = "phone" | "code" | "password" | "success";

export default function ForgotPasswordPage() {
  const { language } = useLanguage();
  const isAmharic = language === "am";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const handlePhoneSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!phone.trim()) {
      setError(
        isAmharic
          ? "እባክዎ የስልክ ቁጥርዎን ያስገቡ።"
          : "Please enter your phone number."
      );
      return;
    }

    // UI only for now
    setStep("code");
  };

  const handleCodeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError(
        isAmharic
          ? "እባክዎ 6 አሃዝ ያለውን ኮድ ያስገቡ።"
          : "Please enter the 6-digit code."
      );
      return;
    }

    // UI only for now
    setStep("password");
  };

  const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError(
        isAmharic
          ? "እባክዎ ሁለቱንም የይለፍ ቃል መስኮች ይሙሉ።"
          : "Please fill in both password fields."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        isAmharic
          ? "የይለፍ ቃሉ ቢያንስ 8 ቁምፊዎች ሊኖሩት ይገባል።"
          : "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        isAmharic
          ? "የይለፍ ቃሎቹ አይመሳሰሉም።"
          : "Passwords do not match."
      );
      return;
    }

    // UI only for now
    setStep("success");
  };

  const handleResend = () => {
    setCode("");
    setError("");
    // SMS logic will be added later
  };

  const goBack = () => {
    setError("");

    if (step === "code") {
      setStep("phone");
    } else if (step === "password") {
      setStep("code");
    }
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md">
        {/* Back to login */}
        {step !== "success" && (
          <Link
            href="/login"
            className="mb-8 inline-flex items-center gap-2 text-sm text-black/50 transition hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            {isAmharic ? "ወደ መግቢያ ተመለስ" : "Back to login"}
          </Link>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#1681C5]/10">
            {step === "phone" && (
              <Phone className="h-5 w-5 text-[#1681C5]" />
            )}

            {step === "code" && (
              <ShieldCheck className="h-5 w-5 text-[#1681C5]" />
            )}

            {step === "password" && (
              <LockKeyhole className="h-5 w-5 text-[#1681C5]" />
            )}

            {step === "success" && (
              <CheckCircle2 className="h-5 w-5 text-[#1681C5]" />
            )}
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-black">
            {step === "phone" &&
              (isAmharic ? "የይለፍ ቃልዎን መልሰው ያግኙ" : "Forgot password?")}

            {step === "code" &&
              (isAmharic ? "የማረጋገጫ ኮድ" : "Enter verification code")}

            {step === "password" &&
              (isAmharic ? "አዲስ የይለፍ ቃል" : "Create new password")}

            {step === "success" &&
              (isAmharic ? "የይለፍ ቃል ተቀይሯል" : "Password reset")}
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/50">
            {step === "phone" &&
              (isAmharic
                ? "ከመለያዎ ጋር የተገናኘውን ስልክ ቁጥር ያስገቡ። የማረጋገጫ ኮድ እንልክልዎታለን።"
                : "Enter the phone number linked to your account. We'll send you a verification code.")}

            {step === "code" &&
              (isAmharic
                ? `ወደ ${phone} የተላከውን 6 አሃዝ ኮድ ያስገቡ።`
                : `Enter the 6-digit code sent to ${phone}.`)}

            {step === "password" &&
              (isAmharic
                ? "መለያዎን ለመጠበቅ አዲስ የይለፍ ቃል ይፍጠሩ።"
                : "Create a new password to secure your account.")}

            {step === "success" &&
              (isAmharic
                ? "የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል።"
                : "Your password has been successfully reset.")}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* STEP 1 — PHONE */}
        {step === "phone" && (
          <form onSubmit={handlePhoneSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                {isAmharic ? "ስልክ ቁጥር" : "Phone number"}
              </label>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isAmharic ? "09xxxxxxxx" : "09xxxxxxxx"}
                  className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-2 focus:ring-[#1681C5]/10"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1681C5] text-sm font-semibold text-white transition hover:bg-[#126da5] active:scale-[0.99]"
            >
              {isAmharic ? "ኮድ ላክ" : "Send verification code"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* STEP 2 — CODE */}
        {step === "code" && (
          <form onSubmit={handleCodeSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                {isAmharic ? "የማረጋገጫ ኮድ" : "Verification code"}
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, ""))
                }
                placeholder="000000"
                className="h-14 w-full rounded-xl border border-black/10 bg-white px-4 text-center text-xl font-semibold tracking-[0.5em] outline-none transition placeholder:text-black/20 focus:border-[#1681C5] focus:ring-2 focus:ring-[#1681C5]/10"
              />
            </div>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1681C5] text-sm font-semibold text-white transition hover:bg-[#126da5] active:scale-[0.99]"
            >
              {isAmharic ? "አረጋግጥ" : "Verify code"}
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-1 text-sm">
              <span className="text-black/40">
                {isAmharic ? "ኮድ አልደረሰዎትም?" : "Didn't receive the code?"}
              </span>

              <button
                type="button"
                onClick={handleResend}
                className="font-medium text-[#1681C5] hover:underline"
              >
                {isAmharic ? "እንደገና ላክ" : "Resend"}
              </button>
            </div>

            <button
              type="button"
              onClick={goBack}
              className="mx-auto flex items-center gap-2 text-sm text-black/45 transition hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              {isAmharic ? "ተመለስ" : "Go back"}
            </button>
          </form>
        )}

        {/* STEP 3 — NEW PASSWORD */}
        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                {isAmharic ? "አዲስ የይለፍ ቃል" : "New password"}
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    isAmharic ? "አዲስ የይለፍ ቃል" : "Enter new password"
                  }
                  className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-2 focus:ring-[#1681C5]/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                {isAmharic
                  ? "የይለፍ ቃሉን ያረጋግጡ"
                  : "Confirm password"}
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={
                    isAmharic
                      ? "የይለፍ ቃሉን እንደገና ያስገቡ"
                      : "Re-enter your password"
                  }
                  className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-black/25 focus:border-[#1681C5] focus:ring-2 focus:ring-[#1681C5]/10"
                />
              </div>
            </div>

            <p className="text-xs text-black/40">
              {isAmharic
                ? "የይለፍ ቃሉ ቢያንስ 8 ቁምፊዎች ሊኖሩት ይገባል።"
                : "Password must be at least 8 characters."}
            </p>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1681C5] text-sm font-semibold text-white transition hover:bg-[#126da5] active:scale-[0.99]"
            >
              {isAmharic ? "የይለፍ ቃል ቀይር" : "Reset password"}
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={goBack}
              className="mx-auto flex items-center gap-2 text-sm text-black/45 transition hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              {isAmharic ? "ተመለስ" : "Go back"}
            </button>
          </form>
        )}

        {/* STEP 4 — SUCCESS */}
        {step === "success" && (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1681C5]/10">
                <CheckCircle2 className="h-8 w-8 text-[#1681C5]" />
              </div>
            </div>

            <Link
              href="/login"
              className="mx-auto flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1681C5] text-sm font-semibold text-white transition hover:bg-[#126da5] active:scale-[0.99]"
            >
              {isAmharic ? "ወደ መግቢያ ሂድ" : "Go to login"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Footer */}
        {step !== "success" && (
          <p className="mt-8 text-center text-sm text-black/45">
            {isAmharic
              ? "መለያ የለዎትም?"
              : "Don't have an account?"}{" "}
            <Link
              href="/register"
              className="font-medium text-[#1681C5] hover:underline"
            >
              {isAmharic ? "ይመዝገቡ" : "Create an account"}
            </Link>
          </p>
        )}
      </div>
    </AuthShell>
  );
}
