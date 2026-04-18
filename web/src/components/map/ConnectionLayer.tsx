import { useEffect, useState } from "react";
import type { PathwayNode } from "../../types/pathway";
import { connectionPathD } from "../../hooks/usePathwayMap";

type Edge = { from: string; to: string };

type Props = {
  edges: Edge[];
  nodeById: Map<string, PathwayNode>;
  nodeWidth: number;
};

export function ConnectionLayer({ edges, nodeById, nodeWidth }: Props) {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const keys = new Set(edges.map((e) => `${e.from}-${e.to}`));
    setVisibleKeys(new Set());
    const id = requestAnimationFrame(() => {
      setVisibleKeys(keys);
    });
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
          id="connections-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
        </marker>
      </defs>
      {edges.map(({ from, to }) => {
        const a = nodeById.get(from);
        const b = nodeById.get(to);
        if (!a || !b) return null;
        const pathId = `path-${from}-${to}`;
        const visible = visibleKeys.has(`${from}-${to}`);
        return (
          <path
            key={pathId}
            id={pathId}
            d={connectionPathD(a, b, nodeWidth)}
            className={visible ? "visible" : undefined}
            markerEnd="url(#connections-arrow)"
          />
        );
      })}
    </svg>
  );
}
