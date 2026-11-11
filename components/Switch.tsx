export default function Switch({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange}
      className={`h-6 w-11 shrink-0 rounded-full p-0.5 transition duration-200 ${on ? "bg-up" : "bg-line"}`}>
      <span className={`block h-5 w-5 rounded-full bg-white transition duration-200 ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}
