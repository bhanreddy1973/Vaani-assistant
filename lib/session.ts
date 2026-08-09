import { getFormById as lookupForm } from "./forms/catalog";

export type SessionStatus = "in_progress" | "complete" | "submitted";

export interface FillSession {
  session_id: string;
  form_id: string;
  verified: boolean;
  fields: Record<string, string>;
  status: SessionStatus;
  reference_number?: string;
  created_at: string;
  updated_at: string;
}

// In-memory store for the laptop demo. Swap for a real DB before production.
const sessions = new Map<string, FillSession>();

export function createSession(formId: string, verified: boolean): FillSession {
  const now = new Date().toISOString();
  const session: FillSession = {
    session_id: crypto.randomUUID(),
    form_id: formId,
    verified,
    fields: {},
    status: "in_progress",
    created_at: now,
    updated_at: now,
  };
  sessions.set(session.session_id, session);
  return session;
}

export function getSession(sessionId: string): FillSession | undefined {
  return sessions.get(sessionId);
}

export function updateField(sessionId: string, key: string, value: string): FillSession | undefined {
  const session = sessions.get(sessionId);
  if (!session) return undefined;
  session.fields[key] = value;
  session.updated_at = new Date().toISOString();
  return session;
}

export interface SubmitResult {
  ok: boolean;
  missing?: string[];
  session?: FillSession;
}

/** Validates that every required field for the session's form is present, then marks it submitted. */
export function submitSession(sessionId: string): SubmitResult {
  const session = sessions.get(sessionId);
  if (!session) return { ok: false, missing: ["session_not_found"] };

  const schema = lookupForm(session.form_id);
  if (!schema) return { ok: false, missing: ["form_not_found"] };

  const missing = schema.fields
    .filter((f) => f.required)
    .map((f) => f.key)
    .filter((key) => !session.fields[key] || session.fields[key].trim() === "");

  if (missing.length > 0) return { ok: false, missing };

  session.status = "submitted";
  session.reference_number = `VAANI-${new Date().getFullYear()}-${session.session_id.slice(0, 6).toUpperCase()}`;
  session.updated_at = new Date().toISOString();
  return { ok: true, session };
}

// Test-only helper to reset state between tests.
export function __resetSessionsForTests() {
  sessions.clear();
}
