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

  return (
    <div className="fixed top-5 left-1/2 z-50 flex -translate-x-1/2 w-[90%] max-w-md items-center justify-between gap-3 rounded-2xl p-4 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 border border-black/10 bg-white/95 text-black">
      <div className="flex items-center gap-3 min-w-0">
        {type === "success" ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        ) : (
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
        )}
        <p className="text-xs font-semibold sm:text-sm break-words">{message}</p>
      </div>
      <button
        onClick={onClose}
        type="button"
        className="rounded-lg p-1 text-black/40 hover:bg-black/5 hover:text-black transition"
      >
        <X size={16} />
      </button>
    </div>
  );
}