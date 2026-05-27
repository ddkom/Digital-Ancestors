import { copy } from "../../locales";
import { SectionHeader } from "./SectionHeader";

const trackStyles = [
  { pillStyle: { background: "rgba(160,167,229,0.08)" }, dot: "#A0A7E5" },
  { pillStyle: { background: "rgba(142,165,42,0.08)" }, dot: "#8EA52A" },
  { pillStyle: { background: "rgba(34,197,94,0.08)" }, dot: "#22c55e" },
] as const;

const tracks = copy.tracks.cards.map((card, i) => ({
  ...card,
  ...trackStyles[i],
}));

export function TracksSection() {
  return (
    <section id="tracks" className="section" aria-labelledby="tracks-heading">
      <SectionHeader
        kicker={copy.tracks.kicker}
        title={copy.tracks.title}
        titleId="tracks-heading"
        body={copy.tracks.body}
      />
      <div className="track-grid">
        {tracks.map((t) => (
          <article key={t.title} className="track-card">
            <div className="track-pill" style={t.pillStyle}>
              <span className="dot" style={{ background: t.dot }} />
              {t.label}
            </div>
            <h3 className="track-title">{t.title}</h3>
            <p className="track-body">{t.body}</p>
            <ul className="track-list">
              {t.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
