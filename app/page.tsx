"use client";

import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { KeypadChallenge } from "@/components/KeypadChallenge";
import { CategoryPicker, type Category } from "@/components/CategoryPicker";
import { getFormsByCategory } from "@/lib/forms/catalog";
import { initialFlowState, transition } from "@/lib/flow";

export default function HomePage() {
  const [flow, setFlow] = useState(initialFlowState);

  if (flow.step === "welcome") {
    return (
      <WelcomeScreen
        onStart={() => setFlow((s) => transition(s, { type: "START" }))}
        onAsk={() => {
          /* T7.3 will wire the voice Q&A entry point here */
        }}
      />
    );
  }

  if (flow.step === "auth") {
    return (
      <main style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <KeypadChallenge onVerified={() => setFlow((s) => transition(s, { type: "VERIFIED" }))} />
      </main>
    );
  }

  if (flow.step === "category") {
    return (
      <main style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <CategoryPicker
          onSelect={(category: Category) =>
            setFlow((s) => transition(s, { type: "SELECT_CATEGORY", category }))
          }
        />
      </main>
    );
  }

  if (flow.step === "form") {
    const forms = flow.category ? getFormsByCategory(flow.category) : [];
    return (
      <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 48, gap: 16 }}>
        <h2>Choose a form</h2>
        {forms.map((form) => (
          <button
            key={form.form_id}
            onClick={() => setFlow((s) => transition(s, { type: "SELECT_FORM", formId: form.form_id }))}
            style={{ fontSize: 18, padding: "16px 24px" }}
          >
            {form.title.en}
          </button>
        ))}
      </main>
    );
  }

  if (flow.step === "fill") {
    return (
      <main style={{ padding: 48 }}>
        <p>Voice fill screen for form: {flow.formId}</p>
        {/* T3.x / T4.x wire the Sarvam voice agent + live preview here */}
      </main>
    );
  }

  return (
    <main style={{ padding: 48 }}>
      <p>Done. Thank you!</p>
    </main>
  );
}
