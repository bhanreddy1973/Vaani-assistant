import { NextResponse } from "next/server";
import { submitSession } from "@/lib/session";

// Called by the Sarvam Voice Agent's `submit_form` tool once every required
// field has been collected and confirmed.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const sessionId = body.session_id as string | undefined;

  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const result = submitSession(sessionId);
  if (!result.ok) {
    return NextResponse.json({ error: "incomplete", missing: result.missing }, { status: 422 });
  }

  return NextResponse.json({
    reference_number: result.session?.reference_number,
    pdf_url: `/api/pdf/${sessionId}`,
  });
}
