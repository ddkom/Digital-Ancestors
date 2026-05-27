import { copy } from "../../locales";
import { SectionHeader } from "./SectionHeader";

export function WhoSection() {
  const { audiences } = copy.who;

  return (
    <section id="who" className="section" aria-labelledby="who-heading">
      <SectionHeader
        kicker={copy.who.kicker}
        title={copy.who.title}
        titleId="who-heading"
        body={copy.who.body}
      />
      <div className="two-col">
        <div className="story-card">
          <strong>{audiences.artists.heading}</strong>
          <br />
          {audiences.artists.body}
          <br />
          <br />
          <strong>{audiences.organisations.heading}</strong>
          <br />
          {audiences.organisations.body}
        </div>
        <div className="story-card">
          <strong>{audiences.policy.heading}</strong>
          <br />
          {audiences.policy.body}
          <br />
          <br />
          <strong>{audiences.researchers.heading}</strong>
          <br />
          {audiences.researchers.body}
        </div>
      </div>
    </section>
  );
}
