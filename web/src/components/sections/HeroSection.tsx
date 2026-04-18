import { Button } from "../ui/Button";
import { scrollToSection } from "../../lib/scrollToSection";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div>
        <div className="hero-kicker">
          <span className="dot" /> Artist-led guidance for AI choices
        </div>
        <h1 id="hero-heading" className="hero-title">
          A guided map to help artists{" "}
          <span className="hero-highlight">
            use AI, refuse it, or find the balance in between
          </span>
        </h1>
        <p className="hero-body">
          This framework turns complex questions about copyright, privacy, ethics, and creativity
          into a guided map with concrete actions and resources you can use right now. It is part of{" "}
          <em>Digital Ancestors: Mortality, Memory, Machine</em>, a collaboration between artists
          and responsible AI practitioners exploring how creative work can coexist with emerging
          technologies.
        </p>
        <div className="hero-actions">
          <Button variant="primary" onClick={() => scrollToSection("map")}>
            Start the map
          </Button>
          <Button variant="ghost" onClick={() => scrollToSection("why")}>
            Read the backstory
          </Button>
        </div>
      </div>

      <aside className="hero-aside" aria-label="What this map can help you do">
        <div className="hero-aside-title">What this framework does</div>
        <div className="hero-aside-body">
          Answer a small set of questions and receive clear next steps and informative resources. You
          can reduce scraping risk, use AI for studio support without oversharing, or experiment
          with new tools while staying grounded in your personal preferences.
        </div>
        <div className="hero-aside-grid">
          <div className="hero-chip">
            <span className="label">If you want to</span>
            Say no to AI scraping and protect your archives or new uploads
          </div>
          <div className="hero-chip">
            <span className="label">If you want to</span>
            Get help with admin work without sharing sensitive material
          </div>
          <div className="hero-chip">
            <span className="label">If you want to</span>
            Experiment with AI while understanding copyright implications
          </div>
          <div className="hero-chip">
            <span className="label">If you feel</span>
            Start somewhere, even if you feel unsure
          </div>
        </div>
      </aside>
    </section>
  );
}
