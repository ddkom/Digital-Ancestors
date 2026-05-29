import { useEffect, useLayoutEffect, useState } from "react";
import type { PathwayNode } from "../../types/pathway";
import {
  connectionPathD,
  estimateEdgeAnchors,
} from "../../hooks/usePathwayMap";
import { measureEdgeAnchors, type EdgeAnchor } from "./connectionAnchors";

type Edge = { from: string; to: string };

type Props = {
  edges: Edge[];
  nodeById: Map<string, PathwayNode>;
  nodeWidth: number;
  /** Re-measure when nodes finish appearing or resize. */
  layoutEpoch: string;
};

export function ConnectionLayer({
  edges,
  nodeById,
  nodeWidth,
  layoutEpoch,
}: Props) {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [anchors, setAnchors] = useState<Map<string, EdgeAnchor>>(new Map());

  useLayoutEffect(() => {
    const update = () =>
      setAnchors(measureEdgeAnchors(edges, nodeById, nodeWidth));

    update();
    const raf = requestAnimationFrame(update);
    const t = window.setTimeout(update, 650);

    const world = document.getElementById("world");
    const ro = new ResizeObserver(update);
    if (world) {
      ro.observe(world);
      world.querySelectorAll(".node-anchor").forEach((node) => ro.observe(node));
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      ro.disconnect();
    };
  }, [edges, nodeById, nodeWidth, layoutEpoch]);

  useEffect(() => {
    const keys = new Set(edges.map((e) => `${e.from}-${e.to}`));
    setVisibleKeys(new Set());
    const id = requestAnimationFrame(() => setVisibleKeys(keys));
    return () => cancelAnimationFrame(id);
  }, [edges]);

  return (
    <svg id="connections" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter
          id="connections-ink"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.045"
            numOctaves="2"
            seed="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.15"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <marker
          id="connections-start-dot"
          viewBox="0 0 7 7"
          markerWidth="7"
          markerHeight="7"
          refX="3.5"
          refY="3.5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <circle cx="3.5" cy="3.5" r="3" fill="currentColor" />
        </marker>
        <marker
          id="connections-arrow"
          viewBox="0 0 10 10"
          markerWidth="10"
          markerHeight="10"
          refX="10"
          refY="5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
      </defs>
      {edges.map(({ from, to }) => {
        const fromNode = nodeById.get(from);
        const toNode = nodeById.get(to);
        if (!fromNode || !toNode) return null;

        const edgeKey = `${from}-${to}`;
        const measured = anchors.get(edgeKey);
        const fallback = estimateEdgeAnchors(fromNode, toNode, nodeWidth);
        const { startX, startY, endX, endY } = measured ?? fallback;
        const d = connectionPathD(startX, startY, endX, endY);

        return (
          <path
            key={`path-${from}-${to}`}
            id={`path-${from}-${to}`}
            d={d}
            className={visibleKeys.has(edgeKey) ? "visible" : undefined}
            markerStart="url(#connections-start-dot)"
            markerEnd="url(#connections-arrow)"
          />
        );
      })}
    </svg>
  );
}
