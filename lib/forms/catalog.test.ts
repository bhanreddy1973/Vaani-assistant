import { describe, expect, it } from "vitest";
import { validateFormSchema } from "./schema";
import { formCatalog, getFormById, getFormsByCategory } from "./catalog";

describe("form catalog", () => {
  it("every catalog schema is valid", () => {
    for (const schema of formCatalog) {
      const result = validateFormSchema(schema);
      expect(result.errors).toEqual([]);
      expect(result.valid).toBe(true);
    }
  });

  it("getFormById finds bank_account_opening", () => {
    const form = getFormById("bank_account_opening");
    expect(form?.category).toBe("bank");
  });

  it("getFormById returns undefined for unknown id", () => {
    expect(getFormById("does_not_exist")).toBeUndefined();
  });

  it("getFormsByCategory filters correctly", () => {
    const govForms = getFormsByCategory("government");
    expect(govForms.map((f) => f.form_id)).toContain("pm_kisan");
    expect(govForms.every((f) => f.category === "government")).toBe(true);
  });
});
