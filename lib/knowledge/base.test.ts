import { describe, expect, it } from "vitest";
import { answerQuestion, knowledgeBase } from "./base";

describe("knowledge base seed", () => {
  it("every entry has at least one keyword and a non-empty answer", () => {
    for (const entry of knowledgeBase) {
      expect(entry.keywords.length).toBeGreaterThan(0);
      expect(entry.answer.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("answerQuestion", () => {
  it("finds a grounded answer for a known question", () => {
    const result = answerQuestion("PM-Kisan ke liye kaun eligible hai?");
    expect(result.found).toBe(true);
    expect(result.answer).toMatch(/landholding farmer/i);
  });

  it("scopes the search to a specific form when form_id is given", () => {
    const result = answerQuestion("what documents are required", "bank_account_opening");
    expect(result.found).toBe(true);
    expect(result.matchedEntry?.form_id).toBe("bank_account_opening");
  });

  it("returns not found for an unrelated question instead of guessing", () => {
    const result = answerQuestion("what is the weather today");
    expect(result.found).toBe(false);
    expect(result.answer).toBeUndefined();
  });

  it("explains what a nominee is", () => {
    const result = answerQuestion("Nominee kya hota hai?");
    expect(result.found).toBe(true);
    expect(result.answer).toMatch(/receive the money/i);
  });
});
