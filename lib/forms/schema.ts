export type FieldType = "text" | "date" | "enum" | "number" | "pan" | "address";

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  digits?: number;
  options?: string[];
  sensitive?: boolean;
}

export interface FormSchema {
  form_id: string;
  title: Record<string, string>;
  category: "bank" | "government" | "insurance" | "custom";
  fields: FormField[];
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates the shape of a FormSchema — used both for our built-in catalog
 * and for schemas produced at runtime from an uploaded/OCR'd form.
 */
export function validateFormSchema(schema: FormSchema): SchemaValidationResult {
  const errors: string[] = [];

  if (!schema.form_id || schema.form_id.trim() === "") {
    errors.push("form_id is required");
  }
  if (!schema.title || Object.keys(schema.title).length === 0) {
    errors.push("title must have at least one language entry");
  }
  if (!schema.fields || schema.fields.length === 0) {
    errors.push("fields must contain at least one field");
  }

  const seenKeys = new Set<string>();
  for (const field of schema.fields ?? []) {
    if (!field.key) {
      errors.push("every field must have a key");
      continue;
    }
    if (seenKeys.has(field.key)) {
      errors.push(`duplicate field key: ${field.key}`);
    }
    seenKeys.add(field.key);

    if (!field.label) {
      errors.push(`field ${field.key} is missing a label`);
    }
    if (field.type === "enum" && (!field.options || field.options.length === 0)) {
      errors.push(`enum field ${field.key} must declare options`);
    }
    if (field.type === "number" && field.digits !== undefined && field.digits <= 0) {
      errors.push(`field ${field.key} has an invalid digits count`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function getRequiredFields(schema: FormSchema): FormField[] {
  return schema.fields.filter((f) => f.required);
}
