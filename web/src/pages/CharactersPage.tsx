import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { copy } from "../locales";
import type { ShaderPalette } from "../components/ShaderBackground";
import { SectionHeader } from "../components/sections/SectionHeader";
import {
  CHARACTERS,
  isCharacterId,
  type CharacterId,
  type CharacterProfile,
} from "../data/characterProfiles";
import {
  markdownToHtml,
  splitPersonaMarkdown,
} from "../utils/markdownToHtml";
import { scrollToSection } from "../lib/scrollToSection";

const SWIPE_THRESHOLD = 56;
const DECK_SIZE = CHARACTERS.length;

type Props = {
  shaderPalette: ShaderPalette;
};

function wrapIndex(index: number): number {
  return ((index % DECK_SIZE) + DECK_SIZE) % DECK_SIZE;
}

function shortestStep(from: number, to: number): number {
  const forward = wrapIndex(to - from);
  const backward = wrapIndex(from - to);
  return forward <= backward ? forward : -backward;
}

function characterAccent(id: CharacterId, palette: ShaderPalette): string {
  if (id === "guardian") return palette.deep;
  if (id === "steward") return palette.highlight;
  return palette.accent;
}

function sanitizeHtml(markdown: string): string {
  return DOMPurify.sanitize(markdownToHtml(markdown), {
    ADD_ATTR: ["target", "rel"],
  });
}

function MarkdownHtml({ markdown, className }: { markdown: string; className?: string }) {
  const html = useMemo(() => sanitizeHtml(markdown), [markdown]);
  return (
    <div
      className={["character-prose", className].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function PersonaSlide({
  character,
  shaderPalette,
}: {
  character: CharacterProfile;
  shaderPalette: ShaderPalette;
}) {
  const parsed = useMemo(
    () => splitPersonaMarkdown(character.markdown),
    [character.markdown],
  );
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div
      className="character-slide-inner"
      style={
        {
          "--persona-accent": characterAccent(character.id, shaderPalette),
        } as CSSProperties
      }
    >
      <article className="character-card" id={character.id}>
        <div className="character-card-portrait">
          {character.image ? (
            <img
              src={character.image}
              alt={character.imageAlt}
              width={640}
              height={640}
            />
          ) : null}
        </div>
        <div className="character-card-body">
          <p className="character-card-code">{character.code}</p>
          <h2 className="character-card-name">{character.name}</h2>
          <p className="character-card-sub">{character.subtitle}</p>
          {parsed.quote ? (
            <p className="character-card-quote">“{parsed.quote}”</p>
          ) : null}
          <p className="character-card-stance">{character.defaultStance}</p>
          <p className="character-lens-kicker">{parsed.lensTitle}</p>
          {parsed.lensMarkdown ? (
            <MarkdownHtml markdown={parsed.lensMarkdown} className="character-lens" />
          ) : null}
        </div>
      </article>

      <div className="character-accordions">
        {parsed.details.map((section) => {
          const open = openKey === section.title;
          const panelId = `${character.id}-${section.key}`;
          return (
            <div
              key={`${section.key}-${section.title}`}
              className={`character-accordion${open ? " is-open" : ""}`}
            >
              <button
                type="button"
                className="character-accordion-trigger"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenKey(open ? null : section.title)}
              >
                <span>{section.title}</span>
                <span className="character-accordion-icon" aria-hidden="true">
                  {open ? "–" : "+"}
                </span>
              </button>
              {open ? (
                <div className="character-accordion-panel" id={panelId}>
                  <MarkdownHtml markdown={section.markdown} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CharactersPage({ shaderPalette }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const hashId = location.hash.replace(/^#/, "");
  const hashIndex = Math.max(
    0,
    CHARACTERS.findIndex(
      (character) => character.id === (isCharacterId(hashId) ? hashId : CHARACTERS[0].id),
    ),
  );
  const [deckIndex, setDeckIndex] = useState(hashIndex);
  const activeIndex = wrapIndex(deckIndex);
  const activeId = CHARACTERS[activeIndex].id;
  const { kicker, title, body, prev, next } = copy.characters;
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    delta: 0,
    locked: null as "x" | "y" | null,
  });
  const [dragX, setDragX] = useState(0);

  const go = useCallback((step: number) => {
    if (!step) return;
    setDeckIndex((index) => index + step);
  }, []);

  useEffect(() => {
    navigate(`/characters#${activeId}`, { replace: true });
  }, [activeId, navigate]);

  useEffect(() => {
    window.setTimeout(() => scrollToSection("characters-stack"), 0);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, a, .character-accordion")) return;
    drag.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      delta: 0,
      locked: null,
    };
    setDragX(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = event.clientX - drag.current.startX;
    const dy = event.clientY - drag.current.startY;
    if (drag.current.locked === null && Math.abs(dx) + Math.abs(dy) > 8) {
      drag.current.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (drag.current.locked !== "x") return;
    drag.current.delta = dx;
    setDragX(dx);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const delta = drag.current.delta;
    const locked = drag.current.locked;
    drag.current.active = false;
    setDragX(0);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    if (locked !== "x") return;
    if (delta <= -SWIPE_THRESHOLD) go(1);
    else if (delta >= SWIPE_THRESHOLD) go(-1);
  };

  const windowIndexes = [deckIndex - 1, deckIndex, deckIndex + 1];

  return (
    <main>
      <section className="section characters-page" aria-labelledby="characters-heading">
        <SectionHeader
          kicker={kicker}
          title={title}
          titleId="characters-heading"
          body={body}
        />

        <div id="characters-stack" className="character-carousel">
          <button
            type="button"
            className="character-nav-btn character-nav-prev"
            aria-label={prev}
            onClick={() => go(-1)}
          >
            ←
          </button>

          <div
            className="character-carousel-frame"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div
              className={`character-carousel-track${dragX !== 0 ? " is-dragging" : ""}`}
              style={{
                transform: `translateX(calc(${-deckIndex * 100}% + ${dragX}px))`,
              }}
            >
              {windowIndexes.map((index) => (
                <div
                  key={index}
                  className={`character-slide${index === deckIndex ? " is-current" : ""}`}
                  style={{ left: `${index * 100}%` }}
                  aria-hidden={index !== deckIndex}
                >
                  <PersonaSlide
                    character={CHARACTERS[wrapIndex(index)]}
                    shaderPalette={shaderPalette}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="character-nav-btn character-nav-next"
            aria-label={next}
            onClick={() => go(1)}
          >
            →
          </button>
        </div>

        <div className="character-dots" role="tablist" aria-label={title}>
          {CHARACTERS.map((character, index) => (
            <button
              key={character.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={character.name}
              className={`character-dot${index === activeIndex ? " is-active" : ""}`}
              onClick={() => go(shortestStep(activeIndex, index))}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
