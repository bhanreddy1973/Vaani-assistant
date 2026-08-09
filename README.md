# Vaani-assistant

Voice-first form-filling application for banks and government offices, in your own language.
Built for the Sarvam AI Hackathon. See [`docs/vaani-product-spec.md`](docs/vaani-product-spec.md)
for the full product spec and [`docs/execution-plan.md`](docs/execution-plan.md) for the phased
build plan this repo follows.

## Run locally

```
npm install
cp .env.example .env.local   # fill in SARVAM_API_KEY, etc.
npm run dev
```

Open http://localhost:3000.

## Test

```
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run test        # Vitest unit/integration tests
npm run verify       # all of the above
```

Every push to `main` runs `verify` automatically via GitHub Actions
(`.github/workflows/verify.yml`).

## What's implemented so far

- App shell + flow state machine: welcome → auth → category → form → fill → done
  (`lib/flow.ts`, `app/page.tsx`).
- Form schema type + validator, and two hero forms: Bank Account Opening and
  PM-Kisan (`lib/forms/`).
- Field validators for mobile/Aadhaar/PAN/PIN/IFSC (`lib/validation.ts`).
- On-screen keypad verification — an accessibility-friendly stand-in for a live
  phone call, usable without telephony (`lib/auth/challenge.ts`, `components/KeypadChallenge.tsx`).
- In-memory session store + `submit_form` / `update_field` tool endpoints the
  Sarvam Voice Agent calls (`lib/session.ts`, `app/api/`).
- Filled-form PDF generation with sensitive-field masking (`lib/pdf.ts`).
- Seed knowledge base + grounded Q&A ("ask a question") flow, with a safe
  "I don't know" fallback instead of guessing (`lib/knowledge/`, `app/api/ask`,
  `components/AskQuestion.tsx`).
- Sarvam Voice Agent instruction/prompt ready to paste into the dashboard
  (`agent/instruction.md`).

## Architecture

```
Browser (Next.js app)
  Welcome -> Auth (keypad) -> Category -> Form -> Voice fill -> Done
       |
       +-- /api/forms, /api/forms/[id]      form catalog
       +-- /api/session                     start a fill session
       +-- /api/update_field                Sarvam agent tool: live field updates
       +-- /api/ask                         Sarvam agent tool: grounded Q&A
       +-- /api/submit_form                 Sarvam agent tool: finalize + reference no.
       +-- /api/pdf/[sessionId]             download the completed, filled PDF

Sarvam Voice Agent (configured in the Sarvam dashboard per agent/instruction.md)
  runs the ASR -> LLM -> TTS conversation and calls the tools above.
```

## Still open (needs account access, not just code)

- **Sarvam Voice Agent creation**: create the agent in the Sarvam dashboard using
  `agent/instruction.md`, point its tools at the endpoints above, and embed its
  web widget on the `fill` screen.
- **Vercel deployment**: connect this GitHub repo to Vercel and set
  `SARVAM_API_KEY` / `SARVAM_VOICE_AGENT_ID` as environment variables.
- **Doc AI upload path**: `/api/doc/extract` (upload a blank form → field schema)
  is designed in the spec but not yet implemented.
- **Real telephony verification** is intentionally deferred — see
  `docs/vaani-product-spec.md` §4/§14 for why the on-screen keypad is the
  chosen v1 approach.

## Privacy note

No real Aadhaar/PII should ever be committed or used outside local testing.
`.env*` files are gitignored; the session store is in-memory only for this demo.
