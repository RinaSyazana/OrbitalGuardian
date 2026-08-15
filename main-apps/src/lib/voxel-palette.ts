// Raw hex palette — required for canvas rendering, mirrors the CSS design tokens.
export const VOXEL = {
  space0: "#05060F",
  space1: "#0B0F2A",
  cyan: "#22D3EE",
  amber: "#F59E0B",
  red: "#EF4444",
  green: "#4ADE80",
  panel: "#12172E",
  panelRaised: "#1A2140",
  ocean: "#1E5FA8",
  oceanDeep: "#17497F",
  oceanLight: "#2E7FD1",
  land: "#4C8C3A",
  landDry: "#8A6E45",
  landHigh: "#5FA347",
  ice: "#F1F5F9",
  cloud: "#DCE7F5",
  grey: "#94A3B8",
} as const;

export type RiskLevel = "low" | "medium" | "high";

export function riskLevel(risk: number): RiskLevel {
  if (risk >= 60) return "high";
  if (risk >= 25) return "medium";
  return "low";
}

export function riskColor(risk: number): string {
  const l = riskLevel(risk);
  return l === "high" ? VOXEL.red : l === "medium" ? VOXEL.amber : VOXEL.green;
}
