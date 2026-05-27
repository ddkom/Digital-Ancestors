import { copy } from "../../locales";

type Props = {
  onFullscreen: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function MapControls({ onFullscreen, onReset, onZoomIn, onZoomOut }: Props) {
  const { controls, aria } = copy.map;

  return (
    <div className="map-controls" aria-label={aria.controls}>
      <button type="button" onClick={onFullscreen} title={controls.fullscreen}>
        ⤢
      </button>
      <button type="button" onClick={onReset} title={controls.reset}>
        ↻
      </button>
      <button type="button" onClick={onZoomIn} title={controls.zoomIn}>
        +
      </button>
      <button type="button" onClick={onZoomOut} title={controls.zoomOut}>
        −
      </button>
    </div>
  );
}
