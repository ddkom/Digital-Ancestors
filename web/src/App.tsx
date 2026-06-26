import pathwayNodeDefs from "./data/pathwayNodes.json";
import type { PathwayNodeDef } from "./types/pathway";
import { layoutPathwayNodes } from "./utils/layoutPathwayNodes";
import { ShaderBackground } from "./components/ShaderBackground";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { HeroSection } from "./components/sections/HeroSection";
import { WhySection } from "./components/sections/WhySection";
import { TracksSection } from "./components/sections/TracksSection";  
import { MapSection } from "./components/sections/MapSection";
import { WhoSection } from "./components/sections/WhoSection";

const nodes = layoutPathwayNodes(pathwayNodeDefs as PathwayNodeDef[]);

const shaderPalette = {
  deep: "#6D88C9",
  light: "#F2AAB0",
  accent: "#97CAF1",
  highlight: "#8EA52A",
};

export default function App() {
  return (
    <>
      <ShaderBackground palette={shaderPalette} />
      <SiteHeader />
      <main>
        <HeroSection />
        <TracksSection />
        <MapSection nodes={nodes} shaderPalette={shaderPalette} />
        <WhySection />
        <WhoSection />
      </main>
      <SiteFooter />
    </>
  );
}
