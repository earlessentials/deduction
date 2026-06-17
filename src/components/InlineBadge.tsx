import { clsx } from "clsx";

const toneClass = {
  neutral: "border-ink/15 bg-midnight/70 text-ink",
  brass: "border-brass/35 bg-brass/10 text-ink",
  oxide: "border-oxide/35 bg-oxide/10 text-oxide",
  signal: "border-signal/35 bg-signal/10 text-signal"
};

export function InlineBadge({
  children,
  tone = "neutral"
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneClass;
}) {
  return (
    <span
      className={clsx(
        "inline-flex min-h-7 items-center border px-2 text-xs font-semibold uppercase tracking-wide",
        toneClass[tone]
      )}
    >
      {children}
    </span>
  );
}
