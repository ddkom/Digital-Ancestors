import pathwayNodes from "./data/pathwayNodes.json";
import type { PathwayNode } from "./types/pathway";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { HeroSection } from "./components/sections/HeroSection";
import { WhySection } from "./components/sections/WhySection";
import { TracksSection } from "./components/sections/TracksSection";
import { MapSection } from "./components/sections/MapSection";
import { WhoSection } from "./components/sections/WhoSection";

const nodes = pathwayNodes as PathwayNode[];

export default function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <WhySection />
        <TracksSection />
        <MapSection nodes={nodes} />
        <WhoSection />
      </main>
      <SiteFooter />
    </>
  );
}
