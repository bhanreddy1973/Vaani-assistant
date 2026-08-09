# Vaani Kiosk — Product & Engineering Specification

> Voice-first form-filling application for banks, government offices, and CSC centers.
> Powered by Sarvam AI (voice agent, Doc AI, telephony). Built for Bharat — fill any
> official form just by speaking, in your own language.

**Status:** Planning (do not build yet) · **Target:** Sarvam AI Hackathon
**Doc owner:** Team Vaani · **Last updated:** see git history

---

## 1. Executive summary

Vaani is a self-serve, kiosk-style web application that lets any citizen complete an
official form (bank account opening, KYC, PM-Kisan, pension, ration card, or an
uploaded custom form) **by having a natural voice conversation in their own Indian
language**. The user is verified with an accessibility-friendly phone-keypad challenge,
picks or uploads a form, answers the agent's questions by speaking, sees the form fill
live on screen, confirms critical fields digit-by-digit, and walks away with a correct,
printable application plus a reference number.

Beyond filling forms, Vaani also acts as a **voice help-desk**: the user can simply ask
questions — "Am I eligible for PM-Kisan?", "Which documents do I need?", "What is the
interest rate?", "How long will this take?" — and get accurate, grounded spoken answers
in their language, sourced from a curated knowledge base. Users can ask before choosing a
form, or pause mid-fill to ask and then continue.

Think of a mall food-ordering kiosk — but for government and bank forms, and driven by
voice instead of touch, so that non-literate, elderly, and regional-language users can
use it independently.

**Why Sarvam:** the product is impossible without high-quality, low-latency, code-mixed
**Indian-language voice** (Saarika/Saaras ASR, Bulbul TTS, Sarvam conversational LLM),
plus Sarvam Doc AI for understanding uploaded forms. A generic English LLM cannot serve
the target user at all.

---

## 2. Problem statement

- Hundreds of millions of Indians cannot comfortably read, write, or fill English (or
  even standardized) forms. They depend on paid agents/middlemen, family members, or
  overworked bank/CSC staff.
- This causes: exclusion from schemes and banking, data-entry errors, fraud/exploitation,
  long queues, and high human dependency for routine paperwork.
- Existing digital forms assume literacy, typing ability, smartphones, and English —
  excluding exactly the people who most need government schemes and financial access.

**Opportunity:** replace the "middleman + paper form" step with a trustworthy voice
assistant that any person can operate independently, deployed where people already go
(bank branches, CSC/Common Service Centers, panchayat and government offices).

---

## 3. Goals and non-goals

### 3.1 Goals
- Let a non-literate / regional-language user complete a real form end-to-end by voice.
- Guarantee correctness through confirmation and digit-by-digit read-back.
- Support both a catalog of popular forms and arbitrary uploaded forms.
- Provide simple, inclusive authentication suitable for elderly / feature-phone users.
- Produce a print-ready, officer-verifiable output artifact.
- Reduce human dependency and processing time in banks/govt offices.

### 3.2 Non-goals (for v1 / hackathon)
- Not a legal identity verification / eKYC authority (we verify phone possession only).
- Not auto-submitting binding legal filings to government portals (we produce a draft +
  reference; human/officer review remains in the loop).
- Not building custom kiosk hardware (runs fullscreen on a tablet/PC browser).
- Not storing raw Aadhaar in production (see Security & Compliance).

---

## 4. Impact and risk analysis

### 4.1 Impact
- **Social:** financial and scheme inclusion for non-literate, elderly, rural, and
  visually-impaired citizens; reduces exploitation by paid intermediaries.
- **Operational:** faster form completion, fewer errors, lower staffing load per branch.
- **Business:** deployable to banks, CSC networks, insurers, and government departments;
  measurable ROI (forms/hour, error rate, staff time saved).
- **Strategic fit:** aligns with Digital India, Direct Benefit Transfer, and financial
  inclusion agendas.

### 4.2 Risk register (summary — full table in §14)
- **PII & regulatory:** Aadhaar Act + DPDP Act 2023 govern this data. Mitigation: demo
  uses synthetic data; production masks/tokenizes IDs, encrypts at rest/in transit,
  captures explicit consent.
- **Correctness/liability:** wrong data on official forms has consequences. Mitigation:
  read-back confirmation, validation, human/officer review before real submission.
- **Authentication scope:** keypad-call proves phone possession, not identity. Framed
  accordingly; layer real eKYC later if needed.
- **Voice errors / hallucination:** agent may mishear or invent. Mitigation: guardrails
  (never invent values), confirm each field, allow "repeat".
