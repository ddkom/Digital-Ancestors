import { supabase } from "../supabaseClient";

/** Loose sanity check; the browser's type="email" and the database check do the rest. */
export function looksLikeEmail(value: string): boolean {
  const email = value.trim();
  return email.length <= 254 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

/**
 * Save an email for update emails. See docs/email-signup.md.
 * Kept in its own table, never linked to quiz answers. Signing up twice counts as success.
 * Throws on any other failure so the popup can show its error message.
 */
export async function submitEmailSignup(email: string, source: string, consentText: string): Promise<void> {
  const { error } = await supabase.from("email_signups").insert({
    email: email.trim().toLowerCase(),
    source,
    consent_text: consentText,
  });
  // 23505 = unique violation: already on the list.
  if (error && error.code !== "23505") throw error;
}
