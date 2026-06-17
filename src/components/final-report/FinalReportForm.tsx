"use client";

import { useMemo, useState } from "react";
import { Check, CheckCircle2, Circle, Send, XCircle } from "lucide-react";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { InlineBadge } from "@/components/InlineBadge";
import type { Character, Evidence, FinalReportInput, Location, ValidationSection } from "@/types/game";

type ApiResult = {
  correct: boolean;
  sections: Record<ValidationSection, boolean>;
  publicFeedback: string[];
  missingRequiredEvidenceCount: number;
  missingEliminationsCount: number;
  unsupportedEliminationsCount: number;
};

const methodOptions = [
  { value: "", label: "Select method" },
  { value: "bronze_model_office_blow", label: "Bronze model blow in office" },
  { value: "intentional_memory_arch_collision", label: "Intentional Memory Arch collision" },
  { value: "accidental_memory_arch_collision", label: "Accidental Memory Arch collision" },
  { value: "poison_or_medication", label: "Poison or medication" },
  { value: "unknown_blunt_force", label: "Unknown blunt-force attack" }
];

const sectionLabels: Record<ValidationSection, string> = {
  culprit: "Culprit",
  scene: "True scene",
  time: "Fatal time",
  method: "Method",
  motive: "Motive",
  office_misdirection: "Office misdirection",
  key_evidence: "Key evidence",
  eliminations: "Eliminations",
  written_explanation: "Written explanation"
};

