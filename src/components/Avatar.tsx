"use client";

import { useState } from "react";

export default function Avatar({
  name,
  size = 40,
  url,
  className = "",
  showInitials = false,
}: {
  name: string;
  size?: number;
  url?: string | null;
  className?: string;
  showInitials?: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  if (url && !imgFailed) {
    return (
      <img
        src={url}
        alt={name}
        onError={() => setImgFailed(true)}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover shrink-0 border border-gold/30 ${className}`}
      />
    );
  }

  if (showInitials) {
    const initials =
      (name || "U")
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "U";

    return (
      <span
        aria-hidden="true"
        style={{ width: size, height: size, fontSize: size * 0.36 }}
        className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-dark to-gold font-semibold text-ink ${className}`}
      >
        {initials}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`grid shrink-0 place-items-center rounded-full bg-white/10 text-gold/80 border border-gold/30 ${className}`}
      title={name}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: size * 0.58, height: size * 0.58 }}
        className="opacity-80"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </span>
  );
}

