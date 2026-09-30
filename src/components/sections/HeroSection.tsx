import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { scrollToSection } from "../../lib/scrollToSection";
import { copy } from "../../locales";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div>
        <h1 id="hero-heading" className="hero-title">
          {copy.hero.title}
        </h1>
        <p className="hero-body">
          {copy.hero.bodyBeforeProject}
        </p>
        <p className="hero-body">{copy.hero.purpose}</p>
        <div className="hero-actions">
          <Button variant="primary" onClick={() => scrollToSection("map")}>
            {copy.hero.cta.map}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/about#why")}>
            {copy.hero.cta.why}
          </Button>
        </div>
      </div>
    </section>
  );
}
