# MathPDF Codex

Curriculum-aligned worksheet builder for primary maths classrooms. Tune Australian year/term difficulty, mix arithmetic operations, constrain regrouping rules, and export polished PDFs with answer keys in one click.

## Features

- **Fine-grained difficulty controls** – set year level, term, number ranges, operation mix, operands per problem, and regrouping constraints.
- **Live preview** – instant sample questions update as you tweak settings.
- **One-click PDF export** – server-side PDF generation with student header section and answer key.
- **Supabase-friendly** – optional persistence hook saves worksheet metadata when credentials are provided.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to reach the builder.

## Environment variables

The Supabase integration is optional but ready to go. Create a `.env.local` file if you want to persist generated worksheets:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=service-role-or-anon-key
```

If these are absent, worksheet saves are skipped gracefully.

## Generating PDFs

1. Adjust configuration on the left panel until the preview matches your target difficulty.
2. Click **Generate worksheet** to request a full set from the API.
3. Use the **Download PDF** button to save the file. The PDF includes an answer key on the final page.

## Project structure

- `src/app/page.tsx` – main client UI and live preview logic.
- `src/lib/generator.ts` – deterministic question generator with regrouping constraints.
- `src/lib/pdf.ts` – PDFKit layout for worksheet + answer key.
- `src/app/api/worksheet/route.ts` – API endpoint that validates config, persists metadata, and streams the PDF.

## Roadmap ideas

- Hook Supabase history into an adaptive mode that nudges number ranges from recent performance.
- Add additional topics (fractions, measurement, geometry) and bespoke generators.
- Provide class progress dashboards and spaced-review scheduling.
