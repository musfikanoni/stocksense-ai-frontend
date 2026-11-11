export default function ConfidenceRing({ value, size = 96 }: { value: number; size?: number }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const mid = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${value}% confidence`}>
      <circle cx={mid} cy={mid} r={r} fill="none" stroke="#2a2518" strokeWidth="8" />
      <circle cx={mid} cy={mid} r={r} fill="none" stroke="#3ddc84" strokeWidth="8" strokeLinecap="round"
        className="animate-ring" style={{ "--c": c } as React.CSSProperties} strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform={`rotate(-90 ${mid} ${mid})`} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={size / 4} fontWeight="700">{value}%</text>
    </svg>
  );
}
