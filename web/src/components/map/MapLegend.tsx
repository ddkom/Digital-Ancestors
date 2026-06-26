import { Link } from "react-router-dom";
import { copy } from "../../locales";
import type { ShaderPalette } from "../ShaderBackground";
import { trackPillStylesFromPalette } from "../../utils/trackPillStyles";

type Props = {
  shaderPalette: ShaderPalette;
};

const RESOURCE_SECTION_IDS = [
  "resources-protect",
  "resources-admin",
  "resources-create",
] as const;

export function MapLegend({ shaderPalette }: Props) {
  const styles = trackPillStylesFromPalette(shaderPalette);
  const legendItems = [
    { label: copy.map.legend.protect, sectionId: RESOURCE_SECTION_IDS[0] },
    { label: copy.map.legend.admin, sectionId: RESOURCE_SECTION_IDS[1] },
    { label: copy.map.legend.create, sectionId: RESOURCE_SECTION_IDS[2] },
  ].map((item, i) => ({ ...item, pillStyle: styles[i].pillStyle }));

  return (
    <div className="track-pill-panel map-legend-panel">
      <nav className="map-legend-inline" aria-label={copy.map.aria.legend}>
        {legendItems.map((item) => (
          <Link
            key={item.sectionId}
            to={{ pathname: "/resources", hash: `#${item.sectionId}` }}
            className="track-pill"
            style={item.pillStyle}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
