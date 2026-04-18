const items = [
  { color: "#f97373", label: "Track 1: Protect and preserve" },
  { color: "#facc15", label: "Track 2: Studio and admin support" },
  { color: "#22c55e", label: "Track 3: Co-create and transform" },
];

export function MapLegend() {
  return (
    <div className="map-legend-inline" aria-label="Track legend">
      {items.map((item) => (
        <span key={item.label} className="map-legend-item">
          <span className="map-legend-swatch" style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
