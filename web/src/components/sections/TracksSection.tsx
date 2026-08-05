import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { copy } from "../../locales";
import type { ShaderPalette } from "../ShaderBackground";
import { PERSONAS } from "../../data/personas";
import { SectionHeader } from "./SectionHeader";

type Props = {
  shaderPalette: ShaderPalette;
};

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

export function TracksSection({ shaderPalette }: Props) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const personaColors: Record<string, string> = {
    guardian: shaderPalette?.deep ?? "#6D88C9",
    steward: shaderPalette?.highlight ?? "#8EA52A",
    weaver: "#7B5CD6",
    trailblazer: shaderPalette?.accent ?? "#97CAF1",
  };
  const tracks = PERSONAS.map((persona) => ({
    ...persona,
    accent: personaColors[persona.id],
  }));

  const toggleFlip = (id: string) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onCardKeyDown = (id: string) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip(id);
    }
  };

  return (
    <section id="tracks" className="section" aria-labelledby="tracks-heading">
      <SectionHeader
        kicker={copy.tracks.kicker}
        title={copy.tracks.title}
        titleId="tracks-heading"
        body={copy.tracks.body}
      />
      <div className="track-grid">
        {tracks.map((t) => {
          const isFlipped = Boolean(flipped[t.id]);
          return (
            <article
              key={t.id}
              className={`track-card persona-card persona-card--${t.id}${isFlipped ? " is-flipped" : ""}`}
              tabIndex={0}
              role="button"
              aria-pressed={isFlipped}
              style={{ "--persona-accent": t.accent } as CSSProperties}
              aria-label={`${t.name}: ${t.subtitle}. Activate to flip card.`}
              onClick={() => toggleFlip(t.id)}
              onKeyDown={onCardKeyDown(t.id)}
            >
              <div className="track-card-inner">
                <div className="track-card-face track-card-front persona-front">
                  <header className="persona-front-meta">
                    <span className="persona-code">{t.code}</span>
                    <span className="persona-stamp" aria-hidden="true">
                      DA
                    </span>
                  </header>
                  <div className="persona-portrait-wrap">
                    <span className="persona-portrait-label">Portrait</span>
                    {t.image ? (
                      <img
                        className="persona-portrait"
                        src={t.image}
                        alt={t.imageAlt}
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
                    <h3 className="persona-name">{t.name}</h3>
                    <p className="persona-subtitle">{t.subtitle}</p>
                  </div>
                  <footer className="persona-front-codes">
                    <Barcode />
                    <QrMark />
                  </footer>
                </div>

                <div className="track-card-face track-card-back persona-back">
                  <aside className="persona-stance-rail" aria-hidden="true">
                    <span>{t.stanceText}</span>
                  </aside>
                  <div className="persona-back-body">
                    <header className="persona-back-header">
                      <p className="persona-pass-label">PASS CARD</p>
                      <h3 className="persona-back-name">{t.name}</h3>
                      <p className="persona-back-sub">{t.subtitle}</p>
                      <p className="persona-card-code">CARD CODE · {t.code}</p>
                    </header>

                    <dl className="persona-stats">
                      <div className="persona-stat">
                        <dt>Nickname</dt>
                        <dd>{t.subtitle}</dd>
                      </div>
                      <div className="persona-stat">
                        <dt>Default Stance</dt>
                        <dd>{t.defaultStance}</dd>
                      </div>
                      <div className="persona-stat">
                        <dt>Favourite Medium</dt>
                        <dd>{t.favouriteMedium}</dd>
                      </div>
                      <div className="persona-stat">
                        <dt>Famous Quote</dt>
                        <dd>{t.famousQuote}</dd>
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
        })}
      </div>
    </section>
  );
}
