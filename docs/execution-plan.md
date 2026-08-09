# Vaani (Laptop Edition) — Execution Plan

> Phase-by-phase, task-by-task build plan for the **laptop/browser demo version** of Vaani.
> Every task ends with: automated tests green → Git commit → push to GitHub.
> This is a PLAN only. Nothing here is executed yet.

Related docs: [Product & Engineering Spec](./vaani-product-spec.md)

---

## 0. Scope of this edition (laptop/browser demo)

**In scope (implementable + testable for the demo):**
- Runs fullscreen in a laptop browser; microphone via the browser.
- Voice form-filling using Sarvam (voice agent web widget OR custom mic → Sarvam APIs).
- Voice Q&A / help-desk grounded in a local knowledge base.
- Category + catalog of hero forms (Bank Account Opening, PM-Kisan) with JSON schemas.
- Live form preview that fills as the user speaks.
- Field validation + digit-by-digit read-back (driven by the agent prompt).
- `submit_form` → reference number + downloadable/printable PDF.
- Upload a blank form photo → Doc AI → runtime field schema.
- Accessibility-friendly **on-screen keypad verification** (simulates the phone-call auth).

**Out of scope for laptop demo (roadmap / stretch):**
- Real outbound telephony + DTMF (documented; optional stretch task).
- Real eKYC/DigiLocker, government portal submission.
- Multi-branch SSO, analytics dashboard, WhatsApp family alerts.

**Definition of the demo version:** a hosted web app where a user can (1) ask a question,
(2) verify via keypad, (3) pick or upload a form, (4) fill it by voice with live preview,
(5) download a completed PDF — in at least Hindi + English, with a code-mix moment.

---

## 1. Engineering conventions (apply to EVERY task)

### 1.1 The task loop (mandatory, after each task)
```
1. Implement the task.
2. Run the automated checks locally:  npm run verify
   (verify = lint + typecheck + unit/integration tests + affected e2e)
3. If anything fails -> fix -> re-run until green. Do NOT commit red.
4. git add -A
5. git commit -m "<type>(<scope>): <task-id> <summary>"
6. git push origin <branch>
7. CI (GitHub Actions) re-runs the full suite on the pushed commit.
8. Only start the next task after CI is green.
```

### 1.2 Commit message convention (Conventional Commits)
- `feat(...)`, `fix(...)`, `test(...)`, `chore(...)`, `docs(...)`, `ci(...)`, `refactor(...)`.
- Always include the task id, e.g. `feat(forms): T2.2 add bank account schema + loader`.

### 1.3 Branching
- `main` = always green, always deployable.
- Short-lived task branches optional; for a 3-person hackathon sprint, committing directly
  to `main` with green `verify` is acceptable. Pick ONE model in T0.2 and stick to it.

### 1.4 Definition of Done (per task)
- Code implemented + typed (no `any` on public surfaces).
- Automated tests written for the component and passing.
- `npm run verify` green locally AND CI green after push.
- Committed and pushed with a conventional message.

---

## 2. Tech stack and tooling (decided defaults)

| Concern | Choice | Notes |
|--------|--------|------|
| Framework | Next.js (App Router, TypeScript) | Frontend + API routes in one deploy |
| Hosting | Vercel | Deploy from `main` on every push |
| Package manager | npm | Node v22.14.0 already installed |
| Unit/integration tests | Vitest + React Testing Library | Fast, TS-native |
| API mocking | MSW (Mock Service Worker) | Deterministic Sarvam responses in tests |
| E2E tests | Playwright | Happy-path flows with mocked agent + mic |
| Lint / format | ESLint + Prettier | Enforced in CI |
| Typecheck | `tsc --noEmit` | Part of `verify` |
| CI | GitHub Actions | Runs `verify` on push + PR |
| PDF | server-side PDF lib (e.g. pdf-lib / @react-pdf) | Fill template from session fields |
| Voice | Sarvam Voice Agent web widget (primary) | Custom mic→API path as fallback |

`package.json` scripts (to be created in T0.3):
```
"dev": "next dev",
"build": "next build",
"lint": "eslint .",
"typecheck": "tsc --noEmit",
"test": "vitest run",
"test:e2e": "playwright test",
"verify": "npm run lint && npm run typecheck && npm run test && npm run test:e2e"
```

---

## 3. Testing strategy (how components auto-test)

Because live audio can't be asserted deterministically, we isolate voice behind services
and test everything around it:

