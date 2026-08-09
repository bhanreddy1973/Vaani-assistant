import type { FormSchema } from "./schema";

export const bankAccountOpeningSchema: FormSchema = {
  form_id: "bank_account_opening",
  title: { en: "Bank Account Opening", hi: "बैंक खाता खोलना" },
  category: "bank",
  fields: [
    { key: "full_name", label: "Full name (as per Aadhaar)", type: "text", required: true },
    { key: "date_of_birth", label: "Date of birth", type: "date", required: true },
    { key: "gender", label: "Gender", type: "enum", required: true, options: ["male", "female", "other"] },
    { key: "guardian_name", label: "Father's or mother's name", type: "text", required: true },
    { key: "mobile", label: "Mobile number", type: "number", digits: 10, required: true },
    { key: "aadhaar", label: "Aadhaar number", type: "number", digits: 12, required: true, sensitive: true },
    { key: "pan", label: "PAN", type: "pan", required: false },
    { key: "address", label: "Address", type: "address", required: true },
    { key: "account_type", label: "Account type", type: "enum", required: true, options: ["savings", "current"] },
    { key: "nominee", label: "Nominee name", type: "text", required: false },
  ],
};

export const pmKisanSchema: FormSchema = {
  form_id: "pm_kisan",
  title: { en: "PM-Kisan Scheme Application", hi: "पीएम-किसान योजना आवेदन" },
  category: "government",
  fields: [
    { key: "full_name", label: "Farmer's full name (as per Aadhaar)", type: "text", required: true },
    { key: "aadhaar", label: "Aadhaar number", type: "number", digits: 12, required: true, sensitive: true },
    { key: "mobile", label: "Mobile number", type: "number", digits: 10, required: true },
    { key: "state", label: "State", type: "text", required: true },
    { key: "district", label: "District", type: "text", required: true },
    { key: "block", label: "Block / sub-district", type: "text", required: true },
    { key: "village", label: "Village", type: "text", required: true },
    { key: "bank_account_number", label: "Bank account number", type: "number", required: true },
    { key: "ifsc", label: "IFSC code", type: "text", required: true },
    { key: "category", label: "Category", type: "enum", required: true, options: ["general", "obc", "sc", "st"] },
    { key: "land_holding_acres", label: "Land holding (acres)", type: "number", required: true },
  ],
};

export const formCatalog: FormSchema[] = [bankAccountOpeningSchema, pmKisanSchema];

export function getFormById(formId: string): FormSchema | undefined {
  return formCatalog.find((f) => f.form_id === formId);
}

export function getFormsByCategory(category: string): FormSchema[] {
  return formCatalog.filter((f) => f.category === category);
}
