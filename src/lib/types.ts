export type GradeLevel = "prep" | "1" | "2" | "3" | "4" | "5" | "6";
export type Term = 1 | 2 | 3 | 4;

export type WorksheetTopic =
  | "number"
  | "measurement"
  | "geometry"
  | "statistics";

export type Operation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division";

export type WorksheetFormat =
  | "horizontal"
  | "vertical"
  | "fill-blank"
  | "multiple-choice"
  | "word";

export type DifficultyMode = "fixed" | "adaptive" | "curriculum";

export interface WorksheetConfig {
  grade: GradeLevel;
  term: Term;
  topic: WorksheetTopic;
  operations: Operation[];
  minOperand: number;
  maxOperand: number;
  operandsPerQuestion: 2 | 3;
  format: WorksheetFormat;
  questionCount: number;
  allowCarrying: boolean;
  allowBorrowing: boolean;
  includeWordProblems: boolean;
  includeTimeLimit: boolean;
  difficultyMode: DifficultyMode;
  seed: string;
}

export interface WorksheetQuestion {
  id: string;
  prompt: string;
  answer: string;
  operation: Operation;
  format: WorksheetFormat;
  metadata: Record<string, unknown>;
}

export interface WorksheetPayload {
  config: WorksheetConfig;
  questions: WorksheetQuestion[];
  generatedAt: string;
}
