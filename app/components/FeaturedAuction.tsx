import { Clock3, Users } from "lucide-react";
import type { Auction } from "./data";

export default function FeaturedAuction({
  auction,
}: {
  auction: Auction;
}) {
  return (
    <div className="relative">
      <div className="absolute -inset-10 rounded-[3rem] bg-gradient-to-r from-violet-400/20 via-blue-400/10 to-emerald-400/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[1.8rem] border border-black/10 bg-white shadow-2xl">
        <div className="relative aspect-[4/4.3] overflow-hidden">
          <img
            src={auction.image}
            alt={auction.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-[#F78000] px-3 py-1.5 text-[9px] font-bold tracking-[0.18em] text-white shadow-lg">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            LIVE AUCTION
          </div>

          <div className="absolute inset-x-5 bottom-5 text-white">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold tracking-[0.22em] text-white/60">
                  FEATURED AUCTION
                </p>

                <h2 className="mt-1 font-display text-3xl sm:text-4xl">
                  {auction.title}
                </h2>

                <p className="mt-1 text-sm text-white/65">
                  {auction.subtitle}
                </p>
              </div>

              <div className="shrink-0 rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-right backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Clock3 size={12} className="text-[#F78000]" />

                  <p className="text-[8px] tracking-[0.18em] text-white/50">
                    ENDS IN
                  </p>
                </div>

                <p className="mt-1 font-mono text-lg font-bold text-red-600">
                  {auction.time}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/20 pt-4 text-xs text-white/65">
              <span className="flex items-center gap-2">
                <Users size={13} />
                {auction.participants} participants
              </span>

              <span>
                Entry from{" "}
                <b className="text-white">
                  {auction.entry}
                </b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}