import { Link } from "react-router-dom";
import { copy } from "../../locales";

const CHARACTER_HASHES = ["guardian", "steward", "trailblazer"] as const;

export function MapLegend() {
  const legendItems = [
    { label: copy.map.legend.protect, hash: CHARACTER_HASHES[0] },
    { label: copy.map.legend.admin, hash: CHARACTER_HASHES[1] },
    { label: copy.map.legend.create, hash: CHARACTER_HASHES[2] },
  ];

  return (
    <div className="track-pill-panel map-legend-panel">
      <nav className="map-legend-inline" aria-label={copy.map.aria.legend}>
        {legendItems.map((item) => (
          <Link
            key={item.hash}
            to={{ pathname: "/characters", hash: `#${item.hash}` }}
            className={`track-pill track-pill-${item.hash}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
