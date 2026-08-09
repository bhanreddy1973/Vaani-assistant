import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { FormSchema } from "./forms/schema";

/**
 * Renders a completed session's fields as a simple, print-ready PDF.
 * Kept intentionally plain (label: value per line) so it works for any
 * catalog or uploaded form schema without a bespoke template per form.
 */
export async function generateFilledFormPdf(
  schema: FormSchema,
  fields: Record<string, string>,
  referenceNumber: string,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  let y = 841.89 - margin;

  page.drawText(schema.title.en ?? schema.form_id, {
    x: margin,
    y,
    size: 18,
    font: bold,
    color: rgb(0.04, 0.37, 0.22),
  });
  y -= 24;

  page.drawText(`Reference number: ${referenceNumber}`, {
    x: margin,
    y,
    size: 11,
    font,
    color: rgb(0.36, 0.38, 0.44),
  });
  y -= 30;

  for (const field of schema.fields) {
    const value = fields[field.key] ?? "";
    const isSensitive = field.sensitive && value.length > 4;
    const displayValue = isSensitive ? `${"*".repeat(value.length - 4)}${value.slice(-4)}` : value;

    page.drawText(`${field.label}:`, { x: margin, y, size: 11, font: bold });
    page.drawText(displayValue || "-", { x: margin + 220, y, size: 11, font });
    y -= 20;

    if (y < margin) break; // simple single-page cap for the demo
  }

  return pdfDoc.save();
}
