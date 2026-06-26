import { useEffect } from "react";
import pathwayNodeDefs from "../data/pathwayNodes.json";
import type { PathwayNodeDef } from "../types/pathway";
import { layoutPathwayNodes } from "../utils/layoutPathwayNodes";
import { scrollToSection } from "../lib/scrollToSection";
import { HeroSection } from "../components/sections/HeroSection";
import { WhySection } from "../components/sections/WhySection";
import { TracksSection } from "../components/sections/TracksSection";
import { MapSection } from "../components/sections/MapSection";
import { WhoSection } from "../components/sections/WhoSection";

const nodes = layoutPathwayNodes(pathwayNodeDefs as PathwayNodeDef[]);

type Props = {
  shaderPalette: {
    deep: string;
    light: string;
    accent: string;
    highlight: string;
  };
};

export function HomePage({ shaderPalette }: Props) {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    requestAnimationFrame(() => scrollToSection(hash));
  }, []);

  return (
    <main>
      <HeroSection />
      <WhySection />
      <TracksSection />
      <MapSection nodes={nodes} shaderPalette={shaderPalette} />
      <WhoSection />
    </main>
  );
}
