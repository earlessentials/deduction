import { InlineBadge } from "@/components/InlineBadge";

export function CaseCompanion({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`noir-glow overflow-hidden border border-oxide/20 bg-midnight/80 ${
        compact ? "flex items-center gap-3 p-2" : "grid gap-4 p-4 sm:grid-cols-[150px_1fr]"
      }`}
    >
      <img
        src="/case/luci-companion.svg"
        alt="Luci, the case companion"
        className={`shrink-0 border border-brass/25 object-cover ${compact ? "h-14 w-14" : "h-36 w-full sm:w-36"}`}
      />
      <div className={compact ? "min-w-0" : ""}>
        <InlineBadge tone="brass">Luci</InlineBadge>
        <p className={`${compact ? "mt-1 text-xs" : "mt-3 text-sm"} leading-6 text-ink/72`}>
          The room tells one story. The timeline tells another.
        </p>
      </div>
    </div>
  );
}
