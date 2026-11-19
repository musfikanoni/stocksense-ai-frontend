import { glossary } from "@/lib/glossary";

// Hover or keyboard-focus a term to see its plain-language meaning.
export default function Tip({ term, children }: { term: string; children: React.ReactNode }) {
  const text = glossary[term];
  if (!text) return <>{children}</>;
  return (
    <span className="group relative cursor-help border-b border-dotted border-mute" tabIndex={0}>
      {children}
      <span role="tooltip" className="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden w-56 animate-fade-in rounded-lg border border-line bg-panel p-2 text-xs font-normal text-mute group-hover:block group-focus:block">{text}</span>
    </span>
  );
}
