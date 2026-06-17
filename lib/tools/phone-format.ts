/**
 * Phone number normalization to E.164 format.
 * Falls back to the original value if the number can't be parsed.
 */
import { parsePhoneNumberWithError, ParseError } from "libphonenumber-js";

export function normalizePhone(value: string, defaultCountry: "US" | "GB" | "IN" = "US"): string {
  const v = value.trim();
  if (!v) return v;
  try {
    const phone = parsePhoneNumberWithError(v, defaultCountry);
    if (phone.isValid()) return phone.format("E.164");
    return v;
  } catch (e) {
    if (e instanceof ParseError) return v;
    return v;
  }
}

export function looksLikePhone(value: string): boolean {
  const stripped = value.replace(/[\s\-().+]/g, "");
  return /^\+?\d{7,15}$/.test(stripped);
}
