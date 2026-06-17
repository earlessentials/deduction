import caseData from "../../data/case.json";
import charactersData from "../../data/characters.json";
import evidenceData from "../../data/evidence.json";
import interviewsData from "../../data/interviews.json";
import locationsData from "../../data/locations.json";
import publicTimelineData from "../../data/public-timeline.json";
import relationshipsData from "../../data/relationships.json";
import solutionData from "../../data/solution-hidden.json";
import trueTimelineData from "../../data/true-timeline.json";
import { getPrismaClient } from "./prisma";
import type {
  Character,
  Evidence,
  FinalReportInput,
  GameCase,
  HiddenSolution,
  Hypothesis,
  Interview,
  InterviewChoice,
  InterviewNode,
  Location,
  Relationship,
  TimelineEvent,
  ValidationResult
} from "@/types/game";

const gameCase = caseData as GameCase;
const characters = charactersData as Character[];
const locations = locationsData as Location[];
const evidence = evidenceData as Evidence[];
const interviews = interviewsData as Interview[];
const publicTimeline = publicTimelineData as TimelineEvent[];
const trueTimeline = trueTimelineData as TimelineEvent[];
const relationships = relationshipsData as Relationship[];
const solution = solutionData as HiddenSolution;

export async function getCase(): Promise<GameCase> {
  return withPrismaFallback(
    async (prisma) => {
      const row = await prisma.case.findUnique({ where: { id: gameCase.id } });
      if (!row) return gameCase;

      return {
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        summary: row.summary,
        initialTheory: row.initialTheory,
        briefing: parseJson(row.briefingJson, gameCase.briefing),
        suggestedHypotheses: gameCase.suggestedHypotheses
      };
    },
    gameCase
  );
}

export async function getCharacters(): Promise<Character[]> {
  return withPrismaFallback(
    async (prisma) => {
      const rows = await prisma.character.findMany({
        where: { caseId: gameCase.id },
        orderBy: { name: "asc" }
      });
      if (rows.length === 0) return characters;

      return rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        role: row.role,
        relationshipToVictim: row.relationshipToVictim,
        suspectStatus: row.suspectStatus,
        unlockState: row.unlockState,
        portraitPath: row.portraitPath ?? "",
        bio: row.bio,
        motive: row.motive,
        secrets: parseJson(row.secretsJson, []),
        statements: parseJson(row.statementsJson, []),
        knownTimeline: parseJson(row.knownTimelineJson, []),
        relatedEvidence: parseJson(row.relatedEvidenceJson, [])
      }));
    },
    characters
  );
}

export async function getCharacter(id: string): Promise<Character | undefined> {
  const allCharacters = await getCharacters();
  return allCharacters.find((character) => character.id === id);
}

export async function getEvidence(): Promise<Evidence[]> {
  return withPrismaFallback(
    async (prisma) => {
      const rows = await prisma.evidence.findMany({
        where: { caseId: gameCase.id },
        orderBy: { id: "asc" }
      });
      if (rows.length === 0) return evidence;

      return rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        description: row.description,
        unlockedBy: row.unlockedBy,
        relatedCharacters: parseJson(row.relatedCharactersJson, []),
        relatedLocations: parseJson(row.relatedLocationsJson, []),
        significance: row.significance,
        possibleInterpretations: parseJson(row.possibleInterpretationsJson, []),
        isCritical: row.isCritical
      }));
    },
    evidence
  );
}

export async function getLocations(): Promise<Location[]> {
  return withPrismaFallback(
    async (prisma) => {
      const rows = await prisma.location.findMany({
        where: { caseId: gameCase.id },
        orderBy: { name: "asc" }
      });
      if (rows.length === 0) return locations;
      return rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        description: row.description,
        floor: row.floor,
        publicNotes: row.publicNotes
      }));
    },
    locations
  );
}

