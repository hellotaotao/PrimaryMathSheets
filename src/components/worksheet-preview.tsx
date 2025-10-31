import type { WorksheetPayload, WorksheetQuestion } from "@/lib/types";

interface WorksheetPreviewProps {
  payload: WorksheetPayload;
  mode: "worksheet" | "answers";
  columns?: number;
  densityLabel?: string;
  rows?: number;
}

function sanitizePrompt(prompt: string) {
  return prompt
    .replace(/\s*=\s*(_+)?$/u, "")
    .replace(/\s*=\s*$/u, "")
    .replace(/\s*=\s*\?$/u, "")
    .trim();
}

function AnswerKey({ payload }: { payload: WorksheetPayload }) {
  return (
    <div className="flex flex-col gap-3">
      {payload.questions.map((question, index) => (
        <div
          key={question.id}
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm"
        >
          <span className="text-sm font-semibold text-slate-500">
            {index + 1}
          </span>
          <span className="text-base font-semibold text-slate-800">
            {question.answer}
          </span>
        </div>
      ))}
    </div>
  );
}

export function WorksheetPreview({
  payload,
  mode,
  columns = 4,
  densityLabel,
  rows,
}: WorksheetPreviewProps) {
  const subtitle = `Grade ${payload.config.grade.toUpperCase()} - Term ${payload.config.term}`;
  const badge = `${densityLabel ?? payload.config.format.replace("-", " ")} (${payload.questions.length})`;

  const columnCount = Math.max(
    1,
    Math.min(columns, payload.questions.length || columns),
  );
  const rowsPerColumn =
    rows ?? Math.ceil(payload.questions.length / columnCount);
  const columnChunks: WorksheetQuestion[][] = Array.from(
    { length: columnCount },
    (_, columnIndex) => {
      const start = columnIndex * rowsPerColumn;
      const end = start + rowsPerColumn;
      return payload.questions.slice(start, end);
    },
  );

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">Preview</p>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
          {badge}
        </span>
      </header>

      {mode === "answers" ? (
        <AnswerKey payload={payload} />
      ) : (
        <div className="relative mx-auto flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-inner">
          <div
            className="grid h-full flex-1 gap-0 px-10 py-8"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
            }}
          >
            {columnChunks.map((column, columnIndex) => (
              <div
                key={`column-${columnIndex}`}
                className="flex flex-col justify-start border-l border-slate-200 px-5 first:border-l-0"
              >
                <ol className="flex flex-1 flex-col justify-start gap-3 text-left text-lg font-semibold text-slate-800">
                  {column.map((question, index) => (
                    <li
                      key={question.id}
                      className="flex items-baseline gap-2 whitespace-pre text-left leading-tight"
                    >
                      <span className="text-xs font-semibold text-slate-400">
                        {columnIndex * rowsPerColumn + index + 1}.
                      </span>
                      <span className="flex-1">{sanitizePrompt(question.prompt)}</span>
                    </li>
                  ))}
                  {column.length < rowsPerColumn
                    ? Array.from(
                        { length: rowsPerColumn - column.length },
                        (_, fillerIndex) => (
                          <li
                            key={`blank-${columnIndex}-${fillerIndex}`}
                            className="flex items-baseline gap-2 whitespace-pre text-left leading-tight text-slate-300"
                          >
                            <span className="text-xs font-semibold">-</span>
                            <span className="flex-1 border-b border-dashed border-slate-300" />
                          </li>
                        ),
                      )
                    : null}
                </ol>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
