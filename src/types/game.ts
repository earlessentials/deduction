export type EvidenceCategory =
  | "office"
  | "medical"
  | "corridor"
  | "digital"
  | "financial"
  | "interview"
  | "red herring"
  | "behavioral";

export type HypothesisStatus =
  | "unsupported"
  | "possible"
  | "probable"
  | "proven"
  | "contradicted";

export type CaseBriefing = {
  date: string;
  victim: string;
  setting: string;
  foundAt: string;
  presumedDeathTime: string;
  initialCrimeScene: string;
  misleadingWeapon: string;
  publicFacts: string[];
  initialSuspects: string[];
};

export type GameCase = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  initialTheory: string;
  briefing: CaseBriefing;
  suggestedHypotheses: Hypothesis[];
};

export type Character = {
  id: string;
  name: string;
  role: string;
  relationshipToVictim: string;
  suspectStatus: string;
  unlockState: "locked" | "unlocked";
  portraitPath: string;
  bio: string;
  motive: string;
  secrets: string[];
  statements: string[];
  knownTimeline: string[];
  relatedEvidence: string[];
};

export type Location = {
  id: string;
  name: string;
  category: string;
  description: string;
  floor: string;
  publicNotes: string;
};

export type Evidence = {
  id: string;
  title: string;
  category: EvidenceCategory;
  description: string;
  unlockedBy: string;
  relatedCharacters: string[];
  relatedLocations: string[];
  significance: string;
  possibleInterpretations: string[];
  isCritical: boolean;
};

export type InterviewChoice = {
  label: string;
  nextNodeId: string;
  requiresEvidence: string[];
  unlocksEvidence: string[];
};

export type InterviewNode = {
  id: string;
  prompt: string;
  response: string;
  requiredEvidence: string[];
  unlocksEvidence: string[];
  choices: InterviewChoice[];
};

export type Interview = {
  id: string;
  characterId: string;
  title: string;
  phase: string;
  description: string;
  nodes: InterviewNode[];
};

export type TimelineEvent = {
  id: string;
  time: string;
  label: string;
  description: string;
  locationId: string;
  characterIds: string[];
  evidenceIds: string[];
  isPublic: boolean;
  isTrue: boolean;
  sortOrder: number;
};

export type RelationshipType =
  | "family"
  | "work"
  | "financial"
  | "romantic"
  | "conflict"
  | "institutional";

export type Relationship = {
  id: string;
  fromId: string;
  toId: string;
  type: RelationshipType;
  label: string;
  description: string;
  evidenceIds: string[];
};

export type Hypothesis = {
  id: string;
  title: string;
  description: string;
  suggestedStatus: HypothesisStatus;
  evidenceIds: string[];
};

export type SuspectEliminationCandidate = {
  characterId: string;
  selectedEvidenceIds: string[];
  note: string;
  eliminated: boolean;
};

export type RequiredElimination = {
  characterId: string;
  publicReason: string;
  requiredEvidenceIds: string[];
};

export type FinalReportInput = {
  culpritId: string;
  locationId: string;
  fatalTime: string;
  method: string;
  motive: string;
  rejectsOfficeWeapon: boolean;
  misleadingExplanation: string;
  requiredEvidenceIds: string[];
  eliminatedSuspectIds: string[];
  eliminationEvidence: Record<string, string[]>;
  writtenExplanation: string;
};

export type HiddenSolution = {
  caseId: string;
  culpritId: string;
  locationId: string;
  acceptedStartTime: string;
  acceptedEndTime: string;
  method: string;
  motiveKeywords: string[][];
  requiredEvidenceIds: string[];
  requiredEliminations: RequiredElimination[];
  hiddenExplanation: string;
};

export type ValidationSection =
  | "culprit"
  | "scene"
  | "time"
  | "method"
  | "motive"
  | "office_misdirection"
  | "key_evidence"
  | "eliminations"
  | "written_explanation";

export type ValidationResult = {
  correct: boolean;
  sections: Record<ValidationSection, boolean>;
  missingRequiredEvidence: string[];
  missingEliminations: string[];
  unsupportedEliminations: string[];
  publicFeedback: string[];
};