- **Scope/time (hackathon):** broad product. Mitigation: strict P0 cut (see §11).

**Verdict:** impactful and viable; not inherently dangerous. The main discipline is
treating PII responsibly and keeping a human in the loop for real submissions.

---

## 5. Personas and key user stories

### 5.1 Personas
1. **Kamala, 68, retired, low literacy, keypad phone.** Needs huge UI, voice-only,
   simple auth, slow speech, ability to repeat, no forced English.
2. **Ramesh, 41, farmer.** Applying for PM-Kisan. Needs scheme templates, simple words,
   Aadhaar/bank fields, optional staff help.
3. **Anita, bank/CSC operator.** Wants speed, correct filled PDF, an audit trail, and an
   assist/takeover mode when a user is stuck.
4. **Hackathon judges.** Want to see live Indic-language voice, on-screen form filling,
   the upload-any-form novelty, and a stable hosted demo.

### 5.2 Representative user stories
- As Kamala, I can start, choose my language, and fill my bank form by only speaking.
- As Kamala, I verify myself by pressing simple keys my phone announces to me.
- As Ramesh, I pick "PM-Kisan" and answer questions to complete my application.
- As any user, if my form isn't listed, I photograph the blank form and still fill it.
- As any user, the agent repeats my Aadhaar and mobile digit-by-digit before saving.
- As Anita, I can print the completed form and hand it to the citizen.

---

## 6. Feature set and prioritization

Priority key: **P0** = must ship for a winning demo · **P1** = strong differentiator ·
**P2** = roadmap / if time allows.

| ID | Feature | Priority | Owner |
|----|---------|----------|-------|
| F1 | Category picker (Bank / Government / Insurance / Upload) | P0 | Frontend |
| F2 | Popular forms per category (with JSON schemas) | P0 | Frontend + Schemas |
| F3 | Sarvam voice form-filling agent (core loop) | P0 | Agent/Prompt |
| F4 | Live form preview while speaking | P0 | Frontend |
| F5 | Read-back + confirmation of sensitive fields | P0 | Agent/Prompt |
| F6 | Completed PDF / printout + reference number | P0 | Backend |
| F7 | Upload blank form photo → schema (Doc AI) | P1 | Doc AI + Backend |
| F8 | Phone keypad voice verification (auth) | P1 | Telephony + Agent |
| F9 | Session pause / resume | P1 | Backend |
| F10 | Elder-first UI (large text, high contrast, big buttons) | P1 | Frontend |
| F11 | Language auto-detect + sticky language | P1 | Agent settings |
| F12 | Officer assist / takeover mode | P2 | Frontend |
| F13 | WhatsApp/SMS summary to self or family | P2 | Backend |
| F14 | Fraud/scam safety tip before sharing IDs | P2 | Agent/Prompt |
| F15 | Branch analytics dashboard (forms/hour, errors) | P2 | Backend |
| F16 | Voice Q&A assistant (ask about schemes, forms, eligibility, documents) | P1 | Agent + Knowledge Base |
| F17 | Ask-during-fill (pause form to ask a question, then resume) | P1 | Agent/Prompt |

---

## 7. End-to-end user flow

```
1. Welcome screen        -> big language hint, "Start"/"Shuru karein" button
2. Authenticate          -> user enters mobile; outbound voice call; keypad challenge
3. Choose category       -> Bank | Government | Insurance | Upload my form
4. Choose form OR upload -> popular template, OR photo -> Doc AI -> field schema
5. Voice fill session    -> agent asks each field; live preview fills on the right
6. Final read-back       -> digit-by-digit for IDs; user confirms "Haan/Yes"
7. Submit + artifact      -> submit_form tool -> reference number + printable PDF
8. Handoff               -> print / SMS / WhatsApp to self or family; end session
```

### 7.1 Authentication flow (detail)
1. User enters mobile number on a large on-screen keypad.
2. App triggers a Sarvam outbound voice call to that number.
3. Agent speaks the challenge in the detected/chosen language, e.g.
   "Apne phone par 5 ka button teen baar dabaiye" or "3, phir 7, phir 9 dabaiye".
4. User presses keys; DTMF tones are captured and matched to the challenge.
5. On match, the session is marked verified and form filling unlocks.

**Why this design:** it works on feature phones and for non-literate users (audio
instructions + physical keypad), unlike app-based OTP that assumes reading and a
smartphone. It proves phone possession, analogous to an OTP.

**Hackathon fallback:** if real telephony/DTMF is too fragile in the time window,
implement an on-screen keypad challenge that mirrors the same UX, and keep real
outbound calling (Exotel/Twilio/Sarvam telephony) as a stretch goal. Have a recorded
call as backup for the demo.

