import { describe, expect, it } from "vitest";
import { validateAadhaar, validateIfsc, validateMobile, validatePan, validatePin } from "./validation";

describe("validateMobile", () => {
  it.each(["9840950950", "6000000000", "7123456789"])("accepts valid mobile %s", (v) => {
    expect(validateMobile(v).valid).toBe(true);
  });
  it.each(["1234567890", "98409509", "984095095099"])("rejects invalid mobile %s", (v) => {
    expect(validateMobile(v).valid).toBe(false);
  });
});

describe("validateAadhaar", () => {
  it("accepts a 12-digit number", () => {
    expect(validateAadhaar("123412341234").valid).toBe(true);
  });
  it("rejects wrong length", () => {
    expect(validateAadhaar("12341234").valid).toBe(false);
  });
});

describe("validatePan", () => {
  it("accepts a valid PAN", () => {
    expect(validatePan("ABCDE1234F").valid).toBe(true);
  });
  it("is case-insensitive", () => {
    expect(validatePan("abcde1234f").valid).toBe(true);
  });
  it("rejects an invalid PAN", () => {
    expect(validatePan("ABCDE12345").valid).toBe(false);
  });
});

describe("validatePin", () => {
  it("accepts a 6-digit PIN", () => {
    expect(validatePin("208001").valid).toBe(true);
  });
  it("rejects a 5-digit PIN", () => {
    expect(validatePin("20800").valid).toBe(false);
  });
});

describe("validateIfsc", () => {
  it("accepts a valid IFSC", () => {
    expect(validateIfsc("SBIN0001234").valid).toBe(true);
  });
  it("rejects an IFSC without 0 as 5th character", () => {
    expect(validateIfsc("SBIN1001234").valid).toBe(false);
  });
});
