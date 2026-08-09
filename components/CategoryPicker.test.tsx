import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CategoryPicker } from "./CategoryPicker";

describe("CategoryPicker", () => {
  it("renders all four category options", () => {
    render(<CategoryPicker onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "Bank" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Government Scheme" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Insurance" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upload my form" })).toBeInTheDocument();
  });

  it("calls onSelect with the chosen category id", async () => {
    const onSelect = vi.fn();
    render(<CategoryPicker onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "Bank" }));
    expect(onSelect).toHaveBeenCalledWith("bank");
  });
});
