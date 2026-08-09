import { NextResponse } from "next/server";
import { updateField } from "@/lib/session";

// Called by the Sarvam Voice Agent's `update_field` tool as each field is confirmed.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { session_id: sessionId, key, value } = body as {
    session_id?: string;
    key?: string;
    value?: string;
  };

  if (!sessionId || !key || value === undefined) {
    return NextResponse.json({ error: "session_id, key and value are required" }, { status: 400 });
  }

  const session = updateField(sessionId, key, value);
  if (!session) {
    return NextResponse.json({ error: "session not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, fields: session.fields });
}
