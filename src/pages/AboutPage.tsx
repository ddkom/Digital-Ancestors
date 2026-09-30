import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { copy } from "../locales";
import { SectionHeader } from "../components/sections/SectionHeader";
import { WhySection } from "../components/sections/WhySection";
import { WhoSection } from "../components/sections/WhoSection";
import { Button } from "../components/ui/Button";
import { ResourceSuggestionDialog } from "../components/feedback/ResourceSuggestionDialog";

/** Room for the sticky header when jumping to a section (same as scrollToSection). */
const HEADER_OFFSET = 80;

export function AboutPage() {
  const { hash } = useLocation();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { title, intro, hope, ai, living } = copy.about;

  // Open at the top, or jump straight to a section when linked to one (e.g. /about#why).
  // Instant, not smooth: a smooth scroll started during page load gets cancelled.
  useEffect(() => {
    const id = hash.replace(/^#/, "");
    const timer = window.setTimeout(() => {
      const el = id ? document.getElementById(id) : null;
      const top = el ? el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET : 0;
      window.scrollTo({ top, behavior: "instant" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <main>
      <h1 className="hero-title">{title}</h1>
      <p className="section-body">{intro}</p>

      <WhySection />

      <section id="hope" className="section" aria-labelledby="hope-heading">
        <SectionHeader kicker={hope.kicker} title={hope.title} titleId="hope-heading" body={hope.body} />
      </section>

      <WhoSection />

      <section id="ai" className="section" aria-labelledby="ai-heading">
        <div className="section-header">
          <div className="section-kicker">{ai.kicker}</div>
          <h2 className="section-title" id="ai-heading">
            {ai.title}
          </h2>
          {ai.body.map((paragraph) => (
            <p key={paragraph} className="section-body">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section id="living" className="section" aria-labelledby="living-heading">
        <div className="story-card about-living">
          <div className="section-kicker">{living.kicker}</div>
          <h2 className="section-title" id="living-heading">
            {living.title}
          </h2>
          <p>{living.body}</p>
          <Button variant="primary" onClick={() => setFeedbackOpen(true)}>
            {living.button}
          </Button>
        </div>
      </section>

      <ResourceSuggestionDialog
        open={feedbackOpen}
        sourceGuide={null}
        onClose={() => setFeedbackOpen(false)}
        title={living.dialogTitle}
        intro={living.dialogIntro}
      />
    </main>
  );
}
