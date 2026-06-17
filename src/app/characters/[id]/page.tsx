import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { InlineBadge } from "@/components/InlineBadge";
import { getCharacter, getEvidence, getRelationships } from "@/lib/data";

export default async function CharacterProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [character, evidence, relationships] = await Promise.all([
    getCharacter(id),
    getEvidence(),
    getRelationships()
  ]);

  if (!character) {
    notFound();
  }

  const relatedEvidence = evidence.filter((item) => character.relatedEvidence.includes(item.id));
  const relatedRelationships = relationships.filter(
    (relationship) => relationship.fromId === character.id || relationship.toId === character.id
  );

  return (
    <div className="space-y-6">
      <Link
        href="/characters"
        className="focus-ring inline-flex h-10 items-center gap-2 border border-ink/10 bg-midnight/75 px-3 text-sm font-semibold"
      >
        <ArrowLeft className="h-4 w-4" />
        Characters
      </Link>

      <section className="case-panel grid gap-6 p-6 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col items-start gap-4">
          <CharacterAvatar character={character} size="lg" />
          <div className="space-y-2">
            <InlineBadge tone={character.suspectStatus.includes("active") ? "signal" : "oxide"}>
              {character.suspectStatus}
            </InlineBadge>
            <InlineBadge>{character.unlockState}</InlineBadge>
          </div>
        </div>
        <div>
          <h1 className="font-serif text-5xl font-semibold leading-tight">{character.name}</h1>
          <p className="mt-2 text-lg text-ink/65">{character.role}</p>
          <p className="mt-5 max-w-3xl leading-7 text-ink/75">{character.bio}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoBlock title="Relationship To Victim" items={[character.relationshipToVictim]} />
            <InfoBlock title="Motive" items={[character.motive]} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <InfoBlock title="Secrets" items={character.secrets} />
        <InfoBlock title="Statements" items={character.statements} />
        <InfoBlock title="Known Timeline" items={character.knownTimeline} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="case-panel p-6">
          <h2 className="font-serif text-2xl font-semibold">Related Evidence</h2>
          <div className="mt-4 space-y-3">
            {relatedEvidence.map((item) => (
              <Link
                key={item.id}
                href="/evidence"
                className="focus-ring block border border-ink/10 bg-midnight/70 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <InlineBadge tone={item.isCritical ? "signal" : "neutral"}>{item.id}</InlineBadge>
                  <span className="font-semibold">{item.title}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/65">{item.significance}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="case-panel p-6">
          <h2 className="font-serif text-2xl font-semibold">Relationships</h2>
          <div className="mt-4 space-y-3">
            {relatedRelationships.map((relationship) => (
              <div key={relationship.id} className="border border-ink/10 bg-midnight/70 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <InlineBadge tone="brass">{relationship.type}</InlineBadge>
                  <span className="font-semibold">{relationship.label}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/65">{relationship.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="case-panel p-6">
      <h2 className="font-serif text-2xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <p key={item} className="border-l-4 border-oxide bg-midnight/60 px-4 py-3 text-sm leading-6">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
