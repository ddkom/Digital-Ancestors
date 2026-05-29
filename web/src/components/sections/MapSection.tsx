import { useEffect, useRef, useState } from "react";
import type { PathwayNode } from "../../types/pathway";
import { usePathwayMap } from "../../hooks/usePathwayMap";
import { copy } from "../../locales";
import { MapViewport } from "../map/MapViewport";
import { ConnectionLayer } from "../map/ConnectionLayer";
import { PathwayNodeCard } from "../map/PathwayNodeCard";
import { MapControls } from "../map/MapControls";
import { MapLegend } from "../map/MapLegend";
import { SectionHeader } from "./SectionHeader";
import {
  ShaderBackground,
  type ShaderPalette,
} from "../ShaderBackground";

type Props = {
  nodes: PathwayNode[];
  shaderPalette: ShaderPalette;
};

export function MapSection({ nodes, shaderPalette }: Props) {
  const fullscreenHostRef = useRef<HTMLDivElement>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsMapFullscreen(document.fullscreenElement === fullscreenHostRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const {
    nodeById,
    viewportRef,
    pointX,
    pointY,
    scale,
    setPointX,
    setPointY,
    visibleIds,
    toggleOption,
    isOptionSelected,
    resetMap,
    applyZoom,
    zoomByButton,
    activeEdges,
    NODE_WIDTH,
  } = usePathwayMap(nodes);

  const toggleFullscreen = () => {
    const elem = fullscreenHostRef.current;
    if (!elem) return;
    if (!document.fullscreenElement) {
      const req =
        elem.requestFullscreen ||
        (elem as unknown as { webkitRequestFullscreen?: () => void })
          .webkitRequestFullscreen;
      req?.call(elem);
    } else {
      const exit =
        document.exitFullscreen ||
        (document as unknown as { webkitExitFullscreen?: () => void })
          .webkitExitFullscreen;
      exit?.call(document);
    }
  };

  return (
    <section id="map" className="section" aria-labelledby="map-heading">
      <SectionHeader
        kicker={copy.map.kicker}
        title={copy.map.title}
        titleId="map-heading"
        body={copy.map.body}
      />

      {/* <div className="map-shell"> */}
        <div className="map-shell-header">
          <div>{copy.map.shellTitle}</div>
          <div className="map-shell-badges">
            <div className="map-shell-badge">{copy.map.badges.pan}</div>
            <div className="map-shell-badge">{copy.map.badges.zoom}</div>
            <div className="map-shell-badge">{copy.map.badges.paths}</div>
          </div>
        </div>

        <div ref={fullscreenHostRef} className="map-fullscreen-host">
          {isMapFullscreen ? (
            <ShaderBackground palette={shaderPalette} />
          ) : null}
          <MapViewport
            viewportRef={viewportRef}
            pointX={pointX}
            pointY={pointY}
            setPointX={setPointX}
            setPointY={setPointY}
            applyZoom={applyZoom}
          >
            <div
              id="world"
              style={{
                transform: `translate(${pointX}px, ${pointY}px) scale(${scale})`,
              }}
            >
              <ConnectionLayer
                edges={activeEdges}
                nodeById={nodeById}
                nodeWidth={NODE_WIDTH}
              />
              {nodes.map((node) => (
                <PathwayNodeCard
                  key={node.id}
                  node={node}
                  visible={visibleIds.has(node.id)}
                  isOptionSelected={(toId) => isOptionSelected(node.id, toId)}
                  onToggleOption={(toId) => toggleOption(node.id, toId)}
                />
              ))}
            </div>
            <MapControls
              onFullscreen={toggleFullscreen}
              onReset={resetMap}
              onZoomIn={() => zoomByButton(0.2)}
              onZoomOut={() => zoomByButton(-0.2)}
            />
          </MapViewport>
        </div>

        <MapLegend />
      {/* </div> */}
    </section>
  );
}
