import solution from "../../../../data/solution-hidden.json";
import { recordFinalAccusation } from "@/lib/data";
import { validateFinalAccusation } from "@/lib/solution-validator";
import type { FinalReportInput, HiddenSolution } from "@/types/game";

export async function POST(request: Request) {
  const input = (await request.json()) as FinalReportInput;
  const result = validateFinalAccusation(input, solution as HiddenSolution);

  await recordFinalAccusation(input, result);

  return Response.json({
    correct: result.correct,
    sections: result.sections,
    publicFeedback: result.publicFeedback,
    missingRequiredEvidenceCount: result.missingRequiredEvidence.length,
    missingEliminationsCount: result.missingEliminations.length,
    unsupportedEliminationsCount: result.unsupportedEliminations.length
  });
}