### 7.2 Upload-any-form flow (detail)
1. User uploads/photographs a blank form.
2. Sarvam Doc AI (digitise/extract) returns the form's field labels and structure.
3. The app converts extracted labels into a runtime field schema.
4. The same voice agent asks those fields in order — no code change to the loop.

### 7.3 Voice Q&A / "ask me anything" flow (detail)
1. From the welcome screen (or a persistent "Ask a question" button), the user speaks a
   question in their language, e.g. "PM-Kisan ke liye kaun eligible hai?".
2. The agent retrieves relevant content from the **Knowledge Base** (scheme rules,
   eligibility, required documents, fees, timelines, FAQs) and answers by voice.
3. Every answer is grounded: if the knowledge base does not contain the answer, the agent
   says it does not know and offers to connect a human officer — it must NOT invent facts.
4. After answering, the agent offers a next action: "Kya main aapke liye yeh form bhar
   doon?" — bridging naturally from Q&A into form filling.

### 7.4 Ask-during-fill (detail)
- At any point during a fill session, the user can interrupt with a question
  (e.g. "Nominee kya hota hai?"). The agent answers from the knowledge base, then resumes
  exactly where it left off, keeping all already-collected fields intact.

---

## 8. System architecture

### 8.1 Component overview
```
+---------------------------------------------------------------+
|                     Vaani Web App (kiosk)                     |
|  Next.js frontend (fullscreen)   +   API routes (backend)    |
|  - Welcome / language                - /auth/challenge        |
|  - Auth keypad UI                    - /auth/verify           |
|  - Category + form catalog           - /forms (schemas)       |
|  - Upload form                       - /doc/extract           |
|  - Live form preview                 - /submit_form           |
|  - PDF / print                       - /session               |
+------------------------------|--------------------------------+
                               |
             +---------+-------+---------+--------+
             |         |       |         |        |
        Sarvam    Sarvam   Sarvam    Knowledge  Sarvam
        Voice     Doc AI   Telephony Base       (STT/TTS/
        Agent     (form    (call +   (schemes,   translate)
        (LLM +    OCR ->   DTMF      FAQs,
        tools)    schema)  keypad)   docs -> RAG)
```

### 8.2 Data flow (fill session)
```
User speech --> Sarvam ASR --> Agent LLM (Instruction + schema + state)
   --> update_field tool --> app updates live preview
   --> next question --> Sarvam TTS --> user hears
   ... repeat until complete ...
   --> submit_form tool --> backend stores + generates PDF + reference no.
   --> agent reads reference number --> end
```

### 8.3 Roles
- **Your application:** all screens, auth UI, form catalog + schemas, upload, live
  preview, PDF generation, session storage, and the tool endpoints the agent calls.
- **Sarvam Voice Agent:** the entire conversational loop (ASR + LLM + TTS) in Indic
  languages, driven by the Instruction prompt and calling `update_field` / `submit_form`.
- **Sarvam Doc AI:** understands uploaded blank forms and returns field structure.
- **Sarvam Telephony:** outbound verification call and DTMF capture.
- **Knowledge Base (RAG):** curated scheme/form content (eligibility, documents, fees,
  timelines, FAQs) that grounds the voice Q&A feature so answers are accurate, not invented.

You do **not** build ASR/TTS/LLM yourself — Sarvam provides them.

---

## 9. Data model and form schema

### 9.1 Form schema (drives the agent + preview)
```json
{
  "form_id": "bank_account_opening",
  "title": { "en": "Bank Account Opening", "hi": "बैंक खाता खोलना" },
  "category": "bank",
  "fields": [
    { "key": "full_name", "label": "Full name (as per Aadhaar)", "type": "text", "required": true },
    { "key": "date_of_birth", "label": "Date of birth", "type": "date", "required": true },
    { "key": "gender", "label": "Gender", "type": "enum", "options": ["male","female","other"], "required": true },
    { "key": "guardian_name", "label": "Father's / mother's name", "type": "text", "required": true },
    { "key": "mobile", "label": "Mobile number", "type": "number", "digits": 10, "required": true },
    { "key": "aadhaar", "label": "Aadhaar number", "type": "number", "digits": 12, "required": true, "sensitive": true },
    { "key": "pan", "label": "PAN", "type": "pan", "required": false },
    { "key": "address", "label": "Address", "type": "address", "required": true },
    { "key": "account_type", "label": "Account type", "type": "enum", "options": ["savings","current"], "required": true },
    { "key": "nominee", "label": "Nominee name", "type": "text", "required": false }
  ]
}
```

