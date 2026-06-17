import type {
  FinalReportInput,
  HiddenSolution,
  RequiredElimination,
  ValidationResult,
  ValidationSection
} from "@/types/game";

const requiredSections: ValidationSection[] = [
  "culprit",
  "scene",
  "time",
  "method",
  "motive",
  "office_misdirection",
  "key_evidence",
  "eliminations",
  "written_explanation"
];

export function validateFinalAccusation(
  input: FinalReportInput,
  solution: HiddenSolution
): ValidationResult {
  const selectedEvidence = new Set(input.requiredEvidenceIds);
  const eliminatedSuspects = new Set(input.eliminatedSuspectIds);
  const motiveText = normalize(
    [input.motive, input.writtenExplanation, input.misleadingExplanation].join(" ")
  );

  const missingRequiredEvidence = solution.requiredEvidenceIds.filter(
    (evidenceId) => !selectedEvidence.has(evidenceId)
  );

  const missingEliminations = solution.requiredEliminations
    .filter((item) => !eliminatedSuspects.has(item.characterId))
    .map((item) => item.characterId);

  const unsupportedEliminations = solution.requiredEliminations
    .filter((item) => eliminatedSuspects.has(item.characterId))
    .filter((item) => !hasSupportingEliminationEvidence(item, input.eliminationEvidence))
    .map((item) => item.characterId);

  const sections: Record<ValidationSection, boolean> = {
    culprit: input.culpritId === solution.culpritId,
    scene: input.locationId === solution.locationId,
    time: isTimeInRange(input.fatalTime, solution.acceptedStartTime, solution.acceptedEndTime),
    method: isMethodCorrect(input.method, solution.method),
    motive: solution.motiveKeywords.every((group) =>
      group.some((keyword) => motiveText.includes(normalize(keyword)))
    ),
    office_misdirection: rejectsOfficeScene(input),
    key_evidence: missingRequiredEvidence.length === 0,
    eliminations:
      missingEliminations.length === 0 &&
      unsupportedEliminations.length === 0 &&
      !input.eliminatedSuspectIds.includes(solution.culpritId),
    written_explanation: hasSufficientExplanation(input)
  };

  return {
    correct: requiredSections.every((section) => sections[section]),
    sections,
    missingRequiredEvidence,
    missingEliminations,
    unsupportedEliminations,
    publicFeedback: buildPublicFeedback(sections)
  };
}

export function isTimeInRange(time: string, start: string, end: string): boolean {
  const value = toMinutes(time);
  const min = toMinutes(start);
  const max = toMinutes(end);

  if (value === null || min === null || max === null) {
    return false;
  }

  return value >= min && value <= max;
}

function isMethodCorrect(method: string, expectedMethod: string): boolean {
  const value = normalize(method);
  const expected = normalize(expectedMethod);

  if (value === expected) {
    return true;
  }

  return (
    value.includes("memory arch") &&
    (value.includes("collision") || value.includes("struck") || value.includes("sabotage"))
  );
}

function rejectsOfficeScene(input: FinalReportInput): boolean {
  const explanation = normalize(input.misleadingExplanation);
  const written = normalize(input.writtenExplanation);
  const combined = `${explanation} ${written}`;

  return (
    input.rejectsOfficeWeapon &&
    combined.includes("office") &&
    combined.includes("bronze") &&
    (combined.includes("secondary") ||
      combined.includes("collapse") ||
      combined.includes("not primary") ||
      combined.includes("misleading"))
  );
}

function hasSufficientExplanation(input: FinalReportInput): boolean {
  const combined = normalize(
    [
      input.method,
      input.motive,
      input.misleadingExplanation,
      input.writtenExplanation
    ].join(" ")
  );

  return (
    combined.length >= 180 &&
    combined.includes("corridor") &&
    combined.includes("memory arch") &&
    combined.includes("lucid") &&
    combined.includes("office")
  );
}

function hasSupportingEliminationEvidence(
  item: RequiredElimination,
  eliminationEvidence: Record<string, string[]>
): boolean {
  const selected = new Set(eliminationEvidence[item.characterId] ?? []);
  return item.requiredEvidenceIds.some((evidenceId) => selected.has(evidenceId));
}

function toMinutes(value: string): number | null {
  const normalized = value.trim().replace(".", ":");
  const match = normalized.match(/^(\d{1,2}):?(\d{2})$/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function buildPublicFeedback(sections: Record<ValidationSection, boolean>): string[] {
  const feedback: string[] = [];

  if (!sections.culprit || !sections.scene || !sections.time || !sections.method) {
    feedback.push("The core reconstruction does not yet hold together.");
  }

  if (!sections.motive) {
    feedback.push("The motive section needs the financial pressure and referral risk tied together.");
  }

  if (!sections.office_misdirection) {
    feedback.push("The report must explain why the locked office and bronze model misled the first reconstruction.");
  }

  if (!sections.key_evidence) {
    feedback.push("The key evidence set is incomplete.");
  }

  if (!sections.eliminations) {
    feedback.push("At least one major alternative suspect is missing or lacks supporting evidence.");
  }

  if (!sections.written_explanation) {
    feedback.push("The written explanation needs a full chain from corridor injury to lucid interval to office collapse.");
  }

  if (feedback.length === 0) {
    feedback.push("Report accepted. The deduction is complete.");
  }

  return feedback;
}
