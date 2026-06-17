import { InlineBadge } from "@/components/InlineBadge";
import { HypothesisBoard } from "@/components/hypotheses/HypothesisBoard";
import { getEvidence, getHypotheses } from "@/lib/data";

export default async function HypothesesPage() {
  const [hypotheses, evidence] = await Promise.all([getHypotheses(), getEvidence()]);

  return (
    <div className="space-y-6">
      <div>
        <InlineBadge tone="oxide">Hypothesis board</InlineBadge>
        <h1 className="mt-3 font-serif text-4xl font-semibold">Theory Tracking</h1>
      </div>
      <HypothesisBoard hypotheses={hypotheses} evidence={evidence} />
    </div>
  );
}
