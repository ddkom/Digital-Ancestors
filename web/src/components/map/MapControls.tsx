type Props = {
  onFullscreen: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function MapControls({ onFullscreen, onReset, onZoomIn, onZoomOut }: Props) {
  return (
    <div className="map-controls" aria-label="Map zoom controls">
      <button type="button" onClick={onFullscreen} title="Fullscreen">
        ⤢
      </button>
      <button type="button" onClick={onReset} title="Restart map">
        ↻
      </button>
      <button type="button" onClick={onZoomIn} title="Zoom in">
        +
      </button>
      <button type="button" onClick={onZoomOut} title="Zoom out">
        −
      </button>
    </div>
  );
}
