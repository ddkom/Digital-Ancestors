import en from "./en.json";

export const copy = en;

export type Copy = typeof copy;

/** Resolve a dot-separated path into a string from the locale copy. */
export function t(path: string): string {
  const value = path.split(".").reduce<unknown>((obj, key) => {
    if (obj && typeof obj === "object" && key in obj) {
      return (obj as Record<string, unknown>)[key];
    }
    return undefined;
  }, copy);

  if (typeof value !== "string") {
    throw new Error(`Missing locale string: ${path}`);
  }
  return value;
}
