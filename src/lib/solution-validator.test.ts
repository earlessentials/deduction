import { describe, expect, it } from "vitest";
import solution from "../../data/solution-hidden.json";
import type { FinalReportInput, HiddenSolution } from "@/types/game";
import { validateFinalAccusation } from "./solution-validator";

const hiddenSolution = solution as HiddenSolution;

describe("validateFinalAccusation", () => {
  it("accepts the complete supported deduction", () => {
    const result = validateFinalAccusation(validReport(), hiddenSolution);

    expect(result.correct).toBe(true);
    expect(result.missingRequiredEvidence).toEqual([]);
    expect(result.missingEliminations).toEqual([]);
    expect(result.unsupportedEliminations).toEqual([]);
  });

  it("rejects a killer-only guess", () => {
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

    expect(result.correct).toBe(false);
    expect(result.sections.culprit).toBe(true);
    expect(result.sections.scene).toBe(false);
    expect(result.sections.key_evidence).toBe(false);
    expect(result.sections.eliminations).toBe(false);
  });

  it("requires supported eliminations, not just checked names", () => {
    const report = validReport();
    const result = validateFinalAccusation(
      {
        ...report,
        eliminationEvidence: {}
      },
      hiddenSolution
    );

    expect(result.correct).toBe(false);
    expect(result.sections.eliminations).toBe(false);
    expect(result.unsupportedEliminations).toContain("evelyn_vale");
  });

  it("accepts fatal time within the 19:40-19:45 range", () => {
    const report = validReport();

    expect(
      validateFinalAccusation({ ...report, fatalTime: "19:40" }, hiddenSolution).sections.time
    ).toBe(true);
    expect(
      validateFinalAccusation({ ...report, fatalTime: "19:45" }, hiddenSolution).sections.time
    ).toBe(true);
    expect(
      validateFinalAccusation({ ...report, fatalTime: "19:46" }, hiddenSolution).sections.time
    ).toBe(false);
  });
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