export async function getInterviews(): Promise<Interview[]> {
  return withPrismaFallback(
    async (prisma) => {
      const rows = await prisma.interview.findMany({
        where: { caseId: gameCase.id },
        include: { nodes: { orderBy: { sortOrder: "asc" } } },
        orderBy: { title: "asc" }
      });
      if (rows.length === 0) return interviews;

      return rows.map((row: any) => ({
        id: row.id,
        characterId: row.characterId,
        title: row.title,
        phase: row.phase,
        description: row.description,
        nodes: row.nodes.map((node: any) => ({
          id: node.id,
          prompt: node.prompt,
          response: node.response,
          requiredEvidence: parseJson(node.requiredEvidenceJson, []),
          unlocksEvidence: parseJson(node.unlocksEvidenceJson, []),
          choices: parseJson(node.choicesJson, []) as InterviewChoice[]
        })) as InterviewNode[]
      }));
    },
    interviews
  );
}

export async function getTimelineEvents(kind: "public" | "true" | "all" = "all") {
  const fallback =
    kind === "public" ? publicTimeline : kind === "true" ? trueTimeline : [...publicTimeline, ...trueTimeline];

  return withPrismaFallback(
    async (prisma) => {
      const where =
        kind === "public"
          ? { caseId: gameCase.id, isPublic: true }
          : kind === "true"
            ? { caseId: gameCase.id, isTrue: true }
            : { caseId: gameCase.id };

      const rows = await prisma.timelineEvent.findMany({
        where,
        orderBy: { sortOrder: "asc" }
      });
      if (rows.length === 0) return fallback;

      return rows.map((row: any) => ({
        id: row.id,
        time: row.time,
        label: row.label,
        description: row.description,
        locationId: row.locationId ?? "",
        characterIds: parseJson(row.characterIdsJson, []),
        evidenceIds: parseJson(row.evidenceIdsJson, []),
        isPublic: row.isPublic,
        isTrue: row.isTrue,
        sortOrder: row.sortOrder
      }));
    },
    fallback
  );
}

export async function getRelationships(): Promise<Relationship[]> {
  return withPrismaFallback(
    async (prisma) => {
      const rows = await prisma.relationship.findMany({
        where: { caseId: gameCase.id },
        orderBy: { id: "asc" }
      });
      if (rows.length === 0) return relationships;
      return rows.map((row: any) => ({
        id: row.id,
        fromId: row.fromId,
        toId: row.toId,
        type: row.type,
        label: row.label,
        description: row.description,
        evidenceIds: parseJson(row.evidenceIdsJson, [])
      }));
    },
    relationships
  );
}

export async function getHypotheses(): Promise<Hypothesis[]> {
  return withPrismaFallback(
    async (prisma) => {
      const rows = await prisma.hypothesis.findMany({
        where: { caseId: gameCase.id },
        orderBy: { id: "asc" }
      });
      if (rows.length === 0) return gameCase.suggestedHypotheses;
      return rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        suggestedStatus: row.suggestedStatus,
        evidenceIds: parseJson(row.evidenceIdsJson, [])
      }));
    },
    gameCase.suggestedHypotheses
  );
}

export async function getMajorSuspectIds(): Promise<string[]> {
  return solution.requiredEliminations.map((item) => item.characterId);
}

export async function recordFinalAccusation(
  input: FinalReportInput,
  result: ValidationResult
): Promise<void> {
  const prisma = await getPrismaClient();
  if (!prisma) return;

  try {
    await prisma.finalAccusation.create({
      data: {
        caseId: gameCase.id,
        culpritId: input.culpritId,
        locationId: input.locationId,
        fatalTime: input.fatalTime,
        method: input.method,
        motive: input.motive,
        rejectsOfficeWeapon: input.rejectsOfficeWeapon,
        misleadingExplanation: input.misleadingExplanation,
        requiredEvidenceJson: JSON.stringify(input.requiredEvidenceIds),
        eliminatedSuspectsJson: JSON.stringify(input.eliminatedSuspectIds),
        writtenExplanation: input.writtenExplanation,
        isCorrect: result.correct,
        feedbackJson: JSON.stringify(result.publicFeedback)
      }
    });
  } catch {
    // The game should remain playable if the database is not ready.
  }
}

async function withPrismaFallback<T>(
  query: (prisma: any) => Promise<T>,
  fallback: T
): Promise<T> {
  const prisma = await getPrismaClient();
  if (!prisma) return fallback;

  try {
    return await query(prisma);
  } catch {
    return fallback;
  }
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
