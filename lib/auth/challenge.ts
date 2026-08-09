/**
 * Accessibility-friendly verification that does not require a live phone call.
 * The app announces (by voice + on-screen) a short sequence of keypad digits;
 * the user presses the same sequence on a large on-screen keypad.
 * This proves the person at the kiosk is paying attention / present — a
 * lightweight, low-literacy-friendly stand-in for OTP, usable entirely offline
 * from telephony infrastructure.
 */

export interface KeypadChallenge {
  digits: number[];
}

const MIN_DIGIT = 0;
const MAX_DIGIT = 9;
const CHALLENGE_LENGTH = 3;

export function generateChallenge(
  length: number = CHALLENGE_LENGTH,
  rng: () => number = Math.random,
): KeypadChallenge {
  const digits: number[] = [];
  for (let i = 0; i < length; i++) {
    digits.push(Math.floor(rng() * (MAX_DIGIT - MIN_DIGIT + 1)));
  }
  return { digits };
}

export function verifyChallenge(challenge: KeypadChallenge, attempt: number[]): boolean {
  if (attempt.length !== challenge.digits.length) return false;
  return challenge.digits.every((d, i) => d === attempt[i]);
}

export function challengeToSpokenInstruction(challenge: KeypadChallenge): string {
  return `Please press ${challenge.digits.join(", then ")} on the keypad.`;
}
