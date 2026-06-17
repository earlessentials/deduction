"use client";

import { useMemo, useState } from "react";
import { Check, CornerDownRight, LockKeyhole, RotateCcw } from "lucide-react";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { InlineBadge } from "@/components/InlineBadge";
import type { Character, Evidence, Interview, InterviewNode } from "@/types/game";

export function InterviewRoom({
  interviews,
  characters,
  evidence
}: {
  interviews: Interview[];
  characters: Character[];
  evidence: Evidence[];
}) {
  const [activeInterviewId, setActiveInterviewId] = useState(interviews[0]?.id ?? "");
  const activeInterview = interviews.find((interview) => interview.id === activeInterviewId) ?? interviews[0];
  const [currentNodeId, setCurrentNodeId] = useState(activeInterview?.nodes[0]?.id ?? "");
  const [unlockedEvidence, setUnlockedEvidence] = useState<string[]>([
    "E001",
    "E002",
    "E003",
    "E004",
    "E005",
    "E018",
    "E021",
    "E023"
  ]);

  const characterById = useMemo(
    () => new Map(characters.map((character) => [character.id, character])),
    [characters]
  );
  const evidenceById = useMemo(() => new Map(evidence.map((item) => [item.id, item])), [evidence]);
  const nodeById = useMemo(
    () => new Map(activeInterview?.nodes.map((node) => [node.id, node]) ?? []),
    [activeInterview]
  );

  const currentNode =
    nodeById.get(currentNodeId) ?? activeInterview?.nodes[0] ?? (undefined as InterviewNode | undefined);
  const activeCharacter = activeInterview ? characterById.get(activeInterview.characterId) : undefined;

  function switchInterview(interviewId: string) {
    const nextInterview = interviews.find((interview) => interview.id === interviewId);
    setActiveInterviewId(interviewId);
    setCurrentNodeId(nextInterview?.nodes[0]?.id ?? "");
  }

  function choose(nextNodeId: string, unlocks: string[]) {
    setCurrentNodeId(nextNodeId);
    setUnlockedEvidence((current) => Array.from(new Set([...current, ...unlocks])));
  }

  function resetInterview() {
    setCurrentNodeId(activeInterview?.nodes[0]?.id ?? "");
  }

  if (!activeInterview || !currentNode || !activeCharacter) {
    return <div className="case-panel p-6">No interviews are available.</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[310px_1fr]">
      <aside className="case-panel p-4">
        <h2 className="font-serif text-2xl font-semibold">Interview List</h2>
        <div className="mt-4 space-y-2">
          {interviews.map((interview) => {
            const character = characterById.get(interview.characterId);
            return (
              <button
                key={interview.id}
                type="button"
                onClick={() => switchInterview(interview.id)}
                className={`focus-ring flex w-full items-center gap-3 border p-3 text-left ${
                  activeInterview.id === interview.id
                    ? "border-oxide bg-oxide/10"
                    : "border-ink/10 bg-midnight/70"
                }`}
              >
                {character ? <CharacterAvatar character={character} size="sm" /> : null}
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{interview.title}</span>
                  <span className="block truncate text-xs uppercase tracking-wide text-ink/50">
                    {interview.phase}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="case-panel p-6">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <CharacterAvatar character={activeCharacter} size="lg" />
            <div>
              <InlineBadge tone="oxide">{activeInterview.phase}</InlineBadge>
              <h1 className="mt-2 font-serif text-3xl font-semibold">{activeInterview.title}</h1>
              <p className="mt-1 text-sm text-ink/60">{activeInterview.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetInterview}
            className="focus-ring inline-flex h-10 items-center justify-center gap-2 border border-ink/10 bg-midnight/80 px-3 text-sm font-semibold"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_280px]">
          <div className="space-y-5">
            <div className="border border-ink/10 bg-midnight/75 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-oxide">
                <CornerDownRight className="h-4 w-4" />
                Prompt
              </div>
              <p className="font-serif text-2xl leading-snug">{currentNode.prompt}</p>
              <p className="mt-5 leading-7 text-ink/74">{currentNode.response}</p>
            </div>

            {currentNode.unlocksEvidence.length > 0 ? (
              <div className="border border-brass/30 bg-brass/10 p-4">
                <div className="flex flex-wrap gap-2">
                  {currentNode.unlocksEvidence.map((id) => (
                    <InlineBadge key={id} tone="brass">
                      Unlocked {id}
                    </InlineBadge>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              {currentNode.choices.length === 0 ? (
                <div className="border border-ink/10 bg-midnight/70 p-4 text-sm text-ink/65">
                  This branch is complete.
                </div>
              ) : (
                currentNode.choices.map((choice) => {
                  const locked = choice.requiresEvidence.some((id) => !unlockedEvidence.includes(id));
                  return (
                    <button
                      key={`${currentNode.id}-${choice.label}`}
                      type="button"
                      disabled={locked}
                      onClick={() => choose(choice.nextNodeId, choice.unlocksEvidence)}
                      className={`focus-ring flex w-full items-center justify-between gap-3 border p-4 text-left text-sm font-semibold ${
                        locked
                          ? "cursor-not-allowed border-ink/10 bg-ink/5 text-ink/35"
                          : "border-oxide/30 bg-midnight text-ink hover:border-oxide"
                      }`}
                    >
                      <span>{choice.label}</span>
                      {locked ? <LockKeyhole className="h-4 w-4" /> : <Check className="h-4 w-4 text-oxide" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <aside className="border border-ink/10 bg-midnight/70 p-4">
            <h2 className="font-serif text-xl font-semibold">Usable Evidence</h2>
            <div className="mt-4 max-h-[520px] space-y-2 overflow-auto pr-1">
              {unlockedEvidence.map((id) => {
                const item = evidenceById.get(id);
                return item ? (
                  <div key={id} className="border border-ink/10 bg-paper/70 p-3">
                    <InlineBadge tone={item.isCritical ? "signal" : "neutral"}>{id}</InlineBadge>
                    <p className="mt-2 text-sm font-semibold">{item.title}</p>
                  </div>
                ) : null;
              })}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
