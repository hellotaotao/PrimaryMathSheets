import PDFDocument from "pdfkit";
import type { WorksheetPayload } from "./types";

export function buildWorksheetPdf(payload: WorksheetPayload) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 54,
      info: {
        Title: "Math Worksheet",
        Author: "MathPDF Codex",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (error) => reject(error));

    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .text("Math Worksheet", { align: "center" })
      .moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(12)
      .text(
        `Grade ${payload.config.grade.toUpperCase()}  •  Term ${payload.config.term}  •  Topic: ${payload.config.topic}`,
        { align: "center" },
      )
      .moveDown(0.5);

    doc
      .fontSize(10)
      .text(`Generated ${new Date(payload.generatedAt).toLocaleString()}`, {
        align: "center",
      })
      .moveDown(1.5);

    doc
      .fontSize(12)
      .text("Student:", { continued: true })
      .text(" ________________________________", { underline: false })
      .moveDown(0.5);

    doc
      .text("Date:", { continued: true })
      .text(" ________________________________", { underline: false })
      .moveDown(1);

    payload.questions.forEach((question, index) => {
      const numberLabel = `${index + 1}. `;
      doc
        .font("Helvetica-Bold")
        .text(numberLabel, { continued: true, lineGap: 6 })
        .font("Helvetica")
        .text(question.prompt.replace(/−/g, "-").replace(/×/g, "×"), {
          lineGap: 6,
        })
        .moveDown(0.75);

      if (question.format !== "word") {
        doc.moveDown(0.25);
      }
    });

    doc.addPage();
    doc.font("Helvetica-Bold").fontSize(18).text("Answer Key").moveDown(1);

    payload.questions.forEach((question, index) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(`${index + 1}.`, { continued: true })
        .font("Helvetica")
        .text(` ${question.answer}`, { continued: false })
        .moveDown(0.5);
    });

    doc.end();
  });
}
