import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { scrollToSection } from "../lib/scrollToSection";
import { HeroSection } from "../components/sections/HeroSection";
import { TracksSection } from "../components/sections/TracksSection";
import { QuizMapSection } from "../components/quiz/QuizMapSection";
import { EventSection } from "../components/sections/EventSection";

/** Sections that moved to the About page; old /#why and /#who links go there. */
const MOVED_TO_ABOUT = ["why", "who"];

export function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    if (MOVED_TO_ABOUT.includes(hash)) {
      navigate(`/about#${hash}`, { replace: true });
      return;
    }
    requestAnimationFrame(() => scrollToSection(hash));
  }, [navigate]);

  return (
    <main>
        <HeroSection />
        <TracksSection />
        <QuizMapSection />
        <EventSection />
    </main>
  );
}
