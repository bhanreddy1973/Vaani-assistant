import { describe, expect, it } from "vitest";
import { initialFlowState, transition } from "./flow";

describe("flow state machine", () => {
  it("moves welcome -> auth -> category -> form -> fill -> done", () => {
    let state = initialFlowState;
    state = transition(state, { type: "START" });
    expect(state.step).toBe("auth");

    state = transition(state, { type: "VERIFIED" });
    expect(state.step).toBe("category");
    expect(state.verified).toBe(true);

    state = transition(state, { type: "SELECT_CATEGORY", category: "bank" });
    expect(state.step).toBe("form");
    expect(state.category).toBe("bank");

    state = transition(state, { type: "SELECT_FORM", formId: "bank_account_opening" });
    expect(state.step).toBe("fill");
    expect(state.formId).toBe("bank_account_opening");

    state = transition(state, { type: "COMPLETE_FILL" });
    expect(state.step).toBe("done");
  });

  it("ignores out-of-order events", () => {
    const state = transition(initialFlowState, { type: "VERIFIED" });
    expect(state).toEqual(initialFlowState);
  });

  it("RESTART always returns to the initial state", () => {
    let state = initialFlowState;
    state = transition(state, { type: "START" });
    state = transition(state, { type: "RESTART" });
    expect(state).toEqual(initialFlowState);
  });
});
