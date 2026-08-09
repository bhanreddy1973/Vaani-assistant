"use client";

interface WelcomeScreenProps {
  onStart: () => void;
  onAsk: () => void;
}

export function WelcomeScreen({ onStart, onAsk }: WelcomeScreenProps) {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 24,
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 40, margin: 0 }}>Vaani</h1>
      <p style={{ fontSize: 20, maxWidth: 480, color: "#5b6270" }}>
        Talk to fill any bank or government form, in your own language.
      </p>
      <button
        onClick={onStart}
        style={{
          fontSize: 24,
          padding: "20px 48px",
          borderRadius: 12,
          border: "none",
          background: "#0a5f38",
          color: "white",
        }}
      >
        Start / शुरू करें
      </button>
      <button
        onClick={onAsk}
        style={{
          fontSize: 18,
          padding: "12px 24px",
          borderRadius: 10,
          border: "1px solid #d9dce1",
          background: "white",
          color: "#111318",
        }}
      >
        Ask a question / सवाल पूछें
      </button>
    </main>
  );
}
