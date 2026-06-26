import pathwayNodeDefs from "../data/pathwayNodes.json";
import type { PathwayNodeDef } from "../types/pathway";
import { copy } from "../locales";
import {
  countResources,
  extractResourceGroups,
  extractResourceGroupsByTrack,
  type PathwayTrack,
} from "../utils/extractPathwayResources";
import { SectionHeader } from "../components/sections/SectionHeader";

const trackSections = extractResourceGroupsByTrack(pathwayNodeDefs as PathwayNodeDef[]);
const allGroups = extractResourceGroups(pathwayNodeDefs as PathwayNodeDef[]);

const TRACK_META: Record<
  PathwayTrack,
  { label: string; title: string; body: string; sectionId: string }
> = {
  protect: {
    label: copy.tracks.cards[0].label,
    title: copy.tracks.cards[0].title,
    body: copy.tracks.cards[0].body,
    sectionId: "resources-protect",
  },
  admin: {
    label: copy.tracks.cards[1].label,
    title: copy.tracks.cards[1].title,
    body: copy.tracks.cards[1].body,
    sectionId: "resources-admin",
  },
  create: {
    label: copy.tracks.cards[2].label,
    title: copy.tracks.cards[2].title,
    body: copy.tracks.cards[2].body,
    sectionId: "resources-create",
  },
};

export function ResourcesPage() {
  const { kicker, title, body } = copy.resources;
  const totalResources = countResources(allGroups);

  return (
    <main>
      <section className="section resources-page" aria-labelledby="resources-heading">
        <SectionHeader
          kicker={kicker}
          title={title}
          titleId="resources-heading"
          body={
            <>
              {body}{" "}
              <span className="resources-count">
                {totalResources} resources across {allGroups.length} pathway steps.
              </span>
            </>
          }
        />

        <div className="resources-tracks">
          {trackSections.map(({ track, groups }) => {
            const meta = TRACK_META[track];

            return (
              <section
                key={track}
                className={`resources-track resources-track-${track}`}
                aria-labelledby={meta.sectionId}
              >
                <header className="resources-track-header">
                  <div className="resources-track-kicker">{meta.label}</div>
                  <h2 className="resources-track-title" id={meta.sectionId}>
                    {meta.title}
                  </h2>
                  <p className="resources-track-body">{meta.body}</p>
                </header>

                <div className="resources-steps">
                  {groups.map((group) => (
                    <article
                      key={group.nodeId}
                      className="story-card resources-step"
                      aria-labelledby={`step-${group.nodeId}`}
                    >
                      <header className="resources-step-header">
                        <div className="resources-step-title-row">
                          <h3
                            className="resources-step-title"
                            id={`step-${group.nodeId}`}
                          >
                            {group.nodeTitle}
                          </h3>
                          {group.nodeTag ? (
                            <span className="resources-step-tag">{group.nodeTag}</span>
                          ) : null}
                        </div>
                        {group.nodeDesc ? (
                          <p className="resources-step-desc">{group.nodeDesc}</p>
                        ) : null}
                      </header>

                      {group.blocks.map((block, blockIndex) => (
                        <div
                          key={`${group.nodeId}-${block.category}-${blockIndex}`}
                          className="resources-block"
                        >
                          {group.blocks.length > 1 ? (
                            <p className="resources-block-label">{block.category}</p>
                          ) : null}
                          {block.notes ? (
                            <p className="resources-block-notes">{block.notes}</p>
                          ) : null}
                          <ul className="resources-list">
                            {block.resources.map((resource) => (
                              <li key={resource.link} className="resources-item">
                                <a
                                  href={resource.link}
                                  className="resource-link"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {resource.title ?? resource.name}
                                </a>
                                {resource.desc ? (
                                  <p className="resource-desc">{resource.desc}</p>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
