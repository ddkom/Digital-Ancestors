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
};

export type PathwayContextBlock = {
  "resource-type": string;
  resources?: PathwayResource[];
  notes?: string;
};

/** Node definition from JSON — layout is computed unless x/y are overridden. */
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
