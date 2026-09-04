import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { copy } from "../../locales";
import { PERSONAS, type PersonaCard } from "../../data/personas";
import { SectionHeader } from "./SectionHeader";

const SWIPE_THRESHOLD = 56;
const DECK_SIZE = PERSONAS.length;

function wrapIndex(index: number): number {
  return ((index % DECK_SIZE) + DECK_SIZE) % DECK_SIZE;
}

function Barcode() {
  return (
    <svg className="persona-barcode" viewBox="0 0 120 28" aria-hidden="true">
      {[2, 5, 7, 9, 12, 14, 18, 20, 22, 26, 29, 31, 35, 38, 40, 44, 47, 49, 53, 56, 58, 62, 65, 68, 71, 75, 78, 80, 84, 87, 90, 94, 97, 100, 103, 107, 110, 113].map(
        (x, i) => (
          <rect
            key={x}
            x={x}
            y="2"
            width={i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1}
            height="24"
            fill="currentColor"
          />
        ),
      )}
    </svg>
  );
}

function QrMark() {
  return (
    <svg className="persona-qr" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="3" width="8" height="8" fill="currentColor" />
      <rect x="17" y="3" width="8" height="8" fill="currentColor" />
      <rect x="3" y="17" width="8" height="8" fill="currentColor" />
      <rect x="5" y="5" width="4" height="4" fill="var(--persona-paper, #f7f3ee)" />
      <rect x="19" y="5" width="4" height="4" fill="var(--persona-paper, #f7f3ee)" />
      <rect x="5" y="19" width="4" height="4" fill="var(--persona-paper, #f7f3ee)" />
      <rect x="14" y="14" width="3" height="3" fill="currentColor" />
      <rect x="18" y="14" width="2" height="2" fill="currentColor" />
      <rect x="22" y="18" width="3" height="3" fill="currentColor" />
      <rect x="14" y="20" width="2" height="5" fill="currentColor" />
      <rect x="18" y="22" width="5" height="2" fill="currentColor" />
    </svg>
  );
}

function PersonaFlipCard({
  track,
  isFlipped,
  onToggle,
}: {
  track: PersonaCard;
  isFlipped: boolean;
  onToggle: () => void;
}) {
  const onCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <article
      className={`track-card persona-card persona-card--${track.id}${isFlipped ? " is-flipped" : ""}`}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      aria-label={`${track.name}: ${track.subtitle}. Activate to flip card.`}
      onClick={onToggle}
      onKeyDown={onCardKeyDown}
    >
      <div className="track-card-inner">
        <div className="track-card-face track-card-front persona-front">
          <header className="persona-front-meta">
            <span className="persona-code">{track.code}</span>
            <span className="persona-stamp" aria-hidden="true">
              DA
            </span>
          </header>
          <div className="persona-portrait-wrap">
            <span className="persona-portrait-label">Portrait</span>
            {track.image ? (
              <img
                className="persona-portrait"
                src={track.image}
                alt={track.imageAlt}
                width={240}
                height={240}
                draggable={false}
              />
            ) : null}
          </div>
          <div className="persona-look-bar">
            <span>* LOOK *</span>
          </div>
          <div className="persona-front-identity">
            <h3 className="persona-name">{track.name}</h3>
            <p className="persona-subtitle">{track.subtitle}</p>
          </div>
          <footer className="persona-front-codes">
            <Barcode />
            <QrMark />
          </footer>
        </div>

        <div className="track-card-face track-card-back persona-back">
          <aside className="persona-stance-rail" aria-hidden="true">
            <span>{track.stanceText}</span>
          </aside>
          <div className="persona-back-body">
            <header className="persona-back-header">
              <div className="persona-front-meta">
                <span className="persona-code">{track.code}</span>
                <span className="persona-stamp" aria-hidden="true">
                  DA
                </span>
              </div>
              <p className="persona-pass-label">PASS CARD</p>
              <h3 className="persona-back-name">{track.name}</h3>
              <p className="persona-back-sub">{track.subtitle}</p>
            </header>

            <dl className="persona-stats">
              <div className="persona-stat">
                <dt>Nickname</dt>
                <dd>{track.subtitle}</dd>
              </div>
              <div className="persona-stat">
                <dt>Default Stance</dt>
                <dd>{track.defaultStance}</dd>
              </div>
              <div className="persona-stat">
                <dt>Favourite Medium</dt>
                <dd>{track.favouriteMedium}</dd>
              </div>
              <div className="persona-stat">
                <dt>Famous Quote</dt>
                <dd>{track.famousQuote}</dd>
              </div>
            </dl>

            <footer className="persona-back-footer">
              <div className="persona-icons" aria-hidden="true">
                <span className="persona-icon-sq" />
                <span className="persona-icon-ce">CE</span>
                <span className="persona-icon-ring">W</span>
                <span className="persona-icon-rec">
                  <svg viewBox="0 0 18 18" width="16" height="16">
                    <path
                      d="M4 5.5a6 6 0 0 1 9.2-2.1L14 2v4h-4l1.3-1.3A4.5 4.5 0 0 0 5.5 7H4zm10 7a6 6 0 0 1-9.2 2.1L4 16v-4h4l-1.3 1.3A4.5 4.5 0 0 0 12.5 11H14z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </div>
              <Barcode />
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
}

export function TracksSection() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [deckIndex, setDeckIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const skipFlip = useRef(false);
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    delta: 0,
    locked: null as "x" | "y" | null,
  });
  const tracks = PERSONAS;

  const toggleFlip = (id: string) => {
    if (skipFlip.current) return;
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const go = useCallback((step: number) => {
    if (!step) return;
    setDeckIndex((index) => index + step);
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
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
    if (Math.abs(delta) > 8) {
      skipFlip.current = true;
      window.setTimeout(() => {
        skipFlip.current = false;
      }, 0);
    }
    if (delta <= -SWIPE_THRESHOLD) go(1);
    else if (delta >= SWIPE_THRESHOLD) go(-1);
  };

  const windowIndexes = [deckIndex - 1, deckIndex, deckIndex + 1];

  return (
    <section id="tracks" className="section" aria-labelledby="tracks-heading">
      <SectionHeader
        kicker={copy.tracks.kicker}
        title={copy.tracks.title}
        titleId="tracks-heading"
        body={copy.tracks.body}
      />
      <div className="track-grid">
        {tracks.map((track) => (
          <PersonaFlipCard
            key={track.id}
            track={track}
            isFlipped={Boolean(flipped[track.id])}
            onToggle={() => toggleFlip(track.id)}
          />
        ))}
      </div>

      <div className="track-carousel character-carousel">
        <button
          type="button"
          className="character-nav-btn character-nav-prev"
          aria-label={copy.characters.prev}
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
            {windowIndexes.map((index) => {
              const track = tracks[wrapIndex(index)];
              return (
                <div
                  key={index}
                  className={`character-slide${index === deckIndex ? " is-current" : ""}`}
                  style={{ left: `${index * 100}%` }}
                  aria-hidden={index !== deckIndex}
                  {...(index !== deckIndex ? { inert: true } : {})}
                >
                  <div className="track-slide-inner">
                    <PersonaFlipCard
                      track={track}
                      isFlipped={Boolean(flipped[track.id])}
                      onToggle={() => toggleFlip(track.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="character-nav-btn character-nav-next"
          aria-label={copy.characters.next}
          onClick={() => go(1)}
        >
          →
        </button>
      </div>
    </section>
  );
}