export function FinalReportForm({
  suspects,
  locations,
  evidence
}: {
  suspects: Character[];
  locations: Location[];
  evidence: Evidence[];
}) {
  const [form, setForm] = useState<FinalReportInput>({
    culpritId: "",
    locationId: "",
    fatalTime: "19:42",
    method: "",
    motive: "",
    rejectsOfficeWeapon: false,
    misleadingExplanation: "",
    requiredEvidenceIds: [],
    eliminatedSuspectIds: [],
    eliminationEvidence: {},
    writtenExplanation: ""
  });
  const [result, setResult] = useState<ApiResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const evidenceById = useMemo(() => new Map(evidence.map((item) => [item.id, item])), [evidence]);
  const sortedEvidence = [...evidence].sort((a, b) => {
    if (a.isCritical !== b.isCritical) return a.isCritical ? -1 : 1;
    return a.id.localeCompare(b.id);
  });

  function update<K extends keyof FinalReportInput>(key: K, value: FinalReportInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleRequiredEvidence(id: string) {
    setForm((current) => ({
      ...current,
      requiredEvidenceIds: current.requiredEvidenceIds.includes(id)
        ? current.requiredEvidenceIds.filter((item) => item !== id)
        : [...current.requiredEvidenceIds, id]
    }));
  }

  function toggleEliminatedSuspect(id: string) {
    setForm((current) => ({
      ...current,
      eliminatedSuspectIds: current.eliminatedSuspectIds.includes(id)
        ? current.eliminatedSuspectIds.filter((item) => item !== id)
        : [...current.eliminatedSuspectIds, id]
    }));
  }

  function toggleEliminationEvidence(characterId: string, evidenceId: string) {
    setForm((current) => {
      const existing = current.eliminationEvidence[characterId] ?? [];
      const nextEvidence = existing.includes(evidenceId)
        ? existing.filter((id) => id !== evidenceId)
        : [...existing, evidenceId];

      return {
        ...current,
        eliminationEvidence: {
          ...current.eliminationEvidence,
          [characterId]: nextEvidence
        }
      };
    });
  }

  async function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/final-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setResult((await response.json()) as ApiResult);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitReport} className="space-y-6">
      <section className="case-panel grid gap-5 p-5 lg:grid-cols-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-ink/45">Culprit</span>
          <select
            value={form.culpritId}
            onChange={(event) => update("culpritId", event.target.value)}
            className="focus-ring mt-2 h-11 w-full border border-ink/10 bg-midnight px-3 text-sm"
          >
            <option value="">Select suspect</option>
            {suspects.map((suspect) => (
              <option key={suspect.id} value={suspect.id}>
                {suspect.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-ink/45">True scene</span>
          <select
            value={form.locationId}
            onChange={(event) => update("locationId", event.target.value)}
            className="focus-ring mt-2 h-11 w-full border border-ink/10 bg-midnight px-3 text-sm"
          >
            <option value="">Select location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-ink/45">Fatal time</span>
          <input
            type="time"
            value={form.fatalTime}
            onChange={(event) => update("fatalTime", event.target.value)}
            className="focus-ring mt-2 h-11 w-full border border-ink/10 bg-midnight px-3 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-ink/45">Method</span>
          <select
            value={form.method}
            onChange={(event) => update("method", event.target.value)}
            className="focus-ring mt-2 h-11 w-full border border-ink/10 bg-midnight px-3 text-sm"
          >
            {methodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="case-panel p-5">
          <h2 className="font-serif text-2xl font-semibold">Reasoning</h2>
          <label className="mt-5 block">
            <span className="text-xs font-bold uppercase tracking-wide text-ink/45">Motive</span>
            <textarea
              value={form.motive}
              onChange={(event) => update("motive", event.target.value)}
              className="focus-ring mt-2 min-h-28 w-full border border-ink/10 bg-midnight/80 p-3 text-sm leading-6"
            />
          </label>

          <label className="mt-5 flex items-start gap-3 border border-ink/10 bg-midnight/70 p-3">
            <input
              type="checkbox"
              checked={form.rejectsOfficeWeapon}
              onChange={(event) => update("rejectsOfficeWeapon", event.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block font-semibold">
                The bronze brain model was not the primary murder weapon.
              </span>
              <span className="text-sm text-ink/60">The office injury must be explained separately.</span>
            </span>
          </label>

          <label className="mt-5 block">
            <span className="text-xs font-bold uppercase tracking-wide text-ink/45">
              Misleading crime scene explanation
            </span>
            <textarea
              value={form.misleadingExplanation}
              onChange={(event) => update("misleadingExplanation", event.target.value)}
              className="focus-ring mt-2 min-h-28 w-full border border-ink/10 bg-midnight/80 p-3 text-sm leading-6"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-xs font-bold uppercase tracking-wide text-ink/45">
              Written deduction
            </span>
            <textarea
              value={form.writtenExplanation}
              onChange={(event) => update("writtenExplanation", event.target.value)}
              className="focus-ring mt-2 min-h-40 w-full border border-ink/10 bg-midnight/80 p-3 text-sm leading-6"
            />
          </label>
        </div>

        <aside className="case-panel p-5">
          <h2 className="font-serif text-2xl font-semibold">Key Evidence</h2>
          <div className="mt-4 max-h-[720px] space-y-2 overflow-auto pr-1">
            {sortedEvidence.map((item) => {
              const active = form.requiredEvidenceIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleRequiredEvidence(item.id)}
                  className={`focus-ring flex w-full items-start gap-3 border p-3 text-left ${
                    active ? "border-oxide bg-oxide/10" : "border-ink/10 bg-midnight/75"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center border ${
                      active ? "border-oxide bg-oxide text-paper" : "border-ink/20"
                    }`}
                  >
                    {active ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span>
                    <span className="flex flex-wrap items-center gap-2">
                      <InlineBadge tone={item.isCritical ? "signal" : "neutral"}>{item.id}</InlineBadge>
                      <span className="font-semibold">{item.title}</span>
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-ink/60">{item.significance}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      </section>

      <section className="case-panel p-5">
        <h2 className="font-serif text-2xl font-semibold">Alternative Suspects</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {suspects.map((suspect) => {
            const eliminated = form.eliminatedSuspectIds.includes(suspect.id);
            const relatedEvidence = evidence.filter((item) =>
              item.relatedCharacters.includes(suspect.id)
            );
            return (
              <div key={suspect.id} className="border border-ink/10 bg-midnight/75 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CharacterAvatar character={suspect} size="sm" />
                    <div>
                      <h3 className="font-semibold">{suspect.name}</h3>
                      <p className="text-xs uppercase tracking-wide text-ink/50">
                        {suspect.relationshipToVictim}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleEliminatedSuspect(suspect.id)}
                    className={`focus-ring inline-flex h-9 items-center gap-2 border px-2 text-xs font-semibold ${
                      eliminated ? "border-oxide bg-oxide text-paper" : "border-ink/10 bg-paper"
                    }`}
                  >
                    {eliminated ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                    Eliminated
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedEvidence.map((item) => {
                    const active = form.eliminationEvidence[suspect.id]?.includes(item.id) ?? false;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleEliminationEvidence(suspect.id, item.id)}
                        className={`focus-ring border px-2 py-1 text-xs font-semibold ${
                          active ? "border-oxide bg-oxide text-paper" : "border-ink/10 bg-paper"
                        }`}
                        title={evidenceById.get(item.id)?.title}
                      >
                        {item.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="focus-ring inline-flex h-12 items-center justify-center gap-2 border border-oxide bg-oxide px-5 font-semibold text-paper disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {submitting ? "Submitting" : "Submit Report"}
        </button>

        {result ? (
          <div
            className={`flex items-center gap-2 border px-4 py-3 text-sm font-semibold ${
              result.correct
                ? "border-oxide bg-oxide/10 text-oxide"
                : "border-signal bg-signal/10 text-signal"
            }`}
          >
            {result.correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            {result.correct ? "Report accepted" : "Report rejected"}
          </div>
        ) : null}
      </div>

      {result ? (
        <section className="case-panel p-5">
          <h2 className="font-serif text-2xl font-semibold">Validation Notes</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {Object.entries(result.sections).map(([section, passed]) => (
              <div
                key={section}
                className={`flex items-center gap-2 border px-3 py-2 text-sm ${
                  passed ? "border-oxide/25 bg-oxide/10" : "border-signal/25 bg-signal/10"
                }`}
              >
                {passed ? <CheckCircle2 className="h-4 w-4 text-oxide" /> : <XCircle className="h-4 w-4 text-signal" />}
                {sectionLabels[section as ValidationSection]}
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            {result.publicFeedback.map((item) => (
              <p key={item} className="border-l-4 border-brass bg-midnight/70 px-4 py-3 text-sm leading-6">
                {item}
              </p>
            ))}
          </div>
        </section>
      ) : null}
    </form>
  );
}
