import { PERSONAS, type PersonaCard } from "./personas";
import guardianMd from "@personas/guardian.md?raw";
import stewardMd from "@personas/steward.md?raw";
import trailblazerMd from "@personas/trailblazer.md?raw";

export const CHARACTER_IDS = ["guardian", "steward", "trailblazer"] as const;
export type CharacterId = (typeof CHARACTER_IDS)[number];

const MARKDOWN: Record<CharacterId, string> = {
  guardian: guardianMd,
  steward: stewardMd,
  trailblazer: trailblazerMd,
};

export type CharacterProfile = PersonaCard & {
  id: CharacterId;
  markdown: string;
};

export function isCharacterId(id: string): id is CharacterId {
  return (CHARACTER_IDS as readonly string[]).includes(id);
}

export const CHARACTERS: CharacterProfile[] = PERSONAS.filter(
  (persona): persona is PersonaCard & { id: CharacterId } =>
    isCharacterId(persona.id),
).map((persona) => ({
  ...persona,
  markdown: MARKDOWN[persona.id],
}));

export function characterById(id: CharacterId): CharacterProfile {
  const match = CHARACTERS.find((character) => character.id === id);
  if (!match) {
    throw new Error(`Unknown character: ${id}`);
  }
  return match;
}

/** Map a quiz/pathway end node to the character it belongs to. */
export function personaIdForEndNode(nodeId: string): CharacterId | null {
  if (nodeId.startsWith("result_")) {
    const id = nodeId.slice("result_".length);
    return isCharacterId(id) ? id : null;
  }
  if (nodeId.startsWith("p_")) return "guardian";
  if (nodeId.startsWith("a_")) return "steward";
  if (nodeId.startsWith("c_")) return "trailblazer";
  return null;
}
