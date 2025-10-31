import type { GradeLevel, Term, WorksheetConfig } from "./types";

type CurriculumDefaults = Record<
  `${GradeLevel}-${Term}`,
  Partial<Pick<WorksheetConfig, "minOperand" | "maxOperand" | "operations" | "operandsPerQuestion" | "allowCarrying" | "allowBorrowing" | "includeWordProblems">>
>;

const defaults: CurriculumDefaults = {
  "prep-1": {
    minOperand: 0,
    maxOperand: 10,
    operations: ["addition", "subtraction"],
    operandsPerQuestion: 2,
    allowCarrying: false,
    allowBorrowing: false,
  },
  "prep-2": {
    minOperand: 0,
    maxOperand: 10,
    operations: ["addition", "subtraction"],
    operandsPerQuestion: 2,
    allowCarrying: false,
    allowBorrowing: false,
  },
  "prep-3": {
    minOperand: 0,
    maxOperand: 20,
    operations: ["addition", "subtraction"],
    operandsPerQuestion: 2,
    allowCarrying: false,
    allowBorrowing: false,
  },
  "prep-4": {
    minOperand: 0,
    maxOperand: 20,
    operations: ["addition", "subtraction"],
    operandsPerQuestion: 2,
    allowCarrying: false,
    allowBorrowing: false,
  },
  "1-1": {
    minOperand: 0,
    maxOperand: 20,
    operations: ["addition", "subtraction"],
    operandsPerQuestion: 2,
    allowCarrying: false,
    allowBorrowing: false,
  },
  "1-2": {
    minOperand: 0,
    maxOperand: 20,
    operations: ["addition", "subtraction"],
    operandsPerQuestion: 2,
    allowCarrying: false,
    allowBorrowing: false,
  },
  "1-3": {
    minOperand: 0,
    maxOperand: 50,
    operations: ["addition", "subtraction"],
    operandsPerQuestion: 2,
    allowCarrying: true,
    allowBorrowing: true,
  },
  "1-4": {
    minOperand: 0,
    maxOperand: 50,
    operations: ["addition", "subtraction"],
    operandsPerQuestion: 2,
    allowCarrying: true,
    allowBorrowing: true,
  },
  "2-1": {
    minOperand: 0,
    maxOperand: 99,
    operations: ["addition", "subtraction"],
    operandsPerQuestion: 2,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "2-2": {
    minOperand: 0,
    maxOperand: 99,
    operations: ["addition", "subtraction"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "2-3": {
    minOperand: 0,
    maxOperand: 144,
    operations: ["addition", "subtraction", "multiplication"],
    operandsPerQuestion: 2,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "2-4": {
    minOperand: 0,
    maxOperand: 144,
    operations: ["addition", "subtraction", "multiplication"],
    operandsPerQuestion: 2,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "3-1": {
    minOperand: 0,
    maxOperand: 500,
    operations: ["addition", "subtraction", "multiplication"],
    operandsPerQuestion: 2,
    allowCarrying: true,
    allowBorrowing: true,
  },
  "3-2": {
    minOperand: 0,
    maxOperand: 500,
    operations: ["addition", "subtraction", "multiplication"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
  },
  "3-3": {
    minOperand: 0,
    maxOperand: 999,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 2,
    allowCarrying: true,
    allowBorrowing: true,
  },
  "3-4": {
    minOperand: 0,
    maxOperand: 999,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 2,
    allowCarrying: true,
    allowBorrowing: true,
  },
  "4-1": {
    minOperand: 0,
    maxOperand: 999,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "4-2": {
    minOperand: 0,
    maxOperand: 999,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "4-3": {
    minOperand: 0,
    maxOperand: 999,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "4-4": {
    minOperand: 0,
    maxOperand: 999,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "5-1": {
    minOperand: 0,
    maxOperand: 999,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "5-2": {
    minOperand: 0,
    maxOperand: 999,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "5-3": {
    minOperand: 0,
    maxOperand: 999,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "5-4": {
    minOperand: 0,
    maxOperand: 999,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "6-1": {
    minOperand: 0,
    maxOperand: 10000,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "6-2": {
    minOperand: 0,
    maxOperand: 10000,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "6-3": {
    minOperand: 0,
    maxOperand: 10000,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
  "6-4": {
    minOperand: 0,
    maxOperand: 10000,
    operations: ["addition", "subtraction", "multiplication", "division"],
    operandsPerQuestion: 3,
    allowCarrying: true,
    allowBorrowing: true,
    includeWordProblems: true,
  },
};

const baseConfig: WorksheetConfig = {
  grade: "3",
  term: 1,
  topic: "number",
  operations: ["addition", "subtraction"],
  minOperand: 0,
  maxOperand: 50,
  operandsPerQuestion: 2,
  format: "horizontal",
  questionCount: 36,
  allowCarrying: true,
  allowBorrowing: true,
  includeWordProblems: false,
  includeTimeLimit: false,
  difficultyMode: "fixed",
  seed: "preview",
};

export function defaultConfig(): WorksheetConfig {
  return { ...baseConfig };
}

export function curriculumConfig(grade: GradeLevel, term: Term): WorksheetConfig {
  const key = `${grade}-${term}` as const;
  const overrides = defaults[key] ?? {};
  return {
    ...baseConfig,
    grade,
    term,
    ...overrides,
  };
}

export function numberRangePresets(grade: GradeLevel) {
  if (grade === "prep") {
    return [10, 20];
  }
  if (grade === "1") {
    return [20, 50];
  }
  if (grade === "2") {
    return [50, 100];
  }
  if (grade === "3") {
    return [100, 500];
  }
  if (grade === "4") {
    return [100, 1000];
  }
  if (grade === "5") {
    return [500, 1000];
  }
  return [1000, 10000];
}
