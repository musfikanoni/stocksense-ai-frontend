export default function Avatar({
  name,
  size = 40,
  url,
  className = "",
}: {
  name: string;
  size?: number;
  url?: string | null;
  className?: string;
}) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover shrink-0 border border-gold/30 ${className}`}
      />
    );
  }
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
