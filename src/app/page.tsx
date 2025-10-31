"use client";

import { useEffect, useMemo, useState } from "react";
import {
  curriculumConfig,
  defaultConfig,
  numberRangePresets,
} from "@/lib/curriculum";
import { generateWorksheet } from "@/lib/generator";
import { WorksheetPreview } from "@/components/worksheet-preview";
import type {
  GradeLevel,
  Operation,
  Term,
  WorksheetConfig,
  WorksheetFormat,
  WorksheetPayload,
} from "@/lib/types";

const gradeOptions: { value: GradeLevel; label: string }[] = [
  { value: "prep", label: "Prep" },
  { value: "1", label: "Year 1" },
  { value: "2", label: "Year 2" },
  { value: "3", label: "Year 3" },
  { value: "4", label: "Year 4" },
  { value: "5", label: "Year 5" },
  { value: "6", label: "Year 6" },
];

const termOptions: { value: Term; label: string }[] = [
  { value: 1, label: "Term 1" },
  { value: 2, label: "Term 2" },
  { value: 3, label: "Term 3" },
  { value: 4, label: "Term 4" },
];

const operationLabels: Record<Operation, string> = {
  addition: "Addition",
  subtraction: "Subtraction",
  multiplication: "Multiplication",
  division: "Division",
};

const formatOptions: { value: WorksheetFormat; label: string }[] = [
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
  { value: "fill-blank", label: "Fill in the blank" },
  { value: "multiple-choice", label: "Multiple choice" },
];

const densityOptions = [
  {
    id: "spacious",
    label: "Spacious",
    description: "3 cols x 8 rows (24 qns)",
    count: 24,
    columns: 3,
    rows: 8,
  },
  {
    id: "standard",
    label: "Standard",
    description: "4 cols x 9 rows (36 qns)",
    count: 36,
    columns: 4,
    rows: 9,
  },
  {
    id: "compact",
    label: "Compact",
    description: "5 cols x 10 rows (50 qns)",
    count: 50,
    columns: 5,
    rows: 10,
  },
];

type StatusState = "idle" | "generating" | "error";

