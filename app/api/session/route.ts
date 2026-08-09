import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { getFormById } from "@/lib/forms/catalog";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const formId = body.form_id as string | undefined;
  const verified = Boolean(body.verified);

  if (!formId || !getFormById(formId)) {
    return NextResponse.json({ error: "unknown form_id" }, { status: 400 });
  }

  const session = createSession(formId, verified);
  return NextResponse.json({ session });
}
