import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { KeypadChallenge } from "./KeypadChallenge";

function extractChallengeDigits(instruction: string): number[] {
  const matches = instruction.match(/\d/g) ?? [];
  return matches.map(Number);
}

describe("KeypadChallenge", () => {
  it("renders an instruction and a 0-9 keypad", () => {
    render(<KeypadChallenge onVerified={() => {}} />);
    expect(screen.getByText(/please press/i)).toBeInTheDocument();
    for (let d = 0; d <= 9; d++) {
      expect(screen.getByRole("button", { name: `keypad-${d}` })).toBeInTheDocument();
    }
  });

  it("calls onVerified when the correct sequence is pressed", async () => {
    const onVerified = vi.fn();
    render(<KeypadChallenge onVerified={onVerified} />);
    const instruction = screen.getByText(/please press/i).textContent ?? "";
    const digits = extractChallengeDigits(instruction);

    for (const digit of digits) {
      await userEvent.click(screen.getByRole("button", { name: `keypad-${digit}` }));
    }

    expect(onVerified).toHaveBeenCalledTimes(1);
  });

  it("shows an error and resets after a wrong sequence", async () => {
    const onVerified = vi.fn();
    render(<KeypadChallenge onVerified={onVerified} />);
    const instruction = screen.getByText(/please press/i).textContent ?? "";
    const digits = extractChallengeDigits(instruction);
    const wrongDigit = (digits[0] + 1) % 10;

    await userEvent.click(screen.getByRole("button", { name: `keypad-${wrongDigit}` }));
    for (let i = 1; i < digits.length; i++) {
      await userEvent.click(screen.getByRole("button", { name: `keypad-${digits[i]}` }));
    }

    expect(await screen.findByRole("alert")).toHaveTextContent(/did not match/i);
    expect(onVerified).not.toHaveBeenCalled();
  });
});