| Layer | What we test | How |
|------|--------------|-----|
| Form schemas | Each schema is valid, required fields present | Vitest schema validator tests |
| Validation utils | mobile/Aadhaar/PAN/PIN/IFSC rules | Vitest table-driven unit tests |
| Slot-filling logic | given transcript + state → next field/updated state | Vitest pure-function tests |
| API routes | `/api/forms`, `/api/ask`, `/api/submit_form`, `/api/doc/extract` | Vitest + MSW mocking Sarvam |
| Knowledge base / Q&A | retrieval returns grounded answer; unknown → "don't know" | Vitest with fixture KB |
| UI components | catalog, keypad, live preview render + interactions | React Testing Library |
| PDF generation | produces a non-empty PDF with expected fields | Vitest snapshot/byte assertions |
| E2E happy path | pick form → fill (mocked agent) → PDF download | Playwright with mocked network |
| Accessibility | large-text, keyboard nav, contrast | Playwright + axe checks |

**Sarvam calls are always mocked in tests** (MSW), so the suite is fast, offline, and
deterministic. A separate manual/live smoke checklist (T10.x) covers real Sarvam calls.

---

## 4. Phases overview

| Phase | Theme | Outcome |
|------|-------|--------|
| P0 | Repo, CI, scaffold | Green pipeline + deployed skeleton |
| P1 | App shell & navigation | Screens + routing + design tokens |
| P2 | Form schemas & catalog | Pick a form from a category |
| P3 | Voice agent integration | Agent talks; tools wired |
| P4 | Live fill + validation | Form fills by voice with read-back |
| P5 | Submit + PDF artifact | Reference number + downloadable PDF |
| P6 | Keypad verification | Auth gate before filling |
| P7 | Q&A + knowledge base | Ask questions; grounded answers |
| P8 | Upload-any-form + Doc AI | Photo → field schema → fill |
| P9 | Accessibility, i18n, polish | Elder-first UX, 2+ languages |
| P10 | Deploy, harden, demo | Hosted, rehearsed, backup video |

---

## 5. Detailed tasks (commit + test after each)

Legend: **Test** = automated test to add · **Commit** = message stub.

### Phase P0 — Repo, CI, scaffold
| ID | Task | Test | Commit |
|----|------|------|--------|
| T0.1 | Create GitHub repo `vaani`; add remote; push empty `main` with README | Repo reachable; CI file present (added T0.4) | `chore(repo): T0.1 init repo and remote` |
| T0.2 | Decide branch model; add `.gitignore`, LICENSE, CODEOWNERS | n/a (docs) | `docs(repo): T0.2 conventions and gitignore` |
| T0.3 | Scaffold Next.js + TS; add Vitest, RTL, Playwright, ESLint, Prettier; add `verify` scripts | `verify` runs and passes on empty app | `chore(setup): T0.3 scaffold app + test tooling` |
| T0.4 | GitHub Actions workflow running `verify` on push/PR | CI green on push | `ci: T0.4 add verify workflow` |
| T0.5 | Deploy skeleton to Vercel; wire env placeholders (`SARVAM_API_KEY`) | Live URL returns 200 (e2e smoke) | `chore(deploy): T0.5 vercel skeleton live` |
| T0.6 | Add MSW setup + Sarvam mock handlers scaffolding | mock handler unit test passes | `test(infra): T0.6 msw sarvam mocks` |

### Phase P1 — App shell & navigation
| ID | Task | Test | Commit |
|----|------|------|--------|
| T1.1 | Design tokens (large-text, high-contrast theme) + layout shell | component render test | `feat(ui): T1.1 theme + app shell` |
| T1.2 | Welcome screen (language hint, Start, persistent "Ask" button) | RTL: renders + Start navigates | `feat(ui): T1.2 welcome screen` |
| T1.3 | Router/state for flow steps (welcome→auth→category→form→fill→done) | unit: state machine transitions | `feat(flow): T1.3 flow state machine` |
| T1.4 | Global session context (session_id, language, fields, verified) | unit: context reducer | `feat(state): T1.4 session context` |

### Phase P2 — Form schemas & catalog
| ID | Task | Test | Commit |
|----|------|------|--------|
| T2.1 | Define form schema type + validator | unit: valid/invalid schemas | `feat(forms): T2.1 schema type + validator` |
| T2.2 | Bank Account Opening schema | unit: schema passes validator | `feat(forms): T2.2 bank account schema` |
| T2.3 | PM-Kisan schema | unit: schema passes validator | `feat(forms): T2.3 pm-kisan schema` |
| T2.4 | `/api/forms` + `/api/forms/:id` routes | api test (MSW): list/get | `feat(api): T2.4 forms endpoints` |
| T2.5 | Category picker + popular-forms list UI | RTL: select category → forms shown | `feat(ui): T2.5 category + form catalog` |

