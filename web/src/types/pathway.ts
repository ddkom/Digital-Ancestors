export type PathwayNodeType =
  | "start"
  | "track-protect"
  | "track-admin"
  | "track-create"
  | "warning"
  | "end";

export type PathwayOption = {
  label: string;
  target?: string;
};

export type PathwayResource = {
  name: string;
  link: string;
  title?: string;
  desc?: string;
};

export type PathwayContextBlock = {
  "resource-type": string;
  resources?: PathwayResource[];
  notes?: string;
};

/** Node definition from JSON — x is a column override; y is always computed from LAYOUT_ROW_GAP. */
export type PathwayNodeDef = {
  id: string;
  type: PathwayNodeType;
  x?: number;
  y?: number;
  tag?: string;
  title: string;
  desc: string;
  context?: PathwayContextBlock | PathwayContextBlock[];
  options?: PathwayOption[];
};

export type PathwayNode = PathwayNodeDef & {
  x: number;
  y: number;
};
