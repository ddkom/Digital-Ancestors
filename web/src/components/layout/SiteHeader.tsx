import { useState } from "react";
import { copy } from "../../locales";
import { PillNavButton } from "../ui/PillNavButton";
import { scrollToSection } from "../../lib/scrollToSection";

export function SiteHeader() {
  const [activePill, setActivePill] = useState<"map" | "why" | "tracks" | "who">("map");

  const handlePillClick = (section: "map" | "why" | "tracks" | "who") => {
    setActivePill(section);
    scrollToSection(section);
  };

  const { nav } = copy.siteHeader;

  return (
    <header>
      <div className="brand">
        <div className="brand-mark" aria-hidden="true" />
        <div>
          <div className="brand-title">{copy.siteHeader.brandTitle}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            {copy.siteHeader.brandSubtitle}
          </div>
        </div>
      </div>
      <nav className="pill-nav">
        <PillNavButton active={activePill === "map"} onClick={() => handlePillClick("map")}>
          {nav.map}
        </PillNavButton>
        <PillNavButton active={activePill === "why"} onClick={() => handlePillClick("why")}>
          {nav.why}
        </PillNavButton>
        <PillNavButton active={activePill === "tracks"} onClick={() => handlePillClick("tracks")}>
          {nav.tracks}
        </PillNavButton>
        <PillNavButton active={activePill === "who"} onClick={() => handlePillClick("who")}>
          {nav.who}
        </PillNavButton>
      </nav>
    </header>
  );
}
