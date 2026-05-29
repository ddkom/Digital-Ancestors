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
const MIN_SCALE = 0.15;
const MAX_SCALE = 2.4;

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
        if (next < MIN_SCALE) next = MIN_SCALE;
        if (next > MAX_SCALE) next = MAX_SCALE;
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
        if (document.fullscreenElement && s < MIN_SCALE) return MIN_SCALE;
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

export const CONNECTION_CORNER_RADIUS = 80;
/** Vertical run below the button center before the first turn. */
export const CONNECTION_STEM_DOWN = 52;

/** Fallback when the option button is not yet in the DOM. */
export function estimateEdgeAnchors(
  from: PathwayNode,
  to: PathwayNode,
  nodeWidth: number,
): { startX: number; startY: number; endX: number; endY: number } {
  const options = from.options ?? [];
  const idx = Math.max(0, options.findIndex((o) => o.target === to.id));
  const count = Math.max(1, options.length);
  const btnWidth = 132;
  const gap = 8;
  const rowWidth = count * btnWidth + (count - 1) * gap;
  const cardHeight = 200;
  const btnHeight = 34;
  return {
    startX:
      from.x +
      nodeWidth / 2 -
      rowWidth / 2 +
      idx * (btnWidth + gap) +
      btnWidth / 2,
    startY: from.y + cardHeight + btnHeight / 2,
    endX: to.x + nodeWidth / 2,
    endY: to.y,
  };
}

/**
 * Orthogonal connector: button center → down → across → down to target top.
 * Corners use exterior fillets (arcs bulge outside the L, not into the corner).
 */
export function connectionPathD(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  cornerRadius = CONNECTION_CORNER_RADIUS,
): string {
  const dx = endX - startX;
  const sx = Math.sign(dx) || 1;

  let routeY = startY + CONNECTION_STEM_DOWN;
  if (endY >= startY) {
    routeY = Math.min(routeY, endY - cornerRadius * 1.1);
    routeY = Math.max(routeY, startY + 12);
  } else {
    routeY = startY - CONNECTION_STEM_DOWN;
    routeY = Math.max(routeY, endY + cornerRadius * 1.1);
    routeY = Math.min(routeY, startY - 12);
  }

  const dy1 = routeY - startY;
  const dy2 = endY - routeY;

  let r = Math.min(cornerRadius, Math.abs(dx) / 2, Math.abs(dy1), Math.abs(dy2));
  if (r < 2) {
    return `M ${startX} ${startY} L ${startX} ${routeY} L ${endX} ${routeY} L ${endX} ${endY}`;
  }

  const sy1 = Math.sign(dy1) || 1;
  const sy2 = Math.sign(dy2) || 1;

  const cross1 = -sy1 * sx;
  const cross2 = sx * sy2;
  const sweep1 = cross1 > 0 ? 1 : 0;
  const sweep2 = cross2 > 0 ? 1 : 0;

  return [
    `M ${startX} ${startY}`,
    `L ${startX} ${routeY - sy1 * r}`,
    `A ${r} ${r} 0 0 ${sweep1} ${startX + sx * r} ${routeY}`,
    `L ${endX - sx * r} ${routeY}`,
    `A ${r} ${r} 0 0 ${sweep2} ${endX} ${routeY + sy2 * r}`,
    `L ${endX} ${endY}`,
  ].join(" ");
}
