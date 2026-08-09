"use client";

import { useMemo, useState } from "react";
import { challengeToSpokenInstruction, generateChallenge, verifyChallenge } from "@/lib/auth/challenge";

interface KeypadChallengeProps {
  onVerified: () => void;
}

export function KeypadChallenge({ onVerified }: KeypadChallengeProps) {
  const challenge = useMemo(() => generateChallenge(), []);
  const [attempt, setAttempt] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  function press(digit: number) {
    const next = [...attempt, digit];
    setAttempt(next);
    if (next.length === challenge.digits.length) {
      if (verifyChallenge(challenge, next)) {
        onVerified();
      } else {
        setError("That did not match. Please try again.");
        setAttempt([]);
      }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <p style={{ fontSize: 22, maxWidth: 420, textAlign: "center" }}>
        {challengeToSpokenInstruction(challenge)}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {Array.from({ length: 10 }, (_, digit) => digit).map((digit) => (
          <button
            key={digit}
            aria-label={`keypad-${digit}`}
            onClick={() => press(digit)}
            style={{
              fontSize: 28,
              width: 72,
              height: 72,
              borderRadius: 12,
              border: "1px solid #d9dce1",
              background: "white",
            }}
          >
            {digit}
          </button>
        ))}
      </div>
      <p aria-live="polite">{attempt.length} / {challenge.digits.length} pressed</p>
      {error && <p role="alert" style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