export default function Home() {
  const [config, setConfig] = useState<WorksheetConfig>(() => defaultConfig());
  const [preview, setPreview] = useState<WorksheetPayload>(() => {
    const initial = defaultConfig();
    return generateWorksheet(initial, initial.seed);
  });
  const [previewMode, setPreviewMode] = useState<"worksheet" | "answers">(
    "worksheet",
  );
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  useEffect(() => {
    const nextPreview = generateWorksheet(config, config.seed);
    setPreview(nextPreview);
  }, [config]);

  const numberPresets = useMemo(
    () => numberRangePresets(config.grade),
    [config.grade],
  );

  const activeDensity = useMemo(
    () =>
      densityOptions.find((option) => option.count === config.questionCount) ??
      densityOptions[1],
    [config.questionCount],
  );

  const handleGradeChange = (grade: GradeLevel) => {
    setConfig((previous) => {
      const base = curriculumConfig(grade, previous.term);
      return {
        ...base,
        format: previous.format,
        questionCount: previous.questionCount,
        includeTimeLimit: previous.includeTimeLimit,
        difficultyMode:
          previous.difficultyMode === "fixed"
            ? "curriculum"
            : previous.difficultyMode,
        seed: previous.seed,
      };
    });
  };

  const handleTermChange = (term: Term) => {
    setConfig((previous) => {
      const base = curriculumConfig(previous.grade, term);
      return {
        ...base,
        format: previous.format,
        questionCount: previous.questionCount,
        includeTimeLimit: previous.includeTimeLimit,
        difficultyMode:
          previous.difficultyMode === "fixed"
            ? "curriculum"
            : previous.difficultyMode,
        seed: previous.seed,
      };
    });
  };

  const toggleOperation = (operation: Operation) => {
    setConfig((previous) => {
      if (previous.operations.includes(operation)) {
        if (previous.operations.length === 1) {
          return previous;
        }
        return {
          ...previous,
          operations: previous.operations.filter((op) => op !== operation),
        };
      }
      return { ...previous, operations: [...previous.operations, operation] };
    });
  };

  const toggleDifficultyMode = () => {
    setConfig((previous) => {
      const order: WorksheetConfig["difficultyMode"][] = [
        "fixed",
        "curriculum",
        "adaptive",
      ];
      const index = order.indexOf(previous.difficultyMode);
      const nextMode = order[(index + 1) % order.length];
      return { ...previous, difficultyMode: nextMode };
    });
  };

  const handleGenerate = async () => {
    const newSeed =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Date.now().toString();

    const requestConfig: WorksheetConfig = { ...config, seed: newSeed };
    setConfig(requestConfig);
    setStatus("generating");
    setError(null);
    setPreviewMode("worksheet");

    try {
      const response = await fetch("/api/worksheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestConfig),
      });

      if (!response.ok) {
        let message = "Worksheet generation failed.";
        try {
          const data = await response.json();
          if (data.error) {
            message = data.error;
          }
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12">
      <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-10 px-6 lg:grid lg:grid-cols-[minmax(380px,460px)_minmax(0,1fr)] lg:gap-12 xl:max-w-[1700px]">
        <section className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/70 lg:sticky lg:top-10 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
          <header className="mb-8">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              Curriculum-aligned maths practice
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 lg:text-4xl">
              Primary Math Worksheets
            </h1>
            <p className="mt-3 max-w-xl text-base text-slate-600">
              Auto-generated printable practice sets with curriculum-aligned
              difficulty controls, ready for PDF download.
            </p>
          </header>

          <div className="flex flex-col gap-6">
            <div className="space-y-6 rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Core Settings
                </h2>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                  {config.minOperand} - {config.maxOperand}
                </span>
              </div>

              <div className="space-y-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Year Level
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {gradeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleGradeChange(option.value)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          config.grade === option.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">Term</span>
                  <div className="grid grid-cols-2 gap-2">
                    {termOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleTermChange(option.value)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          config.term === option.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Bundled Difficulty Mode
                  </span>
                  <button
                    type="button"
                    onClick={toggleDifficultyMode}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-700"
                  >
                    Mode:{" "}
                    <span className="font-semibold capitalize text-slate-900">
                      {config.difficultyMode}
                    </span>
                  </button>
                </label>
              </div>

              <div className="space-y-4 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                  <span>Number range</span>
                  <span>{config.minOperand} - {config.maxOperand}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-slate-500">Minimum value</span>
                    <input
                      type="number"
                      min={0}
                      value={config.minOperand}
                      onChange={(event) =>
                        setConfig((previous) => ({
                          ...previous,
                          minOperand: Number.parseInt(event.target.value, 10),
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-slate-500">Maximum value</span>
                    <input
                      type="number"
                      min={config.minOperand + 1}
                      value={config.maxOperand}
                      onChange={(event) =>
                        setConfig((previous) => ({
                          ...previous,
                          maxOperand: Number.parseInt(event.target.value, 10),
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  {numberPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        setConfig((previous) => ({
                          ...previous,
                          minOperand: 0,
                          maxOperand: preset,
                        }))
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        config.maxOperand === preset && config.minOperand === 0
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      0 - {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4 rounded-2xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Worksheet Layout Density
            </h2>
            <p className="text-sm text-slate-600">
              Sized for a single A4 page. Pick a layout to suit how much practice you want on each sheet.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {densityOptions.map((option) => {
                const active = option.count === config.questionCount;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setConfig((previous) => ({
                        ...previous,
                        questionCount: option.count,
                      }))
                    }
                    className={`flex h-full flex-col justify-between rounded-2xl border px-4 py-4 text-left transition ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{option.label}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 space-y-4 rounded-2xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Operations &amp; Format
            </h2>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(operationLabels) as Operation[]).map((operation) => (
                <button
                  key={operation}
                  type="button"
                  onClick={() => toggleOperation(operation)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    config.operations.includes(operation)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {operationLabels[operation]}
                </button>
              ))}
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Preferred format
              </span>
              <div className="grid grid-cols-2 gap-2">
                {formatOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setConfig((previous) => ({
                        ...previous,
                        format: option.value,
                      }))
                    }
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      config.format === option.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Numbers per question
              </span>
              <div className="flex gap-2">
                {[2, 3].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setConfig((previous) => ({
                        ...previous,
                        operandsPerQuestion: value as 2 | 3,
                      }))
                    }
                    className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                      config.operandsPerQuestion === value
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {value} numbers
                  </button>
                ))}
              </div>
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={!config.allowCarrying}
                  onChange={() =>
                    setConfig((previous) => ({
                      ...previous,
                      allowCarrying: !previous.allowCarrying,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                No carrying
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={!config.allowBorrowing}
                  onChange={() =>
                    setConfig((previous) => ({
                      ...previous,
                      allowBorrowing: !previous.allowBorrowing,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                No borrowing
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={config.includeWordProblems}
                  onChange={() =>
                    setConfig((previous) => ({
                      ...previous,
                      includeWordProblems: !previous.includeWordProblems,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Mix in word problems
              </label>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">
                Difficulty summary
              </p>
              <p className="mt-1">
                {config.operations.length === 1
                  ? `Focus on ${operationLabels[config.operations[0]]}`
                  : `Mix of ${config.operations
                      .map((op) => operationLabels[op])
                      .join(", ")}`}
                {config.includeWordProblems
                  ? " with contextual word problems."
                  : "."}
              </p>
              <p className="mt-1">
                Numbers between {config.minOperand} and {config.maxOperand},{" "}
                {config.operandsPerQuestion} operands per question, currently{" "}
                {activeDensity.description}.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={status === "generating"}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {status === "generating" ? "Generating..." : "Generate worksheet"}
            </button>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download={`worksheet-${config.grade}-term-${config.term}.pdf`}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Download PDF
                </a>
              ) : (
                <span className="rounded-full border border-dashed border-slate-300 px-4 py-2">
                  PDF ready after generation
                </span>
              )}
            </div>
          </div>

          {status === "error" && error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </section>

        <aside className="space-y-6 rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/70 lg:min-h-[720px] lg:overflow-hidden xl:p-10">
          <div className="flex flex-col gap-4">
            <header>
              <h2 className="text-2xl font-semibold text-slate-900">
                Live preview
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                The preview mirrors the PDF layout. Switch between the worksheet
                page and the generated answer key.
              </p>
            </header>

            <div className="inline-flex self-start rounded-full border border-slate-200 bg-slate-100 p-1 text-sm font-medium text-slate-600">
              <button
                type="button"
                onClick={() => setPreviewMode("worksheet")}
                className={`rounded-full px-4 py-2 transition ${
                  previewMode === "worksheet"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "hover:text-slate-900"
                }`}
              >
                Worksheet
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("answers")}
                className={`rounded-full px-4 py-2 transition ${
                  previewMode === "answers"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "hover:text-slate-900"
                }`}
              >
                Answer key
              </button>
            </div>
          </div>

          <WorksheetPreview
            payload={preview}
            mode={previewMode}
            columns={activeDensity.columns}
            densityLabel={activeDensity.label}
            rows={activeDensity.rows}
          />
        </aside>
      </main>
    </div>
  );
}
