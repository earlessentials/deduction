"use client";

import { useMemo, useState } from "react";
import { Network } from "lucide-react";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { InlineBadge } from "@/components/InlineBadge";
import type { Character, Evidence, Relationship, RelationshipType } from "@/types/game";

const filters: ("all" | RelationshipType)[] = [
  "all",
  "family",
  "work",
  "financial",
  "romantic",
  "conflict",
  "institutional"
];

export function RelationshipBoard({
  relationships,
  characters,
  evidence
}: {
  relationships: Relationship[];
  characters: Character[];
  evidence: Evidence[];
}) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const characterById = useMemo(
    () => new Map(characters.map((character) => [character.id, character])),
    [characters]
  );
  const evidenceById = useMemo(() => new Map(evidence.map((item) => [item.id, item])), [evidence]);
  const visible = relationships.filter((relationship) => filter === "all" || relationship.type === filter);

  return (
    <div className="space-y-6">
      <div className="case-panel p-5">
        <div className="mb-4 flex items-center gap-2 font-semibold text-oxide">
          <Network className="h-5 w-5" />
          Relationship Types
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`focus-ring h-9 border px-3 text-sm font-semibold capitalize ${
                filter === item ? "border-oxide bg-oxide text-paper" : "border-ink/10 bg-midnight/70"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((relationship) => {
          const from = characterById.get(relationship.fromId);
          const to = characterById.get(relationship.toId);
          return (
            <article key={relationship.id} className="case-panel p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {from ? <CharacterAvatar character={from} size="sm" /> : null}
                  {to ? <CharacterAvatar character={to} size="sm" /> : null}
                </div>
                <InlineBadge tone="brass">{relationship.type}</InlineBadge>
              </div>
              <h2 className="mt-4 font-serif text-2xl font-semibold">{relationship.label}</h2>
              <p className="mt-2 text-sm font-semibold text-ink/65">
                {from?.name ?? relationship.fromId} / {to?.name ?? relationship.toId}
              </p>
              <p className="mt-4 leading-7 text-ink/72">{relationship.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {relationship.evidenceIds.map((id) => {
                  const item = evidenceById.get(id);
                  return (
                    <InlineBadge key={id} tone={item?.isCritical ? "signal" : "neutral"}>
                      {id}
                    </InlineBadge>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
