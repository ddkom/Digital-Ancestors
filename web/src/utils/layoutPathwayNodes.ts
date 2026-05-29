import type { PathwayNode, PathwayNodeDef } from "../types/pathway";

export const LAYOUT_NODE_WIDTH = 360;
export const LAYOUT_H_GAP = 100;
export const LAYOUT_ROW_GAP = 500;
/** Extra vertical clearance below the tall start node (stacked option buttons). */
export const LAYOUT_START_CLEARANCE = 160;

function depthToY(depth: number): number {
  if (depth <= 0) return 0;
  return LAYOUT_ROW_GAP + LAYOUT_START_CLEARANCE + (depth - 1) * LAYOUT_ROW_GAP;
}

/** Column anchor for each top-level track branch. */
const TRACK_ANCHOR_X: Record<number, number> = {
  [-1]: -1800,
  0: 250,
  1: 1800,
};

function buildGraph(nodes: PathwayNodeDef[]) {
  const parents = new Map<string, string[]>();
  const children = new Map<string, string[]>();

  for (const node of nodes) {
    for (const opt of node.options ?? []) {
      if (!opt.target) continue;
      if (!parents.has(opt.target)) parents.set(opt.target, []);
      parents.get(opt.target)!.push(node.id);
      if (!children.has(node.id)) children.set(node.id, []);
      children.get(node.id)!.push(opt.target);
    }
  }

  return { parents, children };
}

function assignTracks(
  nodes: PathwayNodeDef[],
  parents: Map<string, string[]>,
): Map<string, number> {
  const track = new Map<string, number>();
  track.set("start", 0);

  const start = nodes.find((n) => n.id === "start");
  for (const opt of start?.options ?? []) {
    if (!opt.target) continue;
    if (opt.target.startsWith("p_")) track.set(opt.target, -1);
    else if (opt.target.startsWith("a_")) track.set(opt.target, 0);
    else track.set(opt.target, 1);
  }

  const depths = assignDepths(parents);
  const byDepth = [...depths.entries()].sort((a, b) => a[1] - b[1]);
  for (const [id] of byDepth) {
    if (track.has(id)) continue;
    const ps = parents.get(id) ?? [];
    if (ps.length === 0) {
      track.set(id, 0);
      continue;
    }
    const avg =
      ps.reduce((sum, pid) => sum + (track.get(pid) ?? 0), 0) / ps.length;
    track.set(id, Math.round(avg));
  }

  return track;
}

function assignDepths(parents: Map<string, string[]>): Map<string, number> {
  const depth = new Map<string, number>();
  depth.set("start", 0);

  let changed = true;
  while (changed) {
    changed = false;
    for (const [id, ps] of parents) {
      if (ps.length === 0) continue;
      const next = Math.max(...ps.map((p) => depth.get(p) ?? 0)) + 1;
      if ((depth.get(id) ?? -1) !== next) {
        depth.set(id, next);
        changed = true;
      }
    }
  }

  return depth;
}

function treeChildren(
  nodeId: string,
  children: Map<string, string[]>,
  parents: Map<string, string[]>,
): string[] {
  return (children.get(nodeId) ?? []).filter(
    (cid) => (parents.get(cid)?.length ?? 0) === 1,
  );
}

function layoutSubtree(
  nodeId: string,
  x: number,
  y: number,
  positions: Map<string, { x: number; y: number }>,
  children: Map<string, string[]>,
  parents: Map<string, string[]>,
  depth: Map<string, number>,
): void {
  if (!positions.has(nodeId)) {
    positions.set(nodeId, { x, y });
  }

  const kids = treeChildren(nodeId, children, parents);
  if (kids.length === 0) return;

  const nodePos = positions.get(nodeId)!;
  const unit = LAYOUT_NODE_WIDTH + LAYOUT_H_GAP;
  const totalWidth = kids.length * unit - LAYOUT_H_GAP;
  let cursor = nodePos.x + LAYOUT_NODE_WIDTH / 2 - totalWidth / 2;

  for (const cid of kids) {
    const childY = depthToY(depth.get(cid) ?? 0);
    if (positions.has(cid)) {
      layoutSubtree(
        cid,
        positions.get(cid)!.x,
        positions.get(cid)!.y,
        positions,
        children,
        parents,
        depth,
      );
    } else {
      layoutSubtree(cid, cursor, childY, positions, children, parents, depth);
      cursor += unit;
    }
  }
}

