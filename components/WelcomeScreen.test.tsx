import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WelcomeScreen } from "./WelcomeScreen";

describe("WelcomeScreen", () => {
  it("renders the title and both actions", () => {
    render(<WelcomeScreen onStart={() => {}} onAsk={() => {}} />);
    expect(screen.getByText("Vaani")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ask a question/i })).toBeInTheDocument();
  });

  it("calls onStart when Start is clicked", async () => {
    const onStart = vi.fn();
    render(<WelcomeScreen onStart={onStart} onAsk={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("calls onAsk when Ask a question is clicked", async () => {
    const onAsk = vi.fn();
    render(<WelcomeScreen onStart={() => {}} onAsk={onAsk} />);
    await userEvent.click(screen.getByRole("button", { name: /ask a question/i }));
    expect(onAsk).toHaveBeenCalledTimes(1);
  });
});
