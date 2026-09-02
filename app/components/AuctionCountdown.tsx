"use client";


import { useLanguage } from "../context/LanguageContext";

import { useEffect, useState } from "react";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdown(endsAt: string): Countdown {
  const remaining = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export default function AuctionCountdown({ endsAt }: { endsAt: string }) {
  const [countdown, setCountdown] = useState(() => getCountdown(endsAt));

  const { language } = useLanguage();

  useEffect(() => {
    const update = () => setCountdown(getCountdown(endsAt));
    const interval = setInterval(update, 1000);
    update();
    return () => clearInterval(interval);
  }, [endsAt]);

  const isAmharic = language === "am";

const parts = [
  countdown.days > 0
    ? `${countdown.days}${isAmharic ? "ቀ" : "d"}`
    : "",
  countdown.hours > 0
    ? `${countdown.hours}${isAmharic ? "ሰ" : "h"}`
    : "",
  countdown.minutes > 0
    ? `${countdown.minutes}${isAmharic ? "ደ" : "m"}`
    : "",
  `${countdown.seconds}${isAmharic ? "ሴ" : "s"}`,
].filter(Boolean);

  return <span>{parts.join(" : ")}</span>;
}
