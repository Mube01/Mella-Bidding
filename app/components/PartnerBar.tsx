export default function PartnerBar() {
  return (
    <div className="border-b border-black/5 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-10">
        
        {/* Ethio telecom - LEFT */}
        <div className="rounded-lg bg-white px-2 py-1">
          <img
            src="/images/ethio-telecom.png"
            alt="Ethio telecom"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Telebirr - RIGHT */}
        <div className="rounded-lg bg-white px-2 py-1">
          <img
            src="/images/telebirr.png"
            alt="Telebirr"
            className="h-8 w-auto object-contain"
          />
        </div>

      </div>
    </div>
  );
}