export type PersonaCard = {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  stanceText: string;
  image: string;
  imageAlt: string;
  mission: string;
  stance: string;
  tactics: string;
  exposure: string;
};

/** Hardcoded persona flip-card copy for the tracks section. */
export const PERSONAS: PersonaCard[] = [
  {
    id: "guardian",
    code: "DA-01",
    name: "Guardian",
    subtitle: "The Privacy Protector",
    stanceText: "DEFENSIVE",
    image: "/personas/guardian.jpeg",
    imageAlt: "Stylized ID portrait of the Guardian",
    mission: "Data Sovereignty",
    stance: "Defensive / Anti-Training",
    tactics: "Glaze, Nightshade, Opt-Outs",
    exposure: "Zero-Consent (Closed)",
  },
  {
    id: "steward",
    code: "DA-02",
    name: "Steward",
    subtitle: "The Cautious Collaborator",
    stanceText: "COLLABORATIVE",
    image: "/personas/steward.png",
    imageAlt: "Stylized ID portrait of the Steward",
    mission: "Safe Administration",
    stance: "Cautious Collaborator",
    tactics: "Local LLMs, Privacy Prompts",
    exposure: "Selective Share (Vaulted)",
  },
  {
    id: "trailblazer",
    code: "DA-03",
    name: "Trailblazer",
    subtitle: "The AI Pioneer",
    stanceText: "EXPERIMENTAL",
    image: "/personas/trailblazer.jpeg",
    imageAlt: "Stylized ID portrait of the Trailblazer",
    mission: "Ethical Synthesis",
    stance: "Free Bird / AI Pioneer",
    tactics: "LoRA Training, Sourcing",
    exposure: "Public Remix (Open)",
  },
];
