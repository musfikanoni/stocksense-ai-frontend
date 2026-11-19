// src/schema/auth.ts
// Zod-free lightweight validators — extend with Zod if needed in the future

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(pw: string) {
  return pw.length >= 8;
}

export function validatePasswordMatch(pw: string, pw2: string) {
  return pw === pw2;
}
