import { Button } from "../ui/Button";
import { scrollToSection } from "../../lib/scrollToSection";
import { copy } from "../../locales";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div>
        <h1 id="hero-heading" className="hero-title">
          {copy.hero.title}
        </h1>
        <p className="hero-body">
          {copy.hero.bodyBeforeProject}{" "}
          <em>{copy.common.projectTitle}</em>
          {copy.hero.bodyAfterProject}
        </p>
        <div className="hero-actions">
          <Button variant="primary" onClick={() => scrollToSection("map")}>
            {copy.hero.cta.map}
          </Button>
          <Button variant="ghost" onClick={() => scrollToSection("why")}>
            {copy.hero.cta.why}
          </Button>
        </div>
      </div>
    </section>
  );
}