### 9.2 Catalog forms (v1)
- Bank: Account Opening / KYC, Savings account
- Government: PM-Kisan, Old-age Pension, Ration card
- Insurance: (P2)

### 9.3 Session record
```json
{
  "session_id": "uuid",
  "form_id": "bank_account_opening",
  "verified": true,
  "mobile_verified": "98******50",
  "fields": { "full_name": "…", "mobile": "…" },
  "status": "in_progress | complete | submitted",
  "reference_number": "VAANI-2026-000123",
  "language": "hi-IN",
  "created_at": "…",
  "updated_at": "…"
}
```

### 9.4 Validation rules
- Mobile: 10 digits, starts 6–9.
- Aadhaar: 12 digits (never stored raw in production — mask/tokenize).
- PAN: 5 letters + 4 digits + 1 letter.
- PIN: 6 digits. IFSC: 11 chars, 5th char is 0.

---

## 10. Sarvam integration details

### 10.1 Models
- Conversational LLM: `sarvam-105b-conversations` (real-time voice workloads).
- ASR: Saaras (auto language detect; `codemix` mode for mixed speech).
- TTS: `bulbul:v3` (warm speaker, e.g. `anushka`/`ritu`).
- Translate/Transliterate: as needed for form output in English + native script.
- Doc AI: `digitise` / `extract` for uploaded forms.

### 10.2 Voice Agent configuration
- **Greeting:** warm multilingual welcome asking which form.
- **Instruction:** persona, objective, per-form field lists, steps, validation,
  guardrails, tool usage (see the prompt authored in chat / to be stored in
  `/agent/instruction.md`).
- **Tools:**
  - `update_field(key, value)` — pushes a confirmed value to the live preview.
  - `submit_form(form_id, fields)` — finalizes; returns `reference_number`.
  - `ask_knowledge(query)` — retrieves grounded answers from the Knowledge Base for the
    voice Q&A feature (or use the built-in Knowledge Base attachment / `wiki_grounding`).
- **Variables:** `{{form_type}}`, `{{user_name}}`, `{{language}}`.
- **On-End hook:** produce call summary / trigger PDF.
- **Deploy:** website widget embedded in the kiosk app (primary channel).

### 10.4 Knowledge Base for voice Q&A
- **Content:** per-scheme/form documents — eligibility criteria, required documents, fees,
  processing timelines, common FAQs — ideally in multiple languages.
- **Grounding:** attach the Knowledge Base to the agent so answers are retrieved, not
  hallucinated. The instruction must enforce: answer only from the knowledge base; if the
  answer is not found, say so and offer a human handoff; never guess eligibility or legal
  facts.
- **Bridge to action:** after answering a question, the agent proactively offers to start
  the relevant form.

### 10.3 Tool contract (submit_form)
Request:
```json
{ "form_type": "bank_account_opening", "fields": { "full_name": "…", "mobile": "…" } }
```
Response:
```json
{ "reference_number": "VAANI-2026-000123", "pdf_url": "https://…" }
```

---

## 11. Build plan (hackathon, 6 hours, team of 3)

Owners: **A** = Frontend/artifact · **B** = Voice pipeline/agent · **C** = Backend/brain + pitch.

| Time | Milestone | Owner | Ship goal |
|------|-----------|-------|-----------|
| 0:00–0:30 | Deploy skeleton to Vercel; env + Sarvam keys | All | Live URL |
| 0:30–1:30 | Category + form catalog UI; form schemas | A + C | Pick a form |
| 0:30–1:30 | Sarvam Voice Agent created; greeting + instruction pasted | B | Agent talks |
| 1:30–3:00 | Voice fill + `update_field` → live preview | A + B | Form fills by voice |
| 3:00–4:00 | `submit_form` endpoint + PDF + reference number | C | Download PDF |
| 4:00–5:00 | Auth: on-screen keypad challenge (real call = stretch) | B + A | Verified gate |
| 4:00–5:00 | Upload form → Doc AI → schema | C | Upload path works |
| 5:00–5:30 | Elder UI polish, 2–3 languages, error states | A | Feels real |
| 5:30–6:00 | Final deploy, rehearse demo, record backup video | All | Demo ready |

**Strict P0 cut if behind:** F1, F2, F3, F4, F5, F6 only. Auth becomes on-screen keypad;
upload and telephony move to "shown as roadmap".

---

## 12. Tech stack

