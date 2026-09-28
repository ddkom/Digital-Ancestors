import type { CharacterId } from "../../data/characterProfiles";
import { supabase } from "../supabaseClient";

export type ResourceSuggestion = {
  /** One or more links, one per line. */
  links: string;
  notes: string;
  /** Guides the visitor thinks this fits. Empty means "didn't say". */
  archetypes: CharacterId[];
  /** The guide page the popup was opened from. */
  sourceGuide: CharacterId | null;
};

export const LIMITS = { links: 2000, notes: 4000 } as const;

/** Same rule as the database check: at least one field filled. */
export function hasContent(s: ResourceSuggestion): boolean {
  return (
    s.links.trim() !== "" || s.notes.trim() !== "" || s.archetypes.length > 0
  );
}

/** Save a suggestion to Supabase. See docs/feedback-form-plan.md. Throws on
 * failure so the popup can show its error message. */
export async function submitResourceSuggestion(
  suggestion: ResourceSuggestion,
): Promise<void> {
  const { error } = await supabase.from("resource_suggestions").insert({
    links: suggestion.links,
    notes: suggestion.notes,
    archetypes: suggestion.archetypes,
    source_guide: suggestion.sourceGuide,
  });
  if (error) throw error;
}
