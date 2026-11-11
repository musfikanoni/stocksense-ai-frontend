const colors = ["#e5484d", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

// Letter badge instead of real brand logos (brand logos are trademarked images).
export default function CompanyLogo({ symbol, size = 36 }: { symbol: string; size?: number }) {
  const apple = symbol === "AAPL";
  const bg = apple ? "#ffffff" : colors[[...symbol].reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length];
  return (
    <span aria-hidden="true" style={{ width: size, height: size, background: bg, fontSize: size * 0.32 }}
      className={`grid shrink-0 place-items-center rounded-full font-bold ${apple ? "text-black" : "text-white"}`}>
      {symbol.slice(0, apple ? 1 : 2)}
    </span>
  );
}
