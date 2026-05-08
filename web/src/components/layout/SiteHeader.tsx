import { useState } from "react";
import { PillNavButton } from "../ui/PillNavButton";
import { scrollToSection } from "../../lib/scrollToSection";

export function SiteHeader() {
  const [activePill, setActivePill] = useState<"map" | "why" | "tracks" | "who">("map");

  const handlePillClick = (section: "map" | "why" | "tracks" | "who") => {
    setActivePill(section);
    scrollToSection(section);
  };

  return (
    <header>
      <div className="brand">
        <div className="brand-mark" aria-hidden="true" />
        <div>
          <div className="brand-title">AI PATHWAYS FOR ARTISTS</div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            An open framework for protection, care, and experimentation
          </div>
        </div>
      </div>
      <nav className="pill-nav">
        <PillNavButton active={activePill === "map"} onClick={() => handlePillClick("map")}>
          Launch the map
        </PillNavButton>
        <PillNavButton active={activePill === "why"} onClick={() => handlePillClick("why")}>
          Backstory
        </PillNavButton>
        <PillNavButton active={activePill === "tracks"} onClick={() => handlePillClick("tracks")}>
          Tracks
        </PillNavButton>
        <PillNavButton active={activePill === "who"} onClick={() => handlePillClick("who")}>
          Who it&apos;s for
        </PillNavButton>
      </nav>
    </header>
  );
}