### Phase P3 — Voice agent integration
| ID | Task | Test | Commit |
|----|------|------|--------|
| T3.1 | Author agent Instruction + Greeting; store in `/agent/instruction.md` | lint/docs check | `docs(agent): T3.1 instruction + greeting` |
| T3.2 | Configure Sarvam Voice Agent (dashboard) with tools `update_field`, `submit_form`, `ask_knowledge` | manual smoke (T10) + config recorded | `docs(agent): T3.2 agent config recorded` |
| T3.3 | Embed voice widget in fill screen; wire start/stop | RTL: widget mounts; e2e stub | `feat(voice): T3.3 embed agent widget` |
| T3.4 | Tool webhook receiver `/api/update_field` (auth by session) | api test: updates session field | `feat(api): T3.4 update_field tool` |

### Phase P4 — Live fill + validation
| ID | Task | Test | Commit |
|----|------|------|--------|
| T4.1 | Validation utils (mobile/Aadhaar/PAN/PIN/IFSC) | unit: table-driven cases | `feat(validation): T4.1 field validators` |
| T4.2 | Live form preview component (fields light up as filled) | RTL: renders + updates on field change | `feat(ui): T4.2 live form preview` |
| T4.3 | Wire `update_field` → session → live preview | integration test | `feat(fill): T4.3 field updates to preview` |
| T4.4 | Read-back/confirmation rules encoded in prompt + UI confirm badges | unit: confirm-state logic | `feat(fill): T4.4 confirmation + read-back` |

### Phase P5 — Submit + PDF artifact
| ID | Task | Test | Commit |
|----|------|------|--------|
| T5.1 | `submit_form` endpoint: validate complete → store → reference no. | api test: happy + incomplete | `feat(api): T5.1 submit_form endpoint` |
| T5.2 | PDF generation from session fields (template per form) | unit: non-empty PDF w/ fields | `feat(pdf): T5.2 generate filled pdf` |
| T5.3 | Success screen: reference number + download/print | RTL + e2e: download available | `feat(ui): T5.3 success + download` |

### Phase P6 — Keypad verification (auth)
| ID | Task | Test | Commit |
|----|------|------|--------|
| T6.1 | Mobile entry + large on-screen keypad UI | RTL: input + submit | `feat(auth): T6.1 mobile keypad UI` |
| T6.2 | Challenge generator (e.g. "press 3,7,9") + verify logic | unit: generate/verify | `feat(auth): T6.2 challenge + verify` |
| T6.3 | Gate: fill flow requires `verified=true` | integration/e2e: blocked until verified | `feat(auth): T6.3 verification gate` |
| T6.4 | (Stretch) real outbound call + DTMF via Sarvam/Exotel | manual smoke only | `feat(auth): T6.4 real call (stretch)` |

### Phase P7 — Q&A + knowledge base
| ID | Task | Test | Commit |
|----|------|------|--------|
| T7.1 | Knowledge base content structure + seed (PM-Kisan, Bank) | unit: KB schema valid | `feat(kb): T7.1 knowledge base seed` |
| T7.2 | Retrieval + `/api/ask` (grounded; unknown→"don't know") | api test: known + unknown query | `feat(api): T7.2 ask endpoint grounded` |
| T7.3 | "Ask a question" UI (voice + shows answer) | RTL + e2e (mocked) | `feat(ui): T7.3 ask a question` |
| T7.4 | Ask-during-fill: pause→answer→resume without losing fields | integration test | `feat(fill): T7.4 ask during fill` |

### Phase P8 — Upload-any-form + Doc AI
| ID | Task | Test | Commit |
|----|------|------|--------|
| T8.1 | Upload UI (photo/PDF) on main + category screens | RTL: file accepted | `feat(upload): T8.1 form upload ui` |
| T8.2 | `/api/doc/extract`: Doc AI → field labels → runtime schema | api test (MSW): fixture → schema | `feat(api): T8.2 doc extract to schema` |
| T8.3 | Feed extracted schema into the same fill loop | integration test | `feat(upload): T8.3 fill uploaded form` |

