import { Button } from "../ui/Button";
import { scrollToSection } from "../../lib/scrollToSection";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div>
        {/* <div className="hero-kicker">
          <span className="dot" /> Artist-led guidance for AI choices
        </div> */}
        <h1 id="hero-heading" className="hero-title">
          {/* A guided map to help artists{" "} */}
          {/* <span className="hero-highlight"> */}
            use AI, refuse it, or find the balance in between...
          {/* </span> */}
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
    </section>
  );
}
