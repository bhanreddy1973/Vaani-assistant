import { beforeEach, describe, expect, it } from "vitest";
import { __resetSessionsForTests, createSession, submitSession, updateField } from "./session";

describe("session store", () => {
  beforeEach(() => {
    __resetSessionsForTests();
  });

  it("creates a session in_progress with no fields", () => {
    const session = createSession("bank_account_opening", true);
    expect(session.status).toBe("in_progress");
    expect(session.fields).toEqual({});
    expect(session.verified).toBe(true);
  });

  it("updateField sets a value and bumps updated_at", () => {
    const session = createSession("bank_account_opening", true);
    const updated = updateField(session.session_id, "full_name", "Ramesh Kumar");
    expect(updated?.fields.full_name).toBe("Ramesh Kumar");
  });

  it("submitSession fails listing missing required fields", () => {
    const session = createSession("bank_account_opening", true);
    updateField(session.session_id, "full_name", "Ramesh Kumar");
    const result = submitSession(session.session_id);
    expect(result.ok).toBe(false);
    expect(result.missing).toContain("mobile");
    expect(result.missing).toContain("aadhaar");
    expect(result.missing).not.toContain("nominee"); // optional field
  });

  it("submitSession succeeds once all required fields are present and returns a reference number", () => {
    const session = createSession("bank_account_opening", true);
    const required = [
      ["full_name", "Ramesh Kumar"],
      ["date_of_birth", "1985-06-12"],
      ["gender", "male"],
      ["guardian_name", "Suresh Kumar"],
      ["mobile", "9840950950"],
      ["aadhaar", "123412341234"],
      ["address", "12 Gandhi Road, Kanpur, UP, 208001"],
      ["account_type", "savings"],
    ] as const;
    for (const [key, value] of required) {
      updateField(session.session_id, key, value);
    }

    const result = submitSession(session.session_id);
    expect(result.ok).toBe(true);
    expect(result.session?.status).toBe("submitted");
    expect(result.session?.reference_number).toMatch(/^VAANI-\d{4}-[A-Z0-9]{6}$/);
  });

  it("submitSession returns not-found for an unknown session", () => {
    const result = submitSession("does-not-exist");
    expect(result.ok).toBe(false);
    expect(result.missing).toContain("session_not_found");
  });
});
