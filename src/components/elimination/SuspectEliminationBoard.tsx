"use client";

import { useMemo } from "react";
import { Check, Circle, Save } from "lucide-react";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { InlineBadge } from "@/components/InlineBadge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Character, Evidence } from "@/types/game";

type EliminationState = Record<
  string,
  {
    eliminated: boolean;
    selectedEvidenceIds: string[];
    note: string;
  }
>;

export function SuspectEliminationBoard({
  suspects,
  evidence
}: {
  suspects: Character[];
  evidence: Evidence[];
}) {
  const initialState = Object.fromEntries(
    suspects.map((suspect) => [
      suspect.id,
      {
        eliminated: false,
        selectedEvidenceIds: [],
        note: ""
      }
    ])
  ) as EliminationState;
  const [state, setState] = useLocalStorage<EliminationState>("lucid-hour:eliminations", initialState);
  const evidenceById = useMemo(() => new Map(evidence.map((item) => [item.id, item])), [evidence]);

  function toggleEliminated(characterId: string) {
    setState((current) => ({
      ...current,
      [characterId]: {
        ...(current[characterId] ?? initialState[characterId]),
        eliminated: !(current[characterId]?.eliminated ?? false)
      }
    }));
  }

  function toggleEvidence(characterId: string, evidenceId: string) {
    setState((current) => {
      const existing = current[characterId] ?? initialState[characterId];
      const selectedEvidenceIds = existing.selectedEvidenceIds.includes(evidenceId)
        ? existing.selectedEvidenceIds.filter((id) => id !== evidenceId)
        : [...existing.selectedEvidenceIds, evidenceId];

      return {
        ...current,
        [characterId]: {
          ...existing,
          selectedEvidenceIds
        }
      };
    });
  }

  function setNote(characterId: string, note: string) {
    setState((current) => ({
      ...current,
      [characterId]: {
        ...(current[characterId] ?? initialState[characterId]),
        note
      }
    }));
  }

  return (
    <div className="space-y-5">
      <div className="case-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Elimination Board</h2>
          <p className="mt-1 text-sm text-ink/65">
            Eliminations saved here are local notes. The final report still requires supporting
            evidence per suspect.
          </p>
        </div>
        <InlineBadge tone="oxide">
          <Save className="mr-1 h-3 w-3" />
          Auto-saved
        </InlineBadge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {suspects.map((suspect) => {
          const current = state[suspect.id] ?? initialState[suspect.id];
          const relatedEvidence = evidence.filter((item) =>
            item.relatedCharacters.includes(suspect.id)
          );
          return (
            <article key={suspect.id} className="case-panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CharacterAvatar character={suspect} size="md" />
                  <div>
                    <h3 className="font-serif text-2xl font-semibold">{suspect.name}</h3>
                    <p className="text-sm text-ink/60">{suspect.relationshipToVictim}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleEliminated(suspect.id)}
                  className={`focus-ring inline-flex h-10 shrink-0 items-center gap-2 border px-3 text-sm font-semibold ${
                    current.eliminated
                      ? "border-oxide bg-oxide text-paper"
                      : "border-ink/10 bg-midnight/75 text-ink"
                  }`}
                >
                  {current.eliminated ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  Eliminated
                </button>
              </div>

              <div className="mt-5">
                <label className="text-xs font-bold uppercase tracking-wide text-ink/45">
                  Supporting evidence
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {relatedEvidence.map((item) => {
                    const active = current.selectedEvidenceIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleEvidence(suspect.id, item.id)}
                        className={`focus-ring border px-2 py-1 text-xs font-semibold ${
                          active
                            ? "border-oxide bg-oxide text-paper"
                            : "border-ink/10 bg-midnight/75 text-ink"
                        }`}
                        title={evidenceById.get(item.id)?.title}
                      >
                        {item.id}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="mt-5 block">
                <span className="text-xs font-bold uppercase tracking-wide text-ink/45">
                  Elimination note
                </span>
                <textarea
                  value={current.note}
                  onChange={(event) => setNote(suspect.id, event.target.value)}
                  className="focus-ring mt-2 min-h-24 w-full border border-ink/10 bg-midnight/80 p-3 text-sm leading-6"
                  placeholder="Alibi, contradiction, or remaining doubt"
                />
              </label>
            </article>
          );
        })}
      </div>
    </div>
  );
}
