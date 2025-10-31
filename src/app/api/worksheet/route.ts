import { NextResponse } from "next/server";
import { z } from "zod";
import { generateWorksheet } from "@/lib/generator";
import { buildWorksheetPdf } from "@/lib/pdf";
import { saveWorksheet } from "@/lib/supabase";
import type { WorksheetConfig } from "@/lib/types";

const configSchema = z.object({
  grade: z.enum(["prep", "1", "2", "3", "4", "5", "6"]),
  term: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
  ]),
  topic: z.enum(["number", "measurement", "geometry", "statistics"]),
  operations: z
    .array(z.enum(["addition", "subtraction", "multiplication", "division"]))
    .min(1),
  minOperand: z.number().nonnegative(),
  maxOperand: z.number().positive(),
  operandsPerQuestion: z.union([z.literal(2), z.literal(3)]),
  format: z.enum(["horizontal", "vertical", "fill-blank", "multiple-choice", "word"]),
  questionCount: z.number().int().min(5).max(50),
  allowCarrying: z.boolean(),
  allowBorrowing: z.boolean(),
  includeWordProblems: z.boolean(),
  includeTimeLimit: z.boolean(),
  difficultyMode: z.enum(["fixed", "adaptive", "curriculum"]),
  seed: z.string().optional(),
});

export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload", detail: String(error) },
      { status: 400 },
    );
  }

  const parsed = configSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid configuration", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const config: WorksheetConfig = {
    ...parsed.data,
    seed: parsed.data.seed ?? Date.now().toString(),
  };

  if (config.minOperand > config.maxOperand) {
    return NextResponse.json(
      { error: "minOperand must be less than maxOperand" },
      { status: 422 },
    );
  }

  const payload = generateWorksheet(config, config.seed);

  try {
    await saveWorksheet(payload);
  } catch (error) {
    console.error("Failed to persist worksheet in Supabase", error);
  }

  try {
    const pdfBuffer = await buildWorksheetPdf(payload);
    const uint8 = Uint8Array.from(pdfBuffer);
    const blob = new Blob([uint8], { type: "application/pdf" });
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=worksheet-${config.grade}-${config.term}.pdf`,
        "X-Worksheet-Seed": config.seed,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate PDF", detail: String(error) },
      { status: 500 },
    );
  }
}
