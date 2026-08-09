import { describe, expect, it } from "vitest";
import { getRequiredFields, validateFormSchema, type FormSchema } from "./schema";

const validSchema: FormSchema = {
  form_id: "sample_form",
  title: { en: "Sample Form" },
  category: "bank",
  fields: [
    { key: "full_name", label: "Full name", type: "text", required: true },
    { key: "account_type", label: "Account type", type: "enum", required: true, options: ["savings", "current"] },
    { key: "nominee", label: "Nominee", type: "text", required: false },
  ],
};

describe("validateFormSchema", () => {
  it("accepts a well-formed schema", () => {
    const result = validateFormSchema(validSchema);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects a schema with no fields", () => {
    const result = validateFormSchema({ ...validSchema, fields: [] });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("fields must contain at least one field");
  });

  it("rejects duplicate field keys", () => {
    const result = validateFormSchema({
      ...validSchema,
      fields: [...validSchema.fields, { key: "full_name", label: "Dup", type: "text", required: false }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("duplicate field key: full_name");
  });

  it("rejects an enum field without options", () => {
    const result = validateFormSchema({
      ...validSchema,
      fields: [{ key: "gender", label: "Gender", type: "enum", required: true }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("enum field"))).toBe(true);
  });

  it("rejects a missing form_id or title", () => {
    const result = validateFormSchema({ ...validSchema, form_id: "", title: {} });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("form_id is required");
    expect(result.errors).toContain("title must have at least one language entry");
  });
});

describe("getRequiredFields", () => {
  it("returns only required fields", () => {
    const required = getRequiredFields(validSchema);
    expect(required.map((f) => f.key)).toEqual(["full_name", "account_type"]);
  });
});
