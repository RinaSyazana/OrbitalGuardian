import type { EarthMarker } from "@/components/voxel/VoxelEarth";
import { SATELLITES, DEBRIS, type Satellite, type DebrisObject } from "@/lib/mission-data";
import { riskColor, VOXEL } from "@/lib/voxel-palette";

/** Map a real altitude to a drawable orbit radius in voxel units. */
export function orbitRadius(altitudeKm: number, resolution = 11): number {
  return resolution * (1.28 + 0.42 * Math.log10(1 + altitudeKm / 260));
}

export function satelliteMarker(s: Satellite, selectedId?: string, resolution = 11): EarthMarker {
  return {
    id: s.id,
    kind: "satellite",
    color: riskColor(s.risk),
    altitude: orbitRadius(s.altitudeKm, resolution),
    tilt: s.ringTilt,
    phase: s.ringPhase,
    speed: s.speed,
    label: `${s.name} · ${s.orbit} · risk ${s.risk}%`,
    selected: selectedId === s.id,
  };
}

export function debrisMarker(d: DebrisObject, resolution = 11): EarthMarker {
  return {
    id: d.id,
    kind: "debris",
    color: VOXEL.grey,
    altitude: orbitRadius(d.altitudeKm, resolution),
    tilt: d.ringTilt,
    phase: d.ringPhase,
    speed: d.speed,
    label: `${d.name} · ${d.sizeM} m · debris`,
  };
}

export function allMarkers(selectedId?: string, resolution = 11): EarthMarker[] {
  return [
    ...SATELLITES.map((s) => satelliteMarker(s, selectedId, resolution)),
    ...DEBRIS.map((d) => debrisMarker(d, resolution)),
  ];
}
