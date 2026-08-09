import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AskQuestion } from "./AskQuestion";

describe("AskQuestion", () => {
  it("shows a grounded answer for a known question", async () => {
    render(<AskQuestion onBack={() => {}} />);
    await userEvent.type(screen.getByLabelText("your question"), "Am I eligible for PM-Kisan?");
    await userEvent.click(screen.getByRole("button", { name: "Ask" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/landholding farmer/i);
  });

  it("offers human handoff for an unrelated question", async () => {
    render(<AskQuestion onBack={() => {}} />);
    await userEvent.type(screen.getByLabelText("your question"), "what is the weather today");
    await userEvent.click(screen.getByRole("button", { name: "Ask" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/connect you to a human officer/i);
  });

  it("calls onBack when Back is clicked", async () => {
    const onBack = vi.fn();
    render(<AskQuestion onBack={onBack} />);
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
