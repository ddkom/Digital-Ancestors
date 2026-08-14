import { useEffect, useState, type MouseEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { copy } from "../../locales";
import { PillNavButton } from "../ui/PillNavButton";
import { scrollToSection } from "../../lib/scrollToSection";

type HomeSection = "map" | "why" | "tracks" | "who";

export function SiteHeader() {
  const [activePill, setActivePill] = useState<HomeSection>("map");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { nav, menu, closeMenu, home } = copy.siteHeader;

  const close = () => setMenuOpen(false);

  const handlePillClick = (section: HomeSection) => {
    close();
    if (!isHome) {
      navigate(`/#${section}`);
      return;
    }
    setActivePill(section);
    scrollToSection(section);
  };

  const goHomeTop = (event: MouseEvent<HTMLAnchorElement>) => {
    close();
    if (isHome) event.preventDefault();
    window.scrollTo({ top: 0, behavior: isHome ? "smooth" : "auto" });
  };

  useEffect(() => {
    close();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className={menuOpen ? "is-menu-open" : undefined}>
      <Link to="/" className="brand" aria-label={home} onClick={goHomeTop}>
        <svg className="brand-mark" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            d="M.5.5H15.5V15.5H.5V2.5H13.5V13.5H2.5V4.5H11.5V11.5H4.5V6.5H9.5V9.5H6.5V8.5H8.5"
          />
        </svg>
        <div className="brand-copy">
          <div className="brand-title">{copy.siteHeader.brandTitle}</div>
          <div className="brand-subtitle">{copy.siteHeader.brandSubtitle}</div>
        </div>
      </Link>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="site-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="menu-toggle-bars" aria-hidden="true" />
        <span className="visually-hidden">{menuOpen ? closeMenu : menu}</span>
      </button>

      <nav id="site-nav" className={`pill-nav${menuOpen ? " is-open" : ""}`}>
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
          to="/characters"
          className={({ isActive }) => (isActive ? "primary" : undefined)}
          onClick={close}
        >
          {nav.characters}
        </NavLink>
      </nav>
    </header>
  );
}
