import { PillNavButton } from "../ui/PillNavButton";
import { scrollToSection } from "../../lib/scrollToSection";

export function SiteHeader() {
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
        <PillNavButton active onClick={() => scrollToSection("map")}>
          Launch the map
        </PillNavButton>
        <PillNavButton onClick={() => scrollToSection("why")}>Backstory</PillNavButton>
        <PillNavButton onClick={() => scrollToSection("tracks")}>Tracks</PillNavButton>
        <PillNavButton onClick={() => scrollToSection("who")}>Who it&apos;s for</PillNavButton>
      </nav>
    </header>
  );
}
