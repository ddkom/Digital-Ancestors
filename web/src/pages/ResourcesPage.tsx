import { useEffect, type MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import pathwayNodeDefs from "../data/pathwayNodes.json";
import type { PathwayNodeDef } from "../types/pathway";
import { copy } from "../locales";
import { scrollToSection } from "../lib/scrollToSection";
import type { ShaderPalette } from "../components/ShaderBackground";
import { trackPillStylesFromPalette, TRACK_PILL_INDEX } from "../utils/trackPillStyles";
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

type Props = {
  shaderPalette: ShaderPalette;
};

export function ResourcesPage({ shaderPalette }: Props) {
  const location = useLocation();
  const { kicker, title, body } = copy.resources;
  const totalResources = countResources(allGroups);
  const pillStyles = trackPillStylesFromPalette(shaderPalette);
  const pickerTracks = (["protect", "admin", "create"] as const).map((track, i) => ({
    track,
    meta: TRACK_META[track],
    pillStyle: pillStyles[i].pillStyle,
  }));

  useEffect(() => {
    const hash = location.hash.replace(/^#/, "");
    if (!hash) return;
    window.setTimeout(() => scrollToSection(hash), 0);
  }, [location.pathname, location.hash]);

  const handleTrackPick = (sectionId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(sectionId);
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  return (
    <main>
      <section className="section resources-page" aria-labelledby="resources-heading">
        <div className="story-card resources-intro">
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

          <div className="track-pill-panel">
            <nav className="resources-track-picker" aria-label={copy.map.aria.legend}>
              {pickerTracks.map(({ track, meta, pillStyle }) => (
                <a
                  key={track}
                  href={`#${meta.sectionId}`}
                  className="track-pill"
                  style={pillStyle}
                  onClick={handleTrackPick(meta.sectionId)}
                >
                  {meta.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="resources-tracks">
          {trackSections.map(({ track, groups }) => {
            const meta = TRACK_META[track];
            const { pillStyle } = pillStyles[TRACK_PILL_INDEX[track]];

            return (
              <section
                key={track}
                className={`resources-track resources-track-${track}`}
                aria-labelledby={meta.sectionId}
              >
                <div className="resources-track-header">
                  <div className="track-pill resources-track-kicker" style={pillStyle}>
                    {meta.label}
                  </div>
                  <h2 className="resources-track-title" id={meta.sectionId}>
                    {meta.title}
                  </h2>
                  <p className="resources-track-body">{meta.body}</p>
                </div>

                <div className="story-card resources-track-content">
                  {groups.map((group) => (
                    <section
                      key={group.nodeId}
                      className="resources-step"
                      aria-labelledby={`step-${group.nodeId}`}
                    >
                      <div className="resources-step-header">
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
                      </div>

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
                    </section>
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
