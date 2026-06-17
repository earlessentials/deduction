import test from "node:test";
import assert from "node:assert/strict";
import solution from "../../data/solution-hidden.json" with { type: "json" };
import type { FinalReportInput, HiddenSolution } from "@/types/game";
import { validateFinalAccusation } from "./solution-validator.ts";

const hiddenSolution = solution as HiddenSolution;

test("complete supported deduction is accepted", () => {
  const result = validateFinalAccusation(validReport(), hiddenSolution);

  assert.equal(result.correct, true);
  assert.deepEqual(result.missingRequiredEvidence, []);
  assert.deepEqual(result.missingEliminations, []);
});

test("killer-only guess is rejected", () => {
  const report = validReport();
  const result = validateFinalAccusation(
    {
      ...report,
      locationId: "locked_office",
      fatalTime: "21:16",
      method: "bronze brain model",
      motive: "",
      rejectsOfficeWeapon: false,
      requiredEvidenceIds: ["E064"],
      eliminatedSuspectIds: [],
      eliminationEvidence: {},
      writtenExplanation: "Clara did it."
    },
    hiddenSolution
  );

  assert.equal(result.correct, false);
  assert.equal(result.sections.culprit, true);
  assert.equal(result.sections.scene, false);
  assert.equal(result.sections.eliminations, false);
});

function validReport(): FinalReportInput {
  const eliminatedSuspectIds = hiddenSolution.requiredEliminations.map((item) => item.characterId);
  const eliminationEvidence = Object.fromEntries(
    hiddenSolution.requiredEliminations.map((item) => [
      item.characterId,
      [item.requiredEvidenceIds[0]]
    ])
  );

  return {
    culpritId: "clara_finch",
    locationId: "service_corridor_c",
    fatalTime: "19:42",
    method: "intentional_memory_arch_collision",
    motive:
      "Clara faced criminal referral and law enforcement after redirected payments, and Martin's care facility termination warning made protecting her brother's care payments urgent.",
    rejectsOfficeWeapon: true,
    misleadingExplanation:
      "The office was misleading because the bronze brain model created a secondary wound after Simon collapsed. It was not primary; the locked office hid the earlier corridor injury.",
    requiredEvidenceIds: hiddenSolution.requiredEvidenceIds,
    eliminatedSuspectIds,
    eliminationEvidence,
    writtenExplanation:
      "Simon was struck in Service Corridor C by the sabotaged Memory Arch at 19:42, then lived through a lucid interval. Medical evidence separates the primary injury from the office wound. The office and bronze model looked dramatic, but they explain a collapse after deterioration, not the first fatal event."
  };
}
