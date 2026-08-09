import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vaani — Talk to fill any form",
  description: "Voice-first form filling for banks and government offices, in your own language.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
