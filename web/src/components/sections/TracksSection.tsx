import { SectionHeader } from "./SectionHeader";

const tracks = [
  {
    pillStyle: { background: "rgba(244,63,94,0.08)", border: "1px solid rgba(248,113,113,0.5)" },
    dot: "#f97373",
    label: "Protect",
    title: "Track 1 - Reduce how much work is used for AI training",
    body:
      "For artists who want to minimise how much of their work ends up in training datasets or is copied by AI models.",
    items: [
      "Image cloaking tools like Glaze or Nightshade",
      "Attribution and watermarking practices",
      "Website-level preferences and opt-outs",
      "Contract language for client and platform agreements",
    ],
  },
  {
    pillStyle: { background: "rgba(252,211,77,0.08)", border: "1px solid rgba(250,204,21,0.55)" },
    dot: "#facc15",
    label: "Admin Support",
    title: "Track 2 - Use AI for studio admin without oversharing",
    body:
      "For artists who want to use AI as a studio assistant. For example, help with writing and planning while keeping control over their data.",
    items: [
      "Prompt tips to improve privacy",
      "Automation tools and examples",
      "Mainstream and local chat tool options",
    ],
  },
  {
    pillStyle: { background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.55)" },
    dot: "#22c55e",
    label: "Co-create",
    title: "Track 3 - Make new work with AI",
    body:
      "For artists experimenting with AI media who want to stay grounded in ethics and transparency.",
    items: [
      "Model choices and data sourcing basics",
      "Train models with your own data",
      "What current copyright law covers and what it does not",
    ],
  },
];

export function TracksSection() {
  return (
    <section id="tracks" className="section" aria-labelledby="tracks-heading">
      <SectionHeader
        kicker="Three pathways"
        title="Tracks to match your preferences"
        titleId="tracks-heading"
        body="You can follow one track or move between them. The map starts where you are and adapts as your needs change."
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
