import { CaseCompanion } from "@/components/CaseCompanion";
import { InlineBadge } from "@/components/InlineBadge";
import { FinalReportForm } from "@/components/final-report/FinalReportForm";
import { getCase, getCharacters, getEvidence, getLocations } from "@/lib/data";
import type { Character } from "@/types/game";

export default async function FinalReportPage() {
  const [gameCase, characters, locations, evidence] = await Promise.all([
    getCase(),
    getCharacters(),
    getLocations(),
    getEvidence()
  ]);
  const suspects = gameCase.briefing.initialSuspects
    .map((id) => characters.find((character) => character.id === id))
    .filter((character): character is Character => Boolean(character));

  return (
    <div className="space-y-6">
      <div>
        <InlineBadge tone="signal">Final deduction</InlineBadge>
        <h1 className="mt-3 font-serif text-4xl font-semibold">Deduction Report</h1>
      </div>
      <CaseCompanion />
      <FinalReportForm suspects={suspects} locations={locations} evidence={evidence} />
    </div>
  );
}
