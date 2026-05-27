import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PathwayNode } from "../types/pathway";

const NODE_WIDTH = 360;

function getChildren(
  nodeId: string,
  nodeById: Map<string, PathwayNode>,
): string[] {
  const node = nodeById.get(nodeId);
  if (!node?.options) return [];
  return node.options.map((o) => o.target).filter(Boolean) as string[];
}

export function usePathwayMap(nodes: PathwayNode[]) {
  const nodeById = useMemo(
    () => new Map(nodes.map((n) => [n.id, n])),
    [nodes],
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const [pointX, setPointX] = useState(0);
  const [pointY, setPointY] = useState(40);
  const [scale, setScale] = useState(1);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(() => new Set());
  /** fromNodeId -> set of selected target ids */
  const [selections, setSelections] = useState<Map<string, Set<string>>>(
    () => new Map(),
  );
  const selectionsRef = useRef(selections);
  selectionsRef.current = selections;

  const initPan = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPointX(rect.width / 2 - 190);
    setPointY(40);
  }, []);

  useLayoutEffect(() => {
    initPan();
  }, [initPan]);

  const reveal = useCallback((id: string) => {
    setVisibleIds((prev) => new Set(prev).add(id));
  }, []);

  const deepCollapse = useCallback(
    (nodeId: string) => {
      const children = getChildren(nodeId, nodeById);
      children.forEach((c) => deepCollapse(c));
      setVisibleIds((prev) => {
        const next = new Set(prev);
        next.delete(nodeId);
        return next;
      });
      setSelections((prev) => {
        const next = new Map(prev);
        next.delete(nodeId);
        return next;
      });
    },
    [nodeById],
  );

  const focusNode = useCallback(
    (node: PathwayNode) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const targetX = node.x + 180;
      const targetY = node.y + 80;
      const nx = rect.width / 2 - targetX * scale;
      let ny = rect.height / 2 - targetY * scale;
      if (ny > 80) ny = 80;
      setPointX(nx);
      setPointY(ny);
    },
    [scale],
  );

  const toggleOption = useCallback(
    (fromId: string, toId: string) => {
      const wasSelected =
        selectionsRef.current.get(fromId)?.has(toId) ?? false;
      if (wasSelected) {
        setSelections((prev) => {
          const next = new Map(prev);
          const set = new Set(next.get(fromId) ?? []);
          set.delete(toId);
          if (set.size === 0) next.delete(fromId);
          else next.set(fromId, set);
          return next;
        });
        deepCollapse(toId);
      } else {
        setSelections((prev) => {
          const next = new Map(prev);
          const set = new Set(next.get(fromId) ?? []);
          set.add(toId);
          next.set(fromId, set);
          return next;
        });
        reveal(toId);
        const node = nodeById.get(toId);
        if (node) focusNode(node);
      }
    },
    [deepCollapse, reveal, focusNode, nodeById],
  );

  useEffect(() => {
    const t = window.setTimeout(() => reveal("start"), 400);
    return () => window.clearTimeout(t);
  }, [reveal]);

  const applyZoom = useCallback(
    (delta: number, cx: number, cy: number) => {
      setScale((oldScale) => {
        let next = oldScale + delta;
        if (next < 0.4) next = 0.4;
        if (next > 2.4) next = 2.4;
        setPointX((px) => cx - ((cx - px) * next) / oldScale);
        setPointY((py) => cy - ((cy - py) * next) / oldScale);
        return next;
      });
    },
    [],
  );

  const zoomByButton = useCallback(
    (delta: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      applyZoom(delta, rect.width / 2, rect.height / 2);
    },
    [applyZoom],
  );

  const resetMap = useCallback(() => {
    setSelections(new Map());
    setVisibleIds(new Set());
    setScale(1);
    initPan();
    window.setTimeout(() => reveal("start"), 200);
  }, [initPan, reveal]);

  useEffect(() => {
    const onFullscreen = () => {
      setScale((s) => {
        if (document.fullscreenElement && s < 0.9) return 0.9;
        if (!document.fullscreenElement) return 1;
        return s;
      });
    };
    document.addEventListener("fullscreenchange", onFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  const activeEdges = useMemo(() => {
    const edges: { from: string; to: string }[] = [];
    selections.forEach((targets, from) => {
      targets.forEach((to) => edges.push({ from, to }));
    });
    return edges;
  }, [selections]);

  return {
    nodeById,
    viewportRef,
    pointX,
    pointY,
    scale,
    setPointX,
    setPointY,
    visibleIds,
    toggleOption,
    isOptionSelected: (fromId: string, toId: string) =>
      selections.get(fromId)?.has(toId) ?? false,
    resetMap,
    applyZoom,
    zoomByButton,
    focusNode,
    activeEdges,
    NODE_WIDTH,
  };
}

/** Deterministic variation so edges don't stack as identical chart curves. */
function edgeSeed(fromId: string, toId: string): number {
  let h = 2166136261;
  for (const c of `${fromId}|${toId}`) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Wide, asymmetric Bézier paths — reads more like a hand-drawn flow than a straight diagram.
 */
export function connectionPathD(
  from: PathwayNode,
  to: PathwayNode,
  nodeWidth: number,
): string {
  const startX = from.x + 0.5 * nodeWidth;
  const startY = from.y + 120;
  const endX = to.x + 0.5 * nodeWidth;
  const endY = to.y;
  const dx = endX - startX;
  const dy = endY - startY;
  const s = edgeSeed(from.id, to.id);
  const t = (s % 1000) / 1000;
  const t2 = ((s >> 10) % 1000) / 1000;

  const sweepBase =
    Math.max(120, Math.abs(dx) * 0.5 + Math.abs(dy) * 0.14) * (0.85 + t * 0.35);
  const sign = dx >= 0 ? 1 : -1;
  const wobble = ((s >> 3) % 9) - 4;

  const cx1 = startX + sign * sweepBase + wobble * 10;
  const cy1 = startY + dy * (0.22 + t2 * 0.2);
  const cx2 = endX - sign * sweepBase * 0.52 + wobble * 6;
  const cy2 = endY - dy * (0.24 + t * 0.18);

  return `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
}