- **Frontend/Backend:** Next.js (App Router) on Vercel — one deploy, fast, AI-tool friendly.
- **Voice:** Sarvam Voice Agent (embedded web widget) + Sarvam APIs via server routes.
- **Doc AI / Telephony:** Sarvam Doc AI; Sarvam telephony (or Exotel/Twilio) for calls.
- **PDF:** server-side PDF generation (e.g. a template filled from session fields).
- **Storage (demo):** in-memory / lightweight KV; **no raw Aadhaar persisted**.
- **Secrets:** Sarvam key server-side only (never in client).

---

## 13. API design (app endpoints)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/challenge` | Start verification (issue keypad challenge / call) |
| POST | `/api/auth/verify` | Verify DTMF/keypad input; mark session verified |
| GET | `/api/forms` | List catalog forms by category |
| GET | `/api/forms/:id` | Get a form schema |
| POST | `/api/doc/extract` | Upload blank form → Doc AI → field schema |
| POST | `/api/ask` | Voice Q&A: query → grounded answer from Knowledge Base (RAG) |
| POST | `/api/session` | Create/update a fill session |
| POST | `/api/update_field` | Tool endpoint: set a confirmed field value |
| POST | `/api/submit_form` | Tool endpoint: finalize, generate PDF, return reference |

---

## 14. Security, privacy, and compliance

| Area | Risk | Mitigation |
|------|------|-----------|
| Aadhaar handling | Aadhaar Act restrictions | Demo uses synthetic data; production masks/tokenizes, never displays/stores full number unnecessarily |
| Personal data (DPDP 2023) | Consent, purpose limitation, security | Explicit spoken consent at start; collect only required fields; encrypt in transit and at rest; retention limits |
| Voice recordings | Sensitive biometric-adjacent data | Avoid storing raw audio in demo; if stored, encrypt + short retention + consent |
| Q&A misinformation | Wrong scheme/eligibility answers mislead citizens | Answer only from curated Knowledge Base (RAG); "I don't know" + human handoff when unsure; never guess legal/eligibility facts |
| Correctness/liability | Wrong data on official form | Digit-by-digit read-back, validation, human/officer review before real submission |
| Auth strength | Possession != identity | Framed as phone-possession verification; layer real eKYC for production |
| Access control | Kiosk shared device | Session isolation, auto-clear after completion/timeout, no data left on screen |
| Secrets | API key leakage | Server-side only; never exposed to browser |

**Principle:** the app produces a *draft* application that a human verifies before any
binding submission. Vaani assists; it does not replace legal/official checks.

---

## 15. Business model and go-to-market

- **Buyers:** banks, CSC/Common Service Center networks, insurers, government departments.
- **Value:** more forms/hour, fewer errors, lower staffing cost, inclusion of previously
  excluded citizens.
- **Pricing (illustrative):** per-kiosk license + per-completed-form usage; enterprise
  deployment for bank branch networks.
- **Wedge:** start with one high-volume form (e.g. account opening or PM-Kisan) in a few
  branches; expand catalog and languages.

---

## 16. Demo script (90 seconds)

1. "This is Kamala. She can't read English forms." Open the kiosk.
2. Ask a question by voice: "PM-Kisan ke liye kaun eligible hai?" → grounded spoken answer.
3. Enter mobile → keypad challenge ("press 3, 7, 9") → verified.
4. Pick "Bank" → "Account Opening".
5. Speak answers in Hindi → the English form fills live, field by field.
6. Pause mid-fill to ask "Nominee kya hota hai?" → agent answers, then resumes.
7. Switch to a second language / code-mix mid-flow to show robustness.
8. Agent reads Aadhaar + mobile back digit-by-digit; user confirms.
9. Show the upload-any-form path briefly (photo → fields).
10. Submit → reference number + downloadable/printable PDF. Close.

---

## 17. Success metrics

- Task completion rate (forms completed without staff help).
- Field-level error rate after read-back.
- Time to complete a form vs manual.
- Languages successfully handled.
- (Business) forms/hour/kiosk, staff time saved.

---

## 18. Future roadmap (post-hackathon)

- Real eKYC / DigiLocker integration for verified identity.
- Direct submission to government/bank portals with audit trail.
- Officer dashboard + analytics (F15).
- WhatsApp/SMS family summaries (F13).
- Expanded form catalog and all 22 Indic languages.
- Offline/low-bandwidth mode for rural kiosks.
- Accessibility certification (visually impaired, hearing support).

---

## 19. Open decisions (confirm before build)

1. Product name: **Vaani Kiosk** — confirm or change.
2. Auth for day-1: **on-screen keypad** demo vs **real outbound call** + DTMF.
3. Stack: **Next.js + Vercel + Sarvam Voice Agent + Doc AI** — confirm.
4. First catalog forms: confirm Bank Account Opening + PM-Kisan as the two hero forms.
```
