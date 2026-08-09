export interface KnowledgeEntry {
  id: string;
  form_id: string;
  topic: string;
  keywords: string[];
  answer: string;
}

// Seed knowledge base for the two hero forms (T7.1). Swap for a real
// vector-search / Sarvam-hosted Knowledge Base before production; the
// retrieval contract (`answerQuestion`) stays the same either way.
export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: "pmk-eligibility",
    form_id: "pm_kisan",
    topic: "PM-Kisan eligibility",
    keywords: ["eligible", "eligibility", "who can apply", "kaun", "patra"],
    answer:
      "PM-Kisan is for landholding farmer families with cultivable land in their name. " +
      "Certain categories such as institutional landholders and income-tax payers are excluded.",
  },
  {
    id: "pmk-documents",
    form_id: "pm_kisan",
    topic: "PM-Kisan required documents",
    keywords: ["documents", "dastavez", "kagaz", "required"],
    answer:
      "You will need your Aadhaar number, bank account details with IFSC code, and land record details " +
      "(survey/khasra number) for your state.",
  },
  {
    id: "bank-documents",
    form_id: "bank_account_opening",
    topic: "Bank account opening required documents",
    keywords: ["documents", "dastavez", "kagaz", "required", "kyc"],
    answer:
      "For opening a savings account you typically need Aadhaar, PAN (or Form 60 if you don't have one), " +
      "and a recent passport-size photo.",
  },
  {
    id: "bank-account-types",
    form_id: "bank_account_opening",
    topic: "Savings vs current account",
    keywords: ["account type", "savings", "current", "difference"],
    answer:
      "A savings account is for individuals to save money and earn interest. A current account is " +
      "for businesses with frequent transactions and usually does not earn interest.",
  },
  {
    id: "nominee",
    form_id: "bank_account_opening",
    topic: "What is a nominee",
    keywords: ["nominee", "nomination"],
    answer:
      "A nominee is the person who will receive the money in your account if something happens to you. " +
      "Adding a nominee is optional but recommended.",
  },
];

export interface AskResult {
  found: boolean;
  answer?: string;
  matchedEntry?: KnowledgeEntry;
}

/**
 * Very lightweight keyword-overlap retrieval for the laptop demo. In
 * production this is replaced by Sarvam's hosted Knowledge Base / RAG, but
 * the contract (query -> grounded answer OR "not found") does not change,
 * which is what `/api/ask` and the agent's `ask_knowledge` tool depend on.
 */
export function answerQuestion(query: string, formId?: string): AskResult {
  const normalized = query.toLowerCase();
  const candidates = formId ? knowledgeBase.filter((e) => e.form_id === formId) : knowledgeBase;

  let best: { entry: KnowledgeEntry; score: number } | undefined;
  for (const entry of candidates) {
    const score = entry.keywords.filter((k) => normalized.includes(k.toLowerCase())).length;
    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score };
    }
  }

  if (!best) return { found: false };
  return { found: true, answer: best.entry.answer, matchedEntry: best.entry };
}
