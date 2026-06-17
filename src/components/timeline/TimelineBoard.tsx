"use client";

import { useMemo, useState } from "react";
import { Check, Clock, Plus, UnlockKeyhole } from "lucide-react";
import { InlineBadge } from "@/components/InlineBadge";
import type { Character, Evidence, Location, TimelineEvent } from "@/types/game";

const medicalUnlockIds = ["E004", "E005", "E018"];

export function TimelineBoard({
  publicEvents,
  trueEvents,
  evidence,
  characters,
  locations
}: {
  publicEvents: TimelineEvent[];
  trueEvents: TimelineEvent[];
  evidence: Evidence[];
  characters: Character[];
  locations: Location[];
}) {
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [placedEventIds, setPlacedEventIds] = useState<string[]>(publicEvents.map((event) => event.id));
  const unlockedTrueTimeline = medicalUnlockIds.every((id) => selectedEvidence.includes(id));

  const characterName = useMemo(
    () => new Map(characters.map((character) => [character.id, character.name])),
    [characters]
  );
  const locationName = useMemo(
    () => new Map(locations.map((location) => [location.id, location.name])),
    [locations]
  );

  const availableEvents = unlockedTrueTimeline ? trueEvents : publicEvents;
  const placedEvents = availableEvents
    .filter((event) => placedEventIds.includes(event.id))
    .sort((a, b) => a.time.localeCompare(b.time));
  const unplacedEvents = availableEvents.filter((event) => !placedEventIds.includes(event.id));

  function toggleEvidence(id: string) {
    setSelectedEvidence((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function placeEvent(id: string) {
    setPlacedEventIds((current) => Array.from(new Set([...current, id])));
  }

  return (
    <div className="space-y-6">
      <section className="case-panel p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-oxide">
              <Clock className="h-4 w-4" />
              Timeline Lock
            </div>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              The earlier gala sequence opens when the medical contradiction is connected.
            </p>
          </div>
          {unlockedTrueTimeline ? (
            <InlineBadge tone="oxide">
              <UnlockKeyhole className="mr-1 h-3 w-3" />
              Earlier sequence unlocked
            </InlineBadge>
          ) : (
            <InlineBadge tone="brass">Public sequence only</InlineBadge>
          )}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {medicalUnlockIds.map((id) => {
            const item = evidence.find((entry) => entry.id === id);
            const active = selectedEvidence.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleEvidence(id)}
                className={`focus-ring flex min-h-20 items-start gap-3 border p-3 text-left ${
                  active ? "border-oxide bg-oxide/10" : "border-ink/10 bg-midnight/70"
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center border ${
                    active ? "border-oxide bg-oxide text-paper" : "border-ink/20"
                  }`}
                >
                  {active ? <Check className="h-4 w-4" /> : null}
                </span>
                <span>
                  <span className="block font-semibold">
                    {id} {item?.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-ink/60">{item?.significance}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="case-panel p-5">
          <h2 className="font-serif text-2xl font-semibold">Placed Timeline</h2>
          <div className="mt-5 space-y-3">
            {placedEvents.map((event) => (
              <article key={event.id} className="grid gap-3 border border-ink/10 bg-midnight/70 p-4 md:grid-cols-[92px_1fr]">
                <div>
                  <InlineBadge tone={event.isTrue ? "oxide" : "brass"}>{event.time}</InlineBadge>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold">{event.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{event.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink/60">
                    <span>{locationName.get(event.locationId) ?? event.locationId}</span>
                    <span>{event.characterIds.map((id) => characterName.get(id) ?? id).join(", ")}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="case-panel p-5">
          <h2 className="font-serif text-2xl font-semibold">Event Pool</h2>
          <div className="mt-5 max-h-[720px] space-y-3 overflow-auto pr-1">
            {unplacedEvents.length === 0 ? (
              <p className="text-sm text-ink/60">All visible events are placed.</p>
            ) : (
              unplacedEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => placeEvent(event.id)}
                  className="focus-ring flex w-full items-start gap-3 border border-ink/10 bg-midnight/75 p-3 text-left text-sm hover:border-oxide"
                >
                  <Plus className="mt-1 h-4 w-4 shrink-0 text-oxide" />
                  <span>
                    <span className="font-semibold">
                      {event.time} {event.label}
                    </span>
                    <span className="mt-1 block text-ink/60">{event.description}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
