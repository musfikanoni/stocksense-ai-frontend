"use client";

import { useState } from "react";

const colors = ["#e5484d", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function CompanyLogo({ symbol, size = 36 }: { symbol: string; size?: number }) {
  const [error, setError] = useState(false);
  const apple = symbol === "AAPL";
  const bg = apple ? "#ffffff" : colors[[...symbol].reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length];
  const logoUrl = `https://assets.parqet.com/logos/symbol/${symbol}`;

  if (!error) {
    return (
      <span
        style={{ width: size, height: size }}
        className="relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-white/10 p-1 border border-white/10"
      >
        <img
          src={logoUrl}
          alt={`${symbol} logo`}
          width={size}
          height={size}
          className="h-full w-full object-contain rounded-full"
          onError={() => setError(true)}
          loading="lazy"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.32 }}
      className={`grid shrink-0 place-items-center rounded-full font-bold ${apple ? "text-black" : "text-white"}`}
    >
      {symbol.slice(0, apple ? 1 : 2)}
    </span>
  );
}
