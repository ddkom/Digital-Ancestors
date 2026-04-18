import { SectionHeader } from "./SectionHeader";

export function WhoSection() {
  return (
    <section id="who" className="section" aria-labelledby="who-heading">
      <SectionHeader
        kicker="Who it supports"
        title="Arts communities and the people around them"
        titleId="who-heading"
        body="The framework is designed for working artists and creative practitioners. It is also useful for cultural workers, arts organizations, educators, policy-makers, and AI builders who want to better understand artist needs."
      />
      <div className="two-col">
        <div className="story-card">
          <strong>For artists and creative professionals</strong>
          <br />
          Clarify your boundaries, learn practical safety steps, and explore new workflows if you
          want them. Use the map when posting work, signing agreements, applying for funding, or
          testing new tools.
          <br />
          <br />
          <strong>For arts and legal organisations</strong>
          <br />
          Use the framework in workshops, office hours, or resource hubs. The map can support legal
          clinics, digital safety training, and collective discussions.
        </div>
        <div className="story-card">
          <strong>For policy makers</strong>
          <br />
          See where artists encounter friction in current tools and contracts. Use the map to
          surface real-world scenarios when shaping policy.
          <br />
          <br />
          <strong>For AI researchers and developers</strong>
          <br />
          Treat the map as a set of user stories that highlight artist concerns around consent,
          provenance, and creative control.
        </div>
      </div>
    </section>
  );
}
