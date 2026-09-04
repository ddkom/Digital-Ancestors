export type PersonaCard = {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  stanceText: string;
  image: string;
  imageAlt: string;
  defaultStance: string;
  favouriteMedium: string;
  famousQuote: string;
};

/** Hardcoded persona flip-card copy for the tracks section. */
export const PERSONAS: PersonaCard[] = [
  {
    id: "guardian",
    code: "DA-01",
    name: "Guardian",
    subtitle: "AI Hater",
    stanceText: "OPT-OUT",
    image: "/personas/guardian.jpeg",
    imageAlt: "Stylized ID portrait of the Guardian",
    defaultStance: "Opt-Out",
    favouriteMedium: "Anything Analogue",
    famousQuote: '"F*ck Data Centers"',
  },
  {
    id: "steward",
    code: "DA-02",
    name: "Steward",
    subtitle: "Time Keeper",
    stanceText: "CAUTIOUS-CURIOUS",
    image: "/personas/steward.png",
    imageAlt: "Stylized ID portrait of the Steward",
    defaultStance: "Cautious-Curious",
    favouriteMedium: "All of it, just no AI art please",
    famousQuote: '"Automate the boring sh*t"',
  },
  {
    id: "weaver",
    code: "DA-04",
    name: "Weaver",
    subtitle: "Gardener",
    stanceText: "TENDING",
    image: "",
    imageAlt: "",
    defaultStance: "Tending",
    favouriteMedium: "To be defined",
    famousQuote: "To be defined",
  },
  {
    id: "trailblazer",
    code: "DA-03",
    name: "Trailblazer",
    subtitle: "Experimenter",
    stanceText: "FULL SEND",
    image: "/personas/trailblazer.jpeg",
    imageAlt: "Stylized ID portrait of the Trailblazer",
    defaultStance: "Full Send",
    favouriteMedium: "Human-Machine Collaboration",
    famousQuote: '"I\'ll try anything once"',
  },
];
