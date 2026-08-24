export default function PaymentPartners() {
  return (
    <div className="mt-12 border-t border-black/10 pt-7">
      <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
        Powered by
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="px-4 py-2">
          <img
            src="/images/ethio-telecom.png"
            alt="Ethio telecom"
            className="h-7 w-auto object-contain"
          />
        </div>
        <div className="px-4 py-2">
          <img
            src="/images/telebirr.png"
            alt="Telebirr"
            className="h-7 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}