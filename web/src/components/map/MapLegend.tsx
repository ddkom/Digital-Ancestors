import { Link } from "react-router-dom";
import { copy } from "../../locales";
import type { ShaderPalette } from "../ShaderBackground";
import { trackPillStylesFromPalette } from "../../utils/trackPillStyles";

type Props = {
  shaderPalette: ShaderPalette;
};

const CHARACTER_HASHES = ["guardian", "steward", "trailblazer"] as const;

export function MapLegend({ shaderPalette }: Props) {
  const styles = trackPillStylesFromPalette(shaderPalette);
  const legendItems = [
    { label: copy.map.legend.protect, hash: CHARACTER_HASHES[0] },
    { label: copy.map.legend.admin, hash: CHARACTER_HASHES[1] },
    { label: copy.map.legend.create, hash: CHARACTER_HASHES[2] },
  ].map((item, i) => ({ ...item, pillStyle: styles[i].pillStyle }));

  return (
    <div className="track-pill-panel map-legend-panel">
      <nav className="map-legend-inline" aria-label={copy.map.aria.legend}>
        {legendItems.map((item) => (
          <Link
            key={item.hash}
            to={{ pathname: "/characters", hash: `#${item.hash}` }}
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
