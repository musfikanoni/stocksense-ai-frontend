export default function StatCard({ label, value, delta, note, up = true }: { label: string; value: string | number; delta: string; note: string; up?: boolean }) {
  return (
    <div className="card card-hover !p-4">
      <p className="text-xs text-mute">{label}</p>
      <p className="mt-1 text-2xl font-bold">{typeof value === "number" ? value.toLocaleString("en-US") : value}</p>
      <p className="mt-3 flex justify-between text-xs"><span className="text-mute">{note}</span><span className={up ? "text-up" : "text-down"}>{delta}</span></p>
    </div>
  );
}
