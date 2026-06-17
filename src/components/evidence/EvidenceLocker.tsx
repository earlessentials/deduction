"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { InlineBadge } from "@/components/InlineBadge";
import type { Character, Evidence, Location } from "@/types/game";

const categories = [
  "all",
  "office",
  "medical",
  "corridor",
  "digital",
  "financial",
  "interview",
  "red herring",
  "behavioral"
];

export function EvidenceLocker({
  evidence,
  characters,
  locations
}: {
  evidence: Evidence[];
  characters: Character[];
  locations: Location[];
}) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const characterName = useMemo(
    () => new Map(characters.map((character) => [character.id, character.name])),
    [characters]
  );
  const locationName = useMemo(
    () => new Map(locations.map((location) => [location.id, location.name])),
    [locations]
  );

  const filteredEvidence = evidence.filter((item) => {
    const text = [
      item.id,
      item.title,
      item.description,
      item.significance,
      item.category,
      item.relatedCharacters.map((id) => characterName.get(id)).join(" ")
    ]
      .join(" ")
      .toLowerCase();

    return (category === "all" || item.category === category) && text.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="case-panel p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 font-semibold text-oxide">
            <Filter className="h-5 w-5" />
            Evidence Locker
          </div>
          <label className="flex h-11 min-w-0 items-center gap-2 border border-ink/10 bg-midnight px-3 lg:w-96">
            <Search className="h-4 w-4 text-ink/45" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search evidence, people, locations"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`focus-ring h-9 border px-3 text-sm font-semibold capitalize ${
                category === item
                  ? "border-oxide bg-oxide text-paper"
                  : "border-ink/10 bg-midnight/70 text-ink"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredEvidence.map((item) => (
          <article key={item.id} className="case-panel p-5">
            <div className="flex flex-wrap items-center gap-2">
              <InlineBadge tone={item.isCritical ? "signal" : "brass"}>{item.id}</InlineBadge>
              <InlineBadge tone="oxide">{item.category}</InlineBadge>
              {item.isCritical ? <InlineBadge tone="signal">Key clue</InlineBadge> : null}
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold">{item.title}</h2>
            <p className="mt-3 leading-7 text-ink/72">{item.description}</p>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-bold uppercase tracking-wide text-ink/45">Unlocked By</dt>
                <dd className="mt-1 text-ink/72">{item.unlockedBy}</dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wide text-ink/45">Significance</dt>
                <dd className="mt-1 text-ink/72">{item.significance}</dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wide text-ink/45">People</dt>
                <dd className="mt-1 text-ink/72">
                  {item.relatedCharacters.map((id) => characterName.get(id) ?? id).join(", ")}
                </dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wide text-ink/45">Locations</dt>
                <dd className="mt-1 text-ink/72">
                  {item.relatedLocations.map((id) => locationName.get(id) ?? id).join(", ")}
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.possibleInterpretations.map((interpretation) => (
                <span
                  key={interpretation}
                  className="border border-ink/10 bg-midnight/70 px-2 py-1 text-xs text-ink/70"
                >
                  {interpretation}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
