import { useEffect, type MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import pathwayNodeDefs from "../data/pathwayNodes.json";
import type { PathwayNodeDef } from "../types/pathway";
import { copy } from "../locales";
import { scrollToSection } from "../lib/scrollToSection";
import { TRACK_CHARACTER } from "../utils/trackPillStyles";
import {
  countResources,
  extractResourceGroups,
  extractResourceGroupsByTrack,
  type PathwayTrack,
} from "../utils/extractPathwayResources";
import { SectionHeader } from "../components/sections/SectionHeader";
import { ResourceGroupList } from "../components/resources/ResourceGroupList";

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
  const location = useLocation();
  const { kicker, title, body } = copy.resources;
  const totalResources = countResources(allGroups);
  const pickerTracks = (["protect", "admin", "create"] as const).map((track) => ({
    track,
    meta: TRACK_META[track],
    character: TRACK_CHARACTER[track],
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
        <SectionHeader
          kicker={kicker}
          title={title}
          titleId="resources-heading"
          body={
            <>
              {body}{" "}
              <span className="resources-count">
                {totalResources} resources across {trackSections.length} streams.
              </span>
            </>
          }
        />

        <div className="track-pill-panel">
          <nav className="resources-track-picker" aria-label={copy.map.aria.legend}>
            {pickerTracks.map(({ track, meta, character }) => (
              <a
                key={track}
                href={`#${meta.sectionId}`}
                className={`track-pill track-pill-${character}`}
                onClick={handleTrackPick(meta.sectionId)}
              >
                {meta.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="resources-tracks">
          {trackSections.map(({ track, groups }) => {
            const meta = TRACK_META[track];
            const character = TRACK_CHARACTER[track];

            return (
              <section
                key={track}
                className={`resources-track resources-track-${track}`}
                aria-labelledby={meta.sectionId}
              >
                <header className="resources-track-header">
                  <div className={`track-pill track-pill-${character} resources-track-kicker`}>
                    {meta.label}
                  </div>
                  <h2 className="resources-track-title" id={meta.sectionId}>
                    {meta.title}
                  </h2>
                  <p className="resources-track-body">{meta.body}</p>
                </header>

                <article className="story-card resources-panel">
                  <ResourceGroupList groups={groups} />
                </article>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
