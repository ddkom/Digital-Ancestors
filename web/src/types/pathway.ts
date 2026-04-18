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

export type PathwayNode = {
  id: string;
  type: PathwayNodeType;
  x: number;
  y: number;
  tag?: string;
  title: string;
  desc: string;
  context?: string;
  options?: PathwayOption[];
};
