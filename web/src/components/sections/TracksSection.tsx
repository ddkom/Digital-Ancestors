import { copy } from "../../locales";
import type { ShaderPalette } from "../ShaderBackground";
import { trackPillStylesFromPalette } from "../../utils/trackPillStyles";
import { SectionHeader } from "./SectionHeader";

type Props = {
  shaderPalette: ShaderPalette;
};

export function TracksSection({ shaderPalette }: Props) {
  const styles = trackPillStylesFromPalette(shaderPalette);
  const tracks = copy.tracks.cards.map((card, i) => ({
    ...card,
    pillStyle: styles[i].pillStyle,
  }));
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
