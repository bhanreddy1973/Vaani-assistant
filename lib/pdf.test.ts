import { describe, expect, it } from "vitest";
import { bankAccountOpeningSchema } from "./forms/catalog";
import { generateFilledFormPdf } from "./pdf";

describe("generateFilledFormPdf", () => {
  it("produces a non-empty valid PDF byte stream", async () => {
    const bytes = await generateFilledFormPdf(
      bankAccountOpeningSchema,
      { full_name: "Ramesh Kumar", mobile: "9840950950", aadhaar: "123412341234" },
      "VAANI-2026-ABC123",
    );

    expect(bytes.length).toBeGreaterThan(500);
    const header = Buffer.from(bytes.slice(0, 5)).toString("utf-8");
    expect(header).toBe("%PDF-");
  });

  it("masks sensitive fields except the last 4 digits", async () => {
    const bytes = await generateFilledFormPdf(
      bankAccountOpeningSchema,
      { aadhaar: "123412341234" },
      "VAANI-2026-ABC123",
    );
    const text = Buffer.from(bytes).toString("latin1");
    // The raw full Aadhaar should not appear verbatim in the PDF content stream.
    expect(text.includes("123412341234")).toBe(false);
  });
});
