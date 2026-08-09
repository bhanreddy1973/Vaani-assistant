import { describe, expect, it } from "vitest";
import { challengeToSpokenInstruction, generateChallenge, verifyChallenge } from "./challenge";

describe("generateChallenge", () => {
  it("generates the requested number of digits, each 0-9", () => {
    const challenge = generateChallenge(4, () => 0.5);
    expect(challenge.digits).toHaveLength(4);
    for (const d of challenge.digits) {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(9);
    }
  });

  it("defaults to 3 digits", () => {
    expect(generateChallenge().digits).toHaveLength(3);
  });

  it("is deterministic given a deterministic rng", () => {
    const a = generateChallenge(3, () => 0.25);
    const b = generateChallenge(3, () => 0.25);
    expect(a.digits).toEqual(b.digits);
  });
});

describe("verifyChallenge", () => {
  it("accepts a matching attempt", () => {
    const challenge = { digits: [3, 7, 9] };
    expect(verifyChallenge(challenge, [3, 7, 9])).toBe(true);
  });

  it("rejects a wrong digit", () => {
    const challenge = { digits: [3, 7, 9] };
    expect(verifyChallenge(challenge, [3, 7, 0])).toBe(false);
  });

  it("rejects a wrong-length attempt", () => {
    const challenge = { digits: [3, 7, 9] };
    expect(verifyChallenge(challenge, [3, 7])).toBe(false);
  });
});

describe("challengeToSpokenInstruction", () => {
  it("produces a readable instruction", () => {
    const text = challengeToSpokenInstruction({ digits: [5, 5, 5] });
    expect(text).toBe("Please press 5, then 5, then 5 on the keypad.");
  });
});
