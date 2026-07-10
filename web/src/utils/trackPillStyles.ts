import type { ShaderPalette } from "../components/ShaderBackground";

export function hexToRgba(hex: string, alpha: number): string {
  const trimmed = hex.trim().replace(/^#/, "");
  const expanded =
    trimmed.length === 3
      ? trimmed
          .split("")
          .map((c) => c + c)
          .join("")
      : trimmed;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return `rgba(0,0,0,${alpha})`;
  const n = parseInt(expanded, 16);
  return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${alpha})`;
}

export function trackPillStylesFromPalette(palette: ShaderPalette) {
  const colors = [palette.deep, palette.highlight, palette.accent];
  return colors.map((color) => ({
    pillStyle: {
      background: hexToRgba(color, 0.08),
      border: `1px solid ${color}`,
    },
  }));
}

export const TRACK_PILL_INDEX = {
  protect: 0,
  admin: 1,
  create: 2,
} as const;
