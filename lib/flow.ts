export type FlowStep =
  | "welcome"
  | "auth"
  | "category"
  | "form"
  | "fill"
  | "done";

export interface FlowState {
  step: FlowStep;
  verified: boolean;
  category: string | null;
  formId: string | null;
}

export const initialFlowState: FlowState = {
  step: "welcome",
  verified: false,
  category: null,
  formId: null,
};

export type FlowEvent =
  | { type: "START" }
  | { type: "VERIFIED" }
  | { type: "SELECT_CATEGORY"; category: string }
  | { type: "SELECT_FORM"; formId: string }
  | { type: "COMPLETE_FILL" }
  | { type: "RESTART" };

/**
 * Pure state machine driving the Vaani screen flow:
 * welcome -> auth -> category -> form -> fill -> done
 */
export function transition(state: FlowState, event: FlowEvent): FlowState {
  switch (event.type) {
    case "START":
      if (state.step !== "welcome") return state;
      return { ...state, step: "auth" };
    case "VERIFIED":
      if (state.step !== "auth") return state;
      return { ...state, step: "category", verified: true };
    case "SELECT_CATEGORY":
      if (state.step !== "category") return state;
      return { ...state, step: "form", category: event.category };
    case "SELECT_FORM":
      if (state.step !== "form") return state;
      return { ...state, step: "fill", formId: event.formId };
    case "COMPLETE_FILL":
      if (state.step !== "fill") return state;
      return { ...state, step: "done" };
    case "RESTART":
      return { ...initialFlowState };
    default:
      return state;
  }
}
