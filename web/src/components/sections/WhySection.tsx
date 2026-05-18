import { copy } from "../../locales";

export function WhySection() {
  const { storyCard } = copy.why;

  return (
    <section id="why" className="section">
      <div className="two-col">
        <div className="section-header">
          <div className="section-kicker">{copy.why.kicker}</div>
          <h2 className="section-title">{copy.why.title}</h2>
          <p className="section-body">{copy.why.body}</p>
        </div>
        <div className="story-card">
          {storyCard.intro}{" "}
          <strong>{copy.common.projectTitle}</strong>
          {storyCard.middle}{" "}
          <strong>{copy.common.openFramework}</strong> {storyCard.middleSuffix}
          <br />
          <br />
          {storyCard.closing}
        </div>
      </div>
    </section>
  );
}
