"use client";

import { useState } from "react";
import { answerQuestion } from "@/lib/knowledge/base";

interface AskQuestionProps {
  onBack: () => void;
}

/**
 * Text-input stand-in for the voice "ask me anything" flow (F16). In the full
 * build this is driven by the Sarvam agent's mic input calling `/api/ask`;
 * this component calls the same grounded lookup directly so the UI and its
 * behavior are testable without a live voice session.
 */
export function AskQuestion({ onBack }: AskQuestionProps) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    const result = answerQuestion(query);
    setAnswer(
      result.found
        ? result.answer!
        : "I don't have that information yet. Would you like me to connect you to a human officer?",
    );
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 48, gap: 16 }}>
      <h2>Ask a question</h2>
      <form onSubmit={handleAsk} style={{ display: "flex", gap: 8 }}>
        <input
          aria-label="your question"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ fontSize: 18, padding: 12, width: 320 }}
          placeholder="e.g. Am I eligible for PM-Kisan?"
        />
        <button type="submit" style={{ fontSize: 18, padding: "12px 20px" }}>
          Ask
        </button>
      </form>
      {answer && (
        <p role="status" style={{ fontSize: 18, maxWidth: 480, textAlign: "center" }}>
          {answer}
        </p>
      )}
      <button onClick={onBack} style={{ fontSize: 14, background: "none", border: "none", textDecoration: "underline" }}>
        Back
      </button>
    </main>
  );
}
