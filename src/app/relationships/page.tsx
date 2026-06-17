import { InlineBadge } from "@/components/InlineBadge";
import { RelationshipBoard } from "@/components/relationships/RelationshipBoard";
import { getCharacters, getEvidence, getRelationships } from "@/lib/data";

export default async function RelationshipsPage() {
  const [relationships, characters, evidence] = await Promise.all([
    getRelationships(),
    getCharacters(),
    getEvidence()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <InlineBadge tone="brass">Relationship board</InlineBadge>
        <h1 className="mt-3 font-serif text-4xl font-semibold">Pressure Map</h1>
      </div>
      <RelationshipBoard relationships={relationships} characters={characters} evidence={evidence} />
    </div>
  );
}
