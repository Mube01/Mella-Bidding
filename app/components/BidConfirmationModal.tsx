"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

type BidConfirmationModalProps = {
  isOpen: boolean;
  auctionTitle: string;
  bidAmount: number;
  serviceFee: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export default function BidConfirmationModal({
  isOpen,
  auctionTitle,
  bidAmount,
  serviceFee,
  onConfirm,
  onCancel,
  isLoading = false,
}: BidConfirmationModalProps) {
  const { language } = useLanguage();

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  /*
   * Reset checkbox every time modal opens.
   */
  useEffect(() => {
    if (isOpen) {
      setAgreeToTerms(false);
    }
  }, [isOpen]);

  /*
   * Lock page scrolling while modal is open.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (
          event.target === event.currentTarget &&
          !isLoading
        ) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bid-confirmation-title"
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        {/* =================================================
            CLOSE BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-black/40 transition hover:bg-black/5 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={
            language === "am"
              ? "ዝጋ"
              : "Close"
          }
        >
          <X size={20} />
        </button>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 pr-8">
          <h2
            id="bid-confirmation-title"
            className="text-lg font-semibold text-black"
          >
            {language === "am"
              ? "መጫረቻ ያረጋግጡ"
              : "Confirm Your Bid"}
          </h2>

          <p className="mt-1 text-sm text-black/50">
            {language === "am"
              ? "ከማረጋገጥዎ በፊት ሁሉንም ዝርዝሮች ይመልከቱ"
              : "Review all details before confirming"}
          </p>
        </div>

        {/* =================================================
            AUCTION DETAILS
        ================================================= */}

        <div className="mb-6 space-y-3 rounded-xl border border-black/10 bg-black/[0.02] p-4">
          {/* ITEM */}

          <div className="flex items-start justify-between gap-4">
            <span className="text-sm text-black/60">
              {language === "am"
                ? "የጨረታ እቃ"
                : "Auction Item"}
            </span>

            <span className="text-right font-semibold text-black">
              {auctionTitle}
            </span>
          </div>

          {/* BID */}

          <div className="border-t border-black/10 pt-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-black/60">
                {language === "am"
                  ? "የመጫረቻ መጠን"
                  : "Bid Amount"}
              </span>

              <span className="font-mono font-bold text-[#F78000]">
                ETB {bidAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* SERVICE FEE */}

          <div className="border-t border-black/10 pt-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-black/60">
                {language === "am"
                  ? "አገልግሎት ክፍያ"
                  : "Service Fee"}
              </span>

              <span className="font-mono font-bold text-[#1681C5]">
                ETB {serviceFee.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            NON REFUNDABLE NOTICE
        ================================================= */}

        <div className="mb-6 space-y-2 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-semibold text-red-700">
            {language === "am"
              ? "⚠️ የማይመለስ ክፍያ"
              : "⚠️ Non-Refundable"}
          </p>

          <p className="text-xs leading-5 text-red-600">
            {language === "am"
              ? "የአገልግሎት ክፍያው ከተከፈለ በኋላ ተመላሽ አይሆንም።"
              : "The service fee is non-refundable once the bid is submitted."}
          </p>
        </div>

        {/* =================================================
            TERMS
        ================================================= */}

        <div className="mb-6 max-h-40 overflow-y-auto rounded-xl border border-black/10 bg-black/[0.02] p-4">
          <div className="space-y-4 text-xs leading-5 text-black/70">
            {/* LOWEST UNIQUE BID */}

            <div>
              <p className="mb-1 font-semibold text-black">
                {language === "am"
                  ? "ዝቅተኛ ልዩ መጫረቻ"
                  : "Lowest Unique Bid"}
              </p>

              <p>
                {language === "am"
                  ? "አሸናፊው በጨረታው ውስጥ ዝቅተኛውን ልዩ መጫረቻ ያስገባ ተሳታፊ ነው። ተመሳሳይ መጠን በብዙ ተሳታፊዎች ከተጫረተ ያ መጠን ልዩ አይሆንም።"
                  : "The winner is the participant who places the lowest unique bid. A bid amount is not considered unique if multiple participants submit the same amount."}
              </p>
            </div>

            {/* SERVICE FEE */}

            <div>
              <p className="mb-1 font-semibold text-black">
                {language === "am"
                  ? "አገልግሎት ክፍያ"
                  : "Service Fee"}
              </p>

              <p>
                {language === "am"
                  ? "የአገልግሎት ክፍያው ተመላሽ አይሆንም።"
                  : "The service fee is non-refundable."}
              </p>
            </div>

            {/* WINNER PAYMENT */}

            <div>
              <p className="mb-1 font-semibold text-black">
                {language === "am"
                  ? "የአሸናፊ ክፍያ"
                  : "Winner Payment"}
              </p>

              <p>
                {language === "am"
                  ? "አሸናፊው ያስገባውን የመጫረቻ መጠን ሙሉ በሙሉ መክፈል አለበት።"
                  : "The winner must pay the full winning bid amount."}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            TERMS AGREEMENT
        ================================================= */}

        <div className="mb-6 flex items-start gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-4">
          <input
            type="checkbox"
            id="terms-agree"
            checked={agreeToTerms}
            onChange={(event) =>
              setAgreeToTerms(
                event.target.checked
              )
            }
            disabled={isLoading}
            className="mt-1 h-4 w-4 cursor-pointer rounded border-black/30 accent-[#F78000] disabled:cursor-not-allowed"
          />

          <label
            htmlFor="terms-agree"
            className="flex-1 cursor-pointer text-xs leading-5 text-black/70"
          >
            {language === "am"
              ? "ሁሉንም ውሎች እና ሁኔታዎች ተረድቻለሁ እና ተስማምቻለሁ።"
              : "I understand and agree to all terms and conditions."}
          </label>
        </div>

        {/* =================================================
            CONFIRM BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={onConfirm}
          disabled={
            isLoading ||
            !agreeToTerms
          }
          className="w-full rounded-xl bg-[#F78000] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#D96E00] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? language === "am"
              ? "በመላክ ላይ..."
              : "Submitting..."
            : language === "am"
              ? "መጫረቻ ያረጋግጡ"
              : "Confirm Bid"}
        </button>
      </div>
    </div>
  );
}