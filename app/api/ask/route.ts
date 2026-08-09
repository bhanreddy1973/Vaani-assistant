import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/knowledge/base";

// Called by the Sarvam Voice Agent's `ask_knowledge` tool. Always answers from
// the curated knowledge base, or explicitly says it doesn't know — never guesses.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const query = body.query as string | undefined;
  const formId = body.form_id as string | undefined;

  if (!query || query.trim() === "") {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const result = answerQuestion(query, formId);
  if (!result.found) {
    return NextResponse.json({
      found: false,
      answer: "I don't have that information yet. Would you like me to connect you to a human officer?",
    });
  }

  return NextResponse.json({ found: true, answer: result.answer, topic: result.matchedEntry?.topic });
}
