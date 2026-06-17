import { InlineBadge } from "@/components/InlineBadge";
import { SuspectEliminationBoard } from "@/components/elimination/SuspectEliminationBoard";
import { getCase, getCharacters, getEvidence } from "@/lib/data";
import type { Character } from "@/types/game";

export default async function EliminationPage() {
  const [gameCase, characters, evidence] = await Promise.all([
    getCase(),
    getCharacters(),
    getEvidence()
  ]);
  const suspects = gameCase.briefing.initialSuspects
    .map((id) => characters.find((character) => character.id === id))
    .filter((character): character is Character => Boolean(character));

  return (
    <div className="space-y-6">
      <div>
        <InlineBadge tone="signal">Suspect elimination</InlineBadge>
        <h1 className="mt-3 font-serif text-4xl font-semibold">Alternative Suspects</h1>
      </div>
      <SuspectEliminationBoard suspects={suspects} evidence={evidence} />
    </div>
  );
}
