import { PrismaClient } from "@prisma/client";
import caseData from "../data/case.json";
import charactersData from "../data/characters.json";
import evidenceData from "../data/evidence.json";
import interviewsData from "../data/interviews.json";
import locationsData from "../data/locations.json";
import publicTimelineData from "../data/public-timeline.json";
import relationshipsData from "../data/relationships.json";
import solutionData from "../data/solution-hidden.json";
import trueTimelineData from "../data/true-timeline.json";
import type {
  Character,
  Evidence,
  GameCase,
  HiddenSolution,
  Interview,
  Location,
  Relationship,
  TimelineEvent
} from "../src/types/game";

const prisma = new PrismaClient();
const gameCase = caseData as GameCase;
const characters = charactersData as Character[];
const locations = locationsData as Location[];
const evidence = evidenceData as Evidence[];
const interviews = interviewsData as Interview[];
const publicTimeline = publicTimelineData as TimelineEvent[];
const trueTimeline = trueTimelineData as TimelineEvent[];
const relationships = relationshipsData as Relationship[];
const solution = solutionData as HiddenSolution;

async function main() {
  await prisma.finalAccusation.deleteMany();
  await prisma.solutionValidator.deleteMany();
  await prisma.suspectElimination.deleteMany();
  await prisma.hypothesis.deleteMany();
  await prisma.relationship.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.interviewNode.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.location.deleteMany();
  await prisma.character.deleteMany();
  await prisma.case.deleteMany();

  await prisma.case.create({
    data: {
      id: gameCase.id,
      title: gameCase.title,
      subtitle: gameCase.subtitle,
      summary: gameCase.summary,
      initialTheory: gameCase.initialTheory,
      briefingJson: JSON.stringify(gameCase.briefing)
    }
  });

  await prisma.character.createMany({
    data: characters.map((character) => ({
      id: character.id,
      caseId: gameCase.id,
      name: character.name,
      role: character.role,
      relationshipToVictim: character.relationshipToVictim,
      suspectStatus: character.suspectStatus,
      unlockState: character.unlockState,
      portraitPath: character.portraitPath,
      bio: character.bio,
      motive: character.motive,
      secretsJson: JSON.stringify(character.secrets),
      statementsJson: JSON.stringify(character.statements),
      knownTimelineJson: JSON.stringify(character.knownTimeline),
      relatedEvidenceJson: JSON.stringify(character.relatedEvidence)
    }))
  });

  await prisma.location.createMany({
    data: locations.map((location) => ({
      id: location.id,
      caseId: gameCase.id,
      name: location.name,
      category: location.category,
      description: location.description,
      floor: location.floor,
      publicNotes: location.publicNotes
    }))
  });

  await prisma.evidence.createMany({
    data: evidence.map((item) => ({
      id: item.id,
      caseId: gameCase.id,
      title: item.title,
      category: item.category,
      description: item.description,
      unlockedBy: item.unlockedBy,
      relatedCharactersJson: JSON.stringify(item.relatedCharacters),
      relatedLocationsJson: JSON.stringify(item.relatedLocations),
      significance: item.significance,
      possibleInterpretationsJson: JSON.stringify(item.possibleInterpretations),
      isCritical: item.isCritical
    }))
  });

  for (const interview of interviews) {
    await prisma.interview.create({
      data: {
        id: interview.id,
        caseId: gameCase.id,
        characterId: interview.characterId,
        title: interview.title,
        phase: interview.phase,
        description: interview.description,
        nodes: {
          create: interview.nodes.map((node, index) => ({
            id: node.id,
            prompt: node.prompt,
            response: node.response,
            choicesJson: JSON.stringify(node.choices),
            requiredEvidenceJson: JSON.stringify(node.requiredEvidence),
            unlocksEvidenceJson: JSON.stringify(node.unlocksEvidence),
            sortOrder: index
          }))
        }
      }
    });
  }

  await prisma.timelineEvent.createMany({
    data: [...publicTimeline, ...trueTimeline].map((event) => ({
      id: event.id,
      caseId: gameCase.id,
      time: event.time,
      label: event.label,
      description: event.description,
      locationId: event.locationId,
      characterIdsJson: JSON.stringify(event.characterIds),
      evidenceIdsJson: JSON.stringify(event.evidenceIds),
      isPublic: event.isPublic,
      isTrue: event.isTrue,
      sortOrder: event.sortOrder + (event.isTrue ? 1000 : 0)
    }))
  });

  await prisma.relationship.createMany({
    data: relationships.map((relationship) => ({
      id: relationship.id,
      caseId: gameCase.id,
      fromId: relationship.fromId,
      toId: relationship.toId,
      type: relationship.type,
      label: relationship.label,
      description: relationship.description,
      evidenceIdsJson: JSON.stringify(relationship.evidenceIds)
    }))
  });

  await prisma.hypothesis.createMany({
    data: gameCase.suggestedHypotheses.map((hypothesis) => ({
      id: hypothesis.id,
      caseId: gameCase.id,
      title: hypothesis.title,
      description: hypothesis.description,
      suggestedStatus: hypothesis.suggestedStatus,
      evidenceIdsJson: JSON.stringify(hypothesis.evidenceIds)
    }))
  });

  await prisma.suspectElimination.createMany({
    data: solution.requiredEliminations.map((item) => ({
      id: `elim_${item.characterId}`,
      caseId: gameCase.id,
      characterId: item.characterId,
      publicReason: item.publicReason,
      requiredEvidenceJson: JSON.stringify(item.requiredEvidenceIds),
      isMajorAlternative: true
    }))
  });

  await prisma.solutionValidator.create({
    data: {
      id: `validator_${gameCase.id}`,
      caseId: gameCase.id,
      culpritId: solution.culpritId,
      locationId: solution.locationId,
      acceptedStartTime: solution.acceptedStartTime,
      acceptedEndTime: solution.acceptedEndTime,
      method: solution.method,
      motiveKeywordsJson: JSON.stringify(solution.motiveKeywords),
      requiredEvidenceJson: JSON.stringify(solution.requiredEvidenceIds),
      requiredEliminationsJson: JSON.stringify(solution.requiredEliminations),
      hiddenExplanation: solution.hiddenExplanation
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
