"use client";

import { useMemo } from "react";
import { CheckCircle2, GitBranch } from "lucide-react";
import { InlineBadge } from "@/components/InlineBadge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Evidence, Hypothesis, HypothesisStatus } from "@/types/game";

const statuses: HypothesisStatus[] = [
  "unsupported",
  "possible",
  "probable",
  "proven",
  "contradicted"
];

const statusTone: Record<HypothesisStatus, "neutral" | "brass" | "oxide" | "signal"> = {
  unsupported: "neutral",
  possible: "brass",
  probable: "oxide",
  proven: "oxide",
  contradicted: "signal"
};

export function HypothesisBoard({
  hypotheses,
  evidence
}: {
  hypotheses: Hypothesis[];
  evidence: Evidence[];
}) {
  const initialStatuses = Object.fromEntries(
    hypotheses.map((hypothesis) => [hypothesis.id, hypothesis.suggestedStatus])
  ) as Record<string, HypothesisStatus>;
  const [statusById, setStatusById] = useLocalStorage<Record<string, HypothesisStatus>>(
    "lucid-hour:hypotheses",
    initialStatuses
  );

  const evidenceById = useMemo(() => new Map(evidence.map((item) => [item.id, item])), [evidence]);

  function setStatus(id: string, status: HypothesisStatus) {
    setStatusById((current) => ({ ...current, [id]: status }));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {hypotheses.map((hypothesis) => {
        const status = statusById[hypothesis.id] ?? hypothesis.suggestedStatus;
        return (
          <article key={hypothesis.id} className="case-panel p-5">
            <div className="flex flex-wrap items-center gap-2">
              <InlineBadge tone={statusTone[status]}>{status}</InlineBadge>
              <div className="flex items-center gap-2 text-sm font-semibold text-oxide">
                <GitBranch className="h-4 w-4" />
                Hypothesis
              </div>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold">{hypothesis.title}</h2>
            <p className="mt-3 leading-7 text-ink/70">{hypothesis.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {hypothesis.evidenceIds.map((id) => {
                const item = evidenceById.get(id);
                return (
                  <InlineBadge key={id} tone={item?.isCritical ? "signal" : "neutral"}>
                    {id}
                  </InlineBadge>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {statuses.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatus(hypothesis.id, item)}
                  className={`focus-ring flex h-10 items-center justify-center gap-1 border px-2 text-xs font-semibold capitalize ${
                    status === item
                      ? "border-oxide bg-oxide text-paper"
                      : "border-ink/10 bg-midnight/75 text-ink"
                  }`}
                >
                  {status === item ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                  {item}
                </button>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
