import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

function isMobileViewport() {
  return window.matchMedia("(max-width: 880px)").matches;
}

export function MapSection({ nodes, shaderPalette }: Props) {
  const fullscreenHostRef = useRef<HTMLDivElement>(null);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isCssExpanded, setIsCssExpanded] = useState(false);
  const isMapFullscreen = isNativeFullscreen || isCssExpanded;

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsNativeFullscreen(
        document.fullscreenElement === fullscreenHostRef.current,
      );
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    };
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
    recaptureView,
    applyZoom,
    zoomByButton,
    activeEdges,
    NODE_WIDTH,
  } = usePathwayMap(nodes);

  const recaptureRef = useRef(recaptureView);
  recaptureRef.current = recaptureView;

  useLayoutEffect(() => {
    if (!isCssExpanded) return;
    const header = document.querySelector("header");
    const applyFrame = () => {
      const headerHeight = header?.getBoundingClientRect().height ?? 68;
      const viewHeight = Math.max(
        window.innerHeight,
        window.visualViewport?.height ?? 0,
      );
      const mapHeight = Math.max(0, viewHeight - headerHeight);
      document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
      document.documentElement.style.setProperty("--map-expanded-height", `${mapHeight}px`);
      const host = fullscreenHostRef.current;
      if (host) {
        host.style.top = `${headerHeight}px`;
        host.style.height = `${mapHeight}px`;
      }
      const viewport = viewportRef.current;
      if (viewport) {
        viewport.style.height = `${mapHeight}px`;
      }
    };
    applyFrame();
    document.body.classList.add("is-map-expanded");
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsCssExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", applyFrame);
    window.visualViewport?.addEventListener("resize", applyFrame);
    window.visualViewport?.addEventListener("scroll", applyFrame);
    return () => {
      document.body.classList.remove("is-map-expanded");
      document.body.style.overflow = "";
      document.documentElement.style.removeProperty("--map-expanded-height");
      const host = fullscreenHostRef.current;
      if (host) {
        host.style.top = "";
        host.style.height = "";
      }
      const viewport = viewportRef.current;
      if (viewport) viewport.style.height = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", applyFrame);
      window.visualViewport?.removeEventListener("resize", applyFrame);
      window.visualViewport?.removeEventListener("scroll", applyFrame);
    };
  }, [isCssExpanded, viewportRef]);

  const enterFullscreen = () => {
    if (isMapFullscreen) return;
    const elem = fullscreenHostRef.current;
    if (!elem) return;
    if (isMobileViewport()) {
      setIsCssExpanded(true);
      return;
    }
    const req =
      elem.requestFullscreen ||
      (elem as unknown as { webkitRequestFullscreen?: () => Promise<void> })
        .webkitRequestFullscreen;
    if (!req) {
      setIsCssExpanded(true);
      return;
    }
    Promise.resolve(req.call(elem)).catch(() => setIsCssExpanded(true));
  };

  const toggleFullscreen = () => {
    if (isCssExpanded) {
      setIsCssExpanded(false);
      return;
    }
    if (document.fullscreenElement) {
      const exit =
        document.exitFullscreen ||
        (document as unknown as { webkitExitFullscreen?: () => void })
          .webkitExitFullscreen;
      exit?.call(document);
      return;
    }
    enterFullscreen();
  };

  const wasFullscreen = useRef(isMapFullscreen);

  useLayoutEffect(() => {
    if (wasFullscreen.current === isMapFullscreen) return;
    wasFullscreen.current = isMapFullscreen;
    const frame = window.requestAnimationFrame(() => recaptureRef.current());
    return () => window.cancelAnimationFrame(frame);
  }, [isMapFullscreen]);

  return (
    <section id="map" className="section" aria-labelledby="map-heading">
      <SectionHeader
        kicker={copy.map.kicker}
        title={copy.map.title}
        titleId="map-heading"
        body={copy.map.body}
      />

      <div className="map-shell-header">
        <div>{copy.map.shellTitle}</div>
        <div className="map-shell-badges">
          <div className="map-shell-badge">{copy.map.badges.pan}</div>
          <div className="map-shell-badge">{copy.map.badges.zoom}</div>
          <div className="map-shell-badge">{copy.map.badges.paths}</div>
        </div>
      </div>

      <div
        ref={fullscreenHostRef}
        className={`map-fullscreen-host${isCssExpanded ? " is-expanded" : ""}`}
      >
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
          wheelZoomEnabled={isMapFullscreen}
          shaderPalette={shaderPalette}
          onActivate={enterFullscreen}
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
              layoutEpoch={[...visibleIds].sort().join()}
            />
            {nodes.map((node) => (
              <PathwayNodeCard
                key={node.id}
                node={node}
                visible={visibleIds.has(node.id)}
                isOptionSelected={(toId) => isOptionSelected(node.id, toId)}
                onToggleOption={(toId) => {
                  enterFullscreen();
                  toggleOption(node.id, toId);
                }}
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

      <MapLegend shaderPalette={shaderPalette} />
    </section>
  );
}
