import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

function edgeKey(from: string, to: string) {
  return `${from}-${to}`;
}

export function ConnectionLayer({
  edges,
  nodeById,
  nodeWidth,
  layoutEpoch,
}: Props) {
  const drawnKeys = useRef(new Set<string>());
  const [animatingKeys, setAnimatingKeys] = useState<Set<string>>(new Set());
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
    const keys = new Set(edges.map((e) => edgeKey(e.from, e.to)));
    for (const key of [...drawnKeys.current]) {
      if (!keys.has(key)) drawnKeys.current.delete(key);
    }

    const newcomers = [...keys].filter((key) => !drawnKeys.current.has(key));
    setAnimatingKeys((prev) => {
      const next = new Set<string>();
      for (const key of prev) {
        if (keys.has(key) && !drawnKeys.current.has(key)) next.add(key);
      }
      return next;
    });

    if (newcomers.length === 0) return;

    const id = requestAnimationFrame(() => {
      setAnimatingKeys((prev) => {
        const next = new Set(prev);
        newcomers.forEach((key) => next.add(key));
        return next;
      });
    });
    return () => cancelAnimationFrame(id);
  }, [edges]);

  const markDrawn = (key: string) => {
    drawnKeys.current.add(key);
    setAnimatingKeys((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  return (
    <svg id="connections" xmlns="http://www.w3.org/2000/svg">
      <defs>
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
          refX="9"
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

        const key = edgeKey(from, to);
        const measured = anchors.get(key);
        const fallback = estimateEdgeAnchors(fromNode, toNode, nodeWidth);
        const { startX, startY, endX, endY } = measured ?? fallback;
        const d = connectionPathD(startX, startY, endX, endY);
        const isDrawing = animatingKeys.has(key);
        const isVisible = isDrawing || drawnKeys.current.has(key);

        return (
          <path
            key={`path-${from}-${to}`}
            id={`path-${from}-${to}`}
            d={d}
            pathLength={1}
            className={[isVisible ? "visible" : "", isDrawing ? "is-drawing" : ""]
              .filter(Boolean)
              .join(" ") || undefined}
            markerStart="url(#connections-start-dot)"
            markerEnd="url(#connections-arrow)"
            onAnimationEnd={() => markDrawn(key)}
          />
        );
      })}
    </svg>
  );
}
