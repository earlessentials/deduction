import { InlineBadge } from "@/components/InlineBadge";
import { EvidenceLocker } from "@/components/evidence/EvidenceLocker";
import { getCharacters, getEvidence, getLocations } from "@/lib/data";

export default async function EvidencePage() {
  const [evidence, characters, locations] = await Promise.all([
    getEvidence(),
    getCharacters(),
    getLocations()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <InlineBadge tone="brass">Locker</InlineBadge>
        <h1 className="mt-3 font-serif text-4xl font-semibold">Evidence Locker</h1>
      </div>
      <EvidenceLocker evidence={evidence} characters={characters} locations={locations} />
    </div>
  );
}
