import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { copy } from "../../locales";
import { PillNavButton } from "../ui/PillNavButton";
import { scrollToSection } from "../../lib/scrollToSection";

export function SiteHeader() {
  const [activePill, setActivePill] = useState<"map" | "why" | "tracks" | "who">("map");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const handlePillClick = (section: "map" | "why" | "tracks" | "who") => {
    if (!isHome) {
      navigate(`/#${section}`);
      return;
    }
    setActivePill(section);
    scrollToSection(section);
  };

  const { nav } = copy.siteHeader;

  return (
    <header>
      <Link to="/" className="brand">
        <div className="brand-mark" aria-hidden="true" />
        <div>
          <div className="brand-title">{copy.siteHeader.brandTitle}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            {copy.siteHeader.brandSubtitle}
          </div>
        </div>
      </Link>
      <nav className="pill-nav">
        <PillNavButton active={isHome && activePill === "map"} onClick={() => handlePillClick("map")}>
          {nav.map}
        </PillNavButton>
        <PillNavButton active={isHome && activePill === "why"} onClick={() => handlePillClick("why")}>
          {nav.why}
        </PillNavButton>
        <PillNavButton active={isHome && activePill === "tracks"} onClick={() => handlePillClick("tracks")}>
          {nav.tracks}
        </PillNavButton>
        <PillNavButton active={isHome && activePill === "who"} onClick={() => handlePillClick("who")}>
          {nav.who}
        </PillNavButton>
        <NavLink
          to="/resources"
          className={({ isActive }) => (isActive ? "primary" : undefined)}
        >
          {nav.resources}
        </NavLink>
      </nav>
    </header>
  );
}