### Phase P9 — Accessibility, i18n, polish
| ID | Task | Test | Commit |
|----|------|------|--------|
| T9.1 | Language selection + sticky language across screens | unit + RTL | `feat(i18n): T9.1 language selection` |
| T9.2 | Elder-first pass: font sizes, contrast, focus states | Playwright + axe a11y checks | `feat(a11y): T9.2 elder-first ui` |
| T9.3 | Error/empty/loading states + "repeat" affordance | RTL: states render | `feat(ui): T9.3 robust states` |
| T9.4 | Session auto-clear on completion/timeout (privacy) | unit: clear logic | `feat(privacy): T9.4 session auto-clear` |

### Phase P10 — Deploy, harden, demo
| ID | Task | Test | Commit |
|----|------|------|--------|
| T10.1 | Live Sarvam smoke checklist (real STT/LLM/TTS/Doc AI) | manual checklist doc | `docs(qa): T10.1 live smoke checklist` |
| T10.2 | Seed demo data (synthetic only; no real Aadhaar) | unit: fixtures load | `chore(demo): T10.2 synthetic seed data` |
| T10.3 | Final Vercel deploy from green `main` | e2e smoke on prod URL | `chore(deploy): T10.3 production deploy` |
| T10.4 | Demo script rehearsal + record backup video | n/a | `docs(demo): T10.4 demo script + video` |
| T10.5 | README: run, test, deploy, architecture, credits | docs lint | `docs: T10.5 project readme` |

---

## 6. Feature ↔ test coverage matrix (demo acceptance)

| PRD Feature | Phase | Auto-tested by |
|-------------|-------|----------------|
| Category + catalog (F1,F2) | P2 | forms API tests, catalog RTL |
| Voice fill (F3,F4) | P3,P4 | update_field API, preview RTL, e2e |
| Read-back/confirm (F5) | P4 | confirm-state unit |
| PDF + reference (F6) | P5 | submit_form API, pdf unit, e2e download |
| Upload form (F7) | P8 | doc extract API, integration |
| Keypad auth (F8) | P6 | challenge unit, gate e2e |
| Voice Q&A (F16) | P7 | ask API (known/unknown), e2e |
| Ask-during-fill (F17) | P7 | integration test |
| Elder UI + i18n (F10,F11) | P9 | axe a11y, i18n unit |

---

## 7. Risks specific to execution (and how the plan handles them)

| Risk | Handling in plan |
|------|------------------|
| Live voice not testable in CI | Mock Sarvam via MSW; live behavior in manual smoke (T10.1) |
| Committing broken code | `verify` gate + CI on every push; never commit red |
| Scope creep in 6h | Phases ordered so P0–P5 alone = a shippable demo; P6–P10 additive |
| Doc AI accuracy on uploads | Fixture-based tests; demo uses a known sample form; fallback to catalog |
| Secrets leakage | Sarvam key server-side only; `.gitignore` covers `.env*` (T0.2) |
| PII in repo/tests | Only synthetic data (T10.2); no real Aadhaar anywhere |

---

## 8. Minimum shippable demo (if time runs short)

Complete **P0 → P5** only:
- Deployed app, pick a catalog form, fill by voice with live preview + read-back,
  download a completed PDF. That alone is an end-to-end, tested, hosted demo.
Then add P7 (Q&A) and P6 (auth) as the next most valuable increments.

---

## 9. What I need from you before execution

1. **GitHub repo:** confirm I can create/push a repo named `vaani` (and that `gh` is
   authenticated) — or provide the repo URL if you'll create it.
2. **Sarvam credentials:** `SARVAM_API_KEY`, and (if using the hosted widget) the Voice
   Agent ID once created in the dashboard.
3. **Vercel:** confirm we deploy to Vercel (and whether you want it under your account).
4. **Confirm open decisions** from spec §19: name (Vaani), auth = on-screen keypad for
   day-1, stack = Next.js + Vercel + Sarvam, hero forms = Bank Account + PM-Kisan.
5. **Team assignment:** which teammate owns Frontend (A), Voice/Agent (B), Backend (C) so
   phases can run in parallel.

---

## 10. Parallelization (team of 3)

- **A (Frontend):** P1 shell, P2.5 catalog, P4.2 preview, P5.3 success, P6.1 keypad UI, P9.
- **B (Voice/Agent):** P3 agent, P3.4 tool receiver, P4.4 read-back, P7.3 ask UI, T10.1 smoke.
- **C (Backend):** P0 CI, P2 schemas/api, P5 submit+pdf, P7.1/7.2 KB, P8 doc extract.
- Sync points: end of P2 (schemas ready), end of P4 (fill works), end of P7 (Q&A), P10.

---

Planning complete. Nothing has been executed. Review §9 (what I need) and §5 (task list);
tell me any changes, then say the word and I'll begin at **T0.1**.
```
