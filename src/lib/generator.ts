import seedrandom from "seedrandom";
import type {
  Operation,
  WorksheetConfig,
  WorksheetFormat,
  WorksheetPayload,
  WorksheetQuestion,
} from "./types";

type Rng = seedrandom.PRNG;

const OPERATOR_SYMBOL: Record<Operation, string> = {
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
};

const NAMES = [
  "Ava",
  "Noah",
  "Liam",
  "Sophia",
  "Ethan",
  "Mia",
  "Lucas",
  "Isla",
  "Oliver",
  "Amelia",
];

const OBJECTS = [
  "shells",
  "marbles",
  "stickers",
  "books",
  "pencils",
  "apples",
  "balloons",
  "blocks",
];

const ACTIVITIES = [
  "collects",
  "shares",
  "gives",
  "keeps",
  "finds",
  "loses",
];

function randomInt(rng: Rng, min: number, max: number) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(rng() * (high - low + 1)) + low;
}

function selectOperation(operations: Operation[], rng: Rng): Operation {
  if (operations.length === 0) {
    return "addition";
  }
  const idx = Math.floor(rng() * operations.length);
  return operations[idx];
}

function digitSumAtPlace(value: number, place: number) {
  return Math.floor(value / place) % 10;
}

function hasCarrying(operands: number[]) {
  const maxDigits = Math.max(...operands).toString().length;
  let placeValue = 1;
  for (let i = 0; i < maxDigits; i += 1) {
    const sum = operands.reduce(
      (acc, operand) => acc + digitSumAtPlace(operand, placeValue),
      0,
    );
    if (sum >= 10) {
      return true;
    }
    placeValue *= 10;
  }
  return false;
}

function hasBorrowing(minuend: number, subtrahend: number) {
  const maxDigits = Math.max(minuend, subtrahend).toString().length;
  let placeValue = 1;
  for (let i = 0; i < maxDigits; i += 1) {
    const topDigit = digitSumAtPlace(minuend, placeValue);
    const bottomDigit = digitSumAtPlace(subtrahend, placeValue);
    if (topDigit < bottomDigit) {
      return true;
    }
    placeValue *= 10;
  }
  return false;
}

function generateOperands(
  operation: Operation,
  config: WorksheetConfig,
  rng: Rng,
): number[] {
  const operands: number[] = [];
  const operandCount =
    operation === "subtraction" ? 2 : config.operandsPerQuestion;
  let attempts = 0;
  while (operands.length < operandCount && attempts < 50) {
    operands.push(randomInt(rng, config.minOperand, config.maxOperand));
    attempts += 1;
  }
  return operands;
}

function generateArithmeticQuestion(
  id: string,
  operation: Operation,
  format: WorksheetFormat,
  config: WorksheetConfig,
  rng: Rng,
): WorksheetQuestion {
  let operands = generateOperands(operation, config, rng);
  let attempts = 0;

  while (attempts < 100) {
    if (operation === "addition" && !config.allowCarrying) {
      if (!hasCarrying(operands)) {
        break;
      }
    } else if (operation === "subtraction" && !config.allowBorrowing) {
      const minuend = Math.max(...operands);
      const subtrahend = Math.min(...operands);
      if (
        minuend >= subtrahend &&
        !hasBorrowing(minuend, subtrahend)
      ) {
        operands = [minuend, subtrahend];
        break;
      }
    } else {
      break;
    }

    operands = generateOperands(operation, config, rng);
    attempts += 1;
  }

  const prompt = formatPrompt(operands, operation, format);
  const answer = computeAnswer(operands, operation);

  return {
    id,
    prompt,
    answer: answer.toString(),
    operation,
    format,
    metadata: {
      operands,
      operator: OPERATOR_SYMBOL[operation],
    },
  };
}

function computeAnswer(operands: number[], operation: Operation) {
  switch (operation) {
    case "addition":
      return operands.reduce((acc, value) => acc + value, 0);
    case "subtraction": {
      const [first, second] = operands;
      return first - second;
    }
    case "multiplication":
      return operands.reduce((acc, value) => acc * value, 1);
    case "division": {
      const [dividend, divisor] = operands;
      return Math.floor(dividend / Math.max(divisor, 1));
    }
    default:
      return 0;
  }
}

function formatPrompt(
  operands: number[],
  operation: Operation,
  format: WorksheetFormat,
) {
  const symbol = OPERATOR_SYMBOL[operation];
  if (format === "vertical") {
    const lines = [
      operands[0].toString().padStart(4, " "),
      `${symbol} ${operands[1].toString().padStart(2, " ")}`,
      "——",
    ];
    if (operands.length === 3) {
      lines.splice(
        1,
        0,
        `  ${symbol} ${operands[2].toString().padStart(2, " ")}`,
      );
    }
    return lines.join("\n");
  }
  if (format === "fill-blank") {
    return `${operands.join(` ${symbol} `)} = ____`;
  }
  if (format === "multiple-choice") {
    return `${operands.join(` ${symbol} `)} = ?`;
  }
  return `${operands.join(` ${symbol} `)} =`;
}

function generateWordProblem(
  id: string,
  operation: Operation,
  config: WorksheetConfig,
  rng: Rng,
): WorksheetQuestion {
  const nameA = NAMES[randomInt(rng, 0, NAMES.length - 1)];
  let nameB = NAMES[randomInt(rng, 0, NAMES.length - 1)];
  if (nameA === nameB) {
    nameB = NAMES[(NAMES.indexOf(nameA) + 3) % NAMES.length];
  }
  const object = OBJECTS[randomInt(rng, 0, OBJECTS.length - 1)];
  const activity = ACTIVITIES[randomInt(rng, 0, ACTIVITIES.length - 1)];
  const operands = generateOperands(operation, config, rng);
  const answer = computeAnswer(operands, operation);

  let prompt = "";

  switch (operation) {
    case "addition":
      prompt = `${nameA} has ${operands[0]} ${object}. ${nameB} ${activity} ${operands[1]} more. How many ${object} do they have altogether?`;
      break;
    case "subtraction":
      prompt = `${nameA} collected ${operands[0]} ${object}. They ${activity} ${operands[1]} to ${nameB}. How many ${object} are left?`;
      break;
    case "multiplication":
      prompt = `${nameA} arranges ${object} into ${operands[0]} groups with ${operands[1]} in each group. How many ${object} are there?`;
      break;
    case "division":
      prompt = `${nameA} has ${operands[0]} ${object} and shares them equally with ${operands[1]} friends. How many ${object} does each person receive?`;
      break;
  }

  return {
    id,
    prompt,
    answer: answer.toString(),
    operation,
    format: "word",
    metadata: {
      operands,
      operator: OPERATOR_SYMBOL[operation],
    },
  };
}

export function generateWorksheet(
  config: WorksheetConfig,
  seed?: string,
): WorksheetPayload {
  const rng = seedrandom(seed ?? config.seed ?? Date.now().toString());

  const questions: WorksheetQuestion[] = [];
  for (let i = 0; i < config.questionCount; i += 1) {
    const operation = selectOperation(config.operations, rng);
    const useWordProblem =
      config.includeWordProblems && i % 5 === 4 && config.topic === "number";
    const format = useWordProblem ? "word" : config.format;
    const id = `q-${i + 1}`;

    const question = useWordProblem
      ? generateWordProblem(id, operation, config, rng)
      : generateArithmeticQuestion(id, operation, format, config, rng);

    questions.push(question);
  }

  return {
    config,
    questions,
    generatedAt: new Date().toISOString(),
  };
}
