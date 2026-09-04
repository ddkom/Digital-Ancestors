import type { PathwayNode } from "../../types/pathway";
import {
  CONNECTION_END_INSET,
  estimateEdgeAnchors,
} from "../../hooks/usePathwayMap";

type Edge = { from: string; to: string };

export type EdgeAnchor = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

/** Map a screen rect into coordinates local to `container` (handles CSS transform). */
function localPoint(
  rect: DOMRect,
  container: HTMLElement,
  originX: number,
  originY: number,
  point: "center" | "top-center",
): { x: number; y: number } {
  const cRect = container.getBoundingClientRect();
  const scale =
    container.offsetWidth > 0 ? cRect.width / container.offsetWidth : 1;
  const x = originX + (rect.left + rect.width / 2 - cRect.left) / scale;
  const y =
    point === "center"
      ? originY + (rect.top + rect.height / 2 - cRect.top) / scale
      : originY + (rect.top - cRect.top) / scale;
  return { x, y };
}

export function measureEdgeAnchors(
  edges: Edge[],
  nodeById: Map<string, PathwayNode>,
  nodeWidth: number,
): Map<string, EdgeAnchor> {
  const anchors = new Map<string, EdgeAnchor>();

  for (const { from, to } of edges) {
    const key = `${from}-${to}`;
    const fromNode = nodeById.get(from);
    const toNode = nodeById.get(to);
    if (!fromNode || !toNode) continue;

    const fromEl = document.getElementById(from);
    const toEl = document.getElementById(to);
    const fromCard = fromEl?.querySelector<HTMLElement>(".node-card");
    const btn = fromCard?.querySelector<HTMLElement>(
      `.opt-btn[data-target="${CSS.escape(to)}"]`,
    );
    const toCard = toEl?.querySelector<HTMLElement>(".node-card");

    if (fromEl && btn) {
      const start = localPoint(
        btn.getBoundingClientRect(),
        fromEl,
        fromNode.x,
        fromNode.y,
        "center",
      );
      let endX = toNode.x + nodeWidth / 2;
      let endY = toNode.y + CONNECTION_END_INSET;
      if (toEl && toCard) {
        const end = localPoint(
          toCard.getBoundingClientRect(),
          toEl,
          toNode.x,
          toNode.y,
          "top-center",
        );
        endX = end.x;
        endY = end.y + CONNECTION_END_INSET;
      }
      anchors.set(key, { startX: start.x, startY: start.y, endX, endY });
    } else {
      anchors.set(key, estimateEdgeAnchors(fromNode, toNode, nodeWidth));
    }
  }

  return anchors;
}