function placeMergeNodes(
  mergeIds: string[],
  positions: Map<string, { x: number; y: number }>,
  parents: Map<string, string[]>,
  depth: Map<string, number>,
): void {
  const sorted = [...mergeIds].sort(
    (a, b) => (depth.get(a) ?? 0) - (depth.get(b) ?? 0),
  );

  for (const id of sorted) {
    const ps = parents.get(id) ?? [];
    const placed = ps.filter((pid) => positions.has(pid));
    if (placed.length === 0) continue;

    const x =
      placed.reduce((sum, pid) => sum + positions.get(pid)!.x, 0) /
      placed.length;
    const y = depthToY(depth.get(id) ?? 0);
    positions.set(id, { x, y });
  }
}

/** Nudge overlapping nodes apart within each track row (same depth). */
function resolveCollisions(
  positions: Map<string, { x: number; y: number }>,
  depth: Map<string, number>,
  track: Map<string, number>,
): void {
  const byTrackDepth = new Map<string, string[]>();
  for (const [id, d] of depth) {
    if (id === "start") continue;
    const key = `${track.get(id) ?? 0}:${d}`;
    if (!byTrackDepth.has(key)) byTrackDepth.set(key, []);
    byTrackDepth.get(key)!.push(id);
  }

  const minStep = LAYOUT_NODE_WIDTH + LAYOUT_H_GAP;

  for (const ids of byTrackDepth.values()) {
    const row = ids
      .map((id) => {
        const pos = positions.get(id);
        if (!pos) return null;
        return { id, ...pos };
      })
      .filter((entry): entry is { id: string; x: number; y: number } =>
        entry !== null,
      )
      .sort((a, b) => a.x - b.x);

    for (let i = 1; i < row.length; i++) {
      const prev = row[i - 1];
      const curr = row[i];
      const overlap = prev.x + minStep - curr.x;
      if (overlap > 0) curr.x += overlap;
    }

    for (const { id, x, y } of row) {
      positions.set(id, { x, y });
    }
  }
}

/**
 * Compute `{ x, y }` for every pathway node from graph structure.
 * Optional `x`/`y` on a node def act as manual overrides.
 */
export function layoutPathwayNodes(defs: PathwayNodeDef[]): PathwayNode[] {
  const { parents, children } = buildGraph(defs);
  const depth = assignDepths(parents);
  const track = assignTracks(defs, parents);
  const positions = new Map<string, { x: number; y: number }>();

  positions.set("start", { x: 0, y: 0 });

  const startChildren = children.get("start") ?? [];
  for (const childId of startChildren) {
    const t = track.get(childId) ?? 0;
    const anchorX = TRACK_ANCHOR_X[t] ?? 0;
    const childY = depthToY(depth.get(childId) ?? 1);
    layoutSubtree(
      childId,
      anchorX,
      childY,
      positions,
      children,
      parents,
      depth,
    );
  }

  const mergeIds = [...parents.entries()]
    .filter(([, ps]) => ps.length > 1)
    .map(([id]) => id);

  const maxDepth = Math.max(0, ...depth.values());
  for (let pass = 0; pass < maxDepth; pass++) {
    placeMergeNodes(mergeIds, positions, parents, depth);
    for (const id of mergeIds) {
      const pos = positions.get(id);
      if (pos) {
        layoutSubtree(id, pos.x, pos.y, positions, children, parents, depth);
      }
    }
  }

  resolveCollisions(positions, depth, track);

  return defs.map((def) => {
    const computed = positions.get(def.id) ?? { x: 0, y: 0 };
    return {
      ...def,
      x: def.x ?? computed.x,
      y: def.y ?? computed.y,
    };
  });
}
