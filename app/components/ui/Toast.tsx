"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  type = "error",
  isOpen,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`
        pointer-events-none fixed left-1/2 top-5 z-[2147483647]
        flex w-[90%] max-w-md -translate-x-1/2
        items-center justify-between gap-3
        rounded-2xl border p-4
        shadow-2xl backdrop-blur-md
        transition-all duration-300
        animate-in fade-in slide-in-from-top-4
        ${
          isSuccess
            ? "border-emerald-300 bg-emerald-50/95 text-emerald-900"
            : "border-red-300 bg-red-50/95 text-red-900"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        {isSuccess ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        ) : (
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
        )}

        <p className="break-words text-xs font-semibold sm:text-sm">
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        type="button"
        className={`
          pointer-events-auto shrink-0 rounded-lg p-1 transition
          ${
            isSuccess
              ? "text-emerald-600/60 hover:bg-emerald-100 hover:text-emerald-800"
              : "text-red-600/60 hover:bg-red-100 hover:text-red-800"
          }
        `}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}