import type {
  PathwayContextBlock,
  PathwayNodeDef,
  PathwayResource,
} from "../types/pathway";

export type PathwayTrack = "protect" | "admin" | "create";

export type ResourceBlock = {
  category: string;
  notes?: string;
  resources: PathwayResource[];
};

export type PathwayResourceGroup = {
  nodeId: string;
  track: PathwayTrack;
  nodeTag?: string;
  nodeTitle: string;
  nodeDesc: string;
  blocks: ResourceBlock[];
};

export type TrackResourceSection = {
  track: PathwayTrack;
  groups: PathwayResourceGroup[];
};

const TRACK_ORDER: PathwayTrack[] = ["protect", "admin", "create"];

function normalizeContext(
  context: PathwayNodeDef["context"],
): PathwayContextBlock[] {
  if (!context) return [];
  return Array.isArray(context) ? context : [context];
}

export function getNodeTrack(node: PathwayNodeDef): PathwayTrack | null {
  switch (node.type) {
    case "track-protect":
      return "protect";
    case "track-admin":
      return "admin";
    case "track-create":
      return "create";
    case "end":
    case "warning":
      if (node.id.startsWith("p_")) return "protect";
      if (node.id.startsWith("a_")) return "admin";
      if (node.id.startsWith("c_")) return "create";
      return null;
    default:
      return null;
  }
}

export function extractResourceGroups(
  nodes: PathwayNodeDef[],
): PathwayResourceGroup[] {
  return nodes.flatMap((node) => {
    const track = getNodeTrack(node);
    if (!track || !node.context) return [];

    const blocks = normalizeContext(node.context)
      .filter((block) => block.resources?.length)
      .map((block) => ({
        category: block["resource-type"],
        notes: block.notes,
        resources: block.resources ?? [],
      }));

    if (!blocks.length) return [];

    return [
      {
        nodeId: node.id,
        track,
        nodeTag: node.tag,
        nodeTitle: node.title,
        nodeDesc: node.desc,
        blocks,
      },
    ];
  });
}

export function extractResourceGroupsByTrack(
  nodes: PathwayNodeDef[],
): TrackResourceSection[] {
  const groups = extractResourceGroups(nodes);
  const byTrack = new Map<PathwayTrack, PathwayResourceGroup[]>();

  for (const track of TRACK_ORDER) {
    byTrack.set(track, []);
  }

  for (const group of groups) {
    byTrack.get(group.track)?.push(group);
  }

  return TRACK_ORDER.map((track) => ({
    track,
    groups: byTrack.get(track) ?? [],
  })).filter((section) => section.groups.length > 0);
}

export function countResources(groups: PathwayResourceGroup[]): number {
  return groups.reduce(
    (sum, group) =>
      sum +
      group.blocks.reduce((blockSum, block) => blockSum + block.resources.length, 0),
    0,
  );
}
