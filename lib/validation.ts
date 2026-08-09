export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateMobile(value: string): ValidationResult {
  const digits = value.replace(/\s/g, "");
  if (!/^[6-9]\d{9}$/.test(digits)) {
    return { valid: false, message: "Mobile number must be 10 digits starting with 6-9." };
  }
  return { valid: true };
}

export function validateAadhaar(value: string): ValidationResult {
  const digits = value.replace(/\s/g, "");
  if (!/^\d{12}$/.test(digits)) {
    return { valid: false, message: "Aadhaar number must be exactly 12 digits." };
  }
  return { valid: true };
}

export function validatePan(value: string): ValidationResult {
  const pan = value.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)) {
    return { valid: false, message: "PAN must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)." };
  }
  return { valid: true };
}

export function validatePin(value: string): ValidationResult {
  const digits = value.replace(/\s/g, "");
  if (!/^\d{6}$/.test(digits)) {
    return { valid: false, message: "PIN code must be exactly 6 digits." };
  }
  return { valid: true };
}

export function validateIfsc(value: string): ValidationResult {
  const ifsc = value.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
    return { valid: false, message: "IFSC must be 11 characters; 5th character is 0." };
  }
  return { valid: true };
}
