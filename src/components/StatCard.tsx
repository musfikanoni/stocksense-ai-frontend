export default function StatCard({
  label,
  value,
  delta,
  note,
  up = true,
}: {
  label: string;
  value: string | number;
  delta: string;
  note: string;
  up?: boolean;
}) {
  return (
    <div className="card card-hover group !p-4 transition-all duration-300 hover:border-gold/40">
      <div className="flex items-center justify-between">
        <p className="text-xs text-mute group-hover:text-white/80 transition-colors">{label}</p>
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${up ? "bg-up" : "bg-down"} opacity-70 group-hover:opacity-100 transition-opacity`}
        />
      </div>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-white group-hover:text-gold transition-colors duration-200">
        {typeof value === "number" ? value.toLocaleString("en-US") : value}
      </p>
      <p className="mt-3 flex items-center justify-between text-xs">
        <span className="text-mute">{note}</span>
        <span
          className={`font-medium inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] ${
            up
              ? "bg-up/10 text-up border border-up/20"
              : "bg-down/10 text-down border border-down/20"
          }`}
        >
          {delta}
        </span>
      </p>
    </div>
  );
}
