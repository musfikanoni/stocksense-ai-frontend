// src/utils/format.ts
/** Format a number as USD currency */
export const usd = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

/** Build stock detail href */
export const stockHref = (symbol: string, from?: string) =>
  `/stocks/${symbol}${from ? `?from=${from}` : ""}`;

/** Render star rating string */
export const starRating = (rating: number) => ({
  filled: "★".repeat(rating),
  empty: "☆".repeat(Math.max(0, 5 - rating)),
});

/** Extract initials from a name */
export const getInitials = (name: string) =>
  (name || "U")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";
