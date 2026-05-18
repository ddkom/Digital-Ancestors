import { copy } from "../../locales";

const legendItems = [
  { color: "#f97373", label: copy.map.legend.protect },
  { color: "#facc15", label: copy.map.legend.admin },
  { color: "#22c55e", label: copy.map.legend.create },
];

export function MapLegend() {
  return (
    <div className="map-legend-inline" aria-label={copy.map.aria.legend}>
      {legendItems.map((item) => (
        <span key={item.label} className="map-legend-item">
          <span className="map-legend-swatch" style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
