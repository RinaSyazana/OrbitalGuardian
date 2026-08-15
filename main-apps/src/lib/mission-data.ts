export type Satellite = {
  id: string;
  name: string;
  cospar: string;
  mission: string;
  missionType: "Earth observation" | "Communications" | "Navigation" | "Science" | "Defence";
  operator: string;
  country: string;
  orbit: string;
  regime: "LEO" | "SSO" | "MEO" | "GEO";
  altitudeKm: number;
  velocityKms: number;
  inclination: number;
  health: "nominal" | "degraded" | "critical";
  risk: number;
  propellantKg: number;
  predictionStatus: "Scored" | "Recomputing" | "Queued";
  lastPing: string;
  lastUpdated: string;
  /** rendering hints */
  ringTilt: number;
  ringPhase: number;
  speed: number;
};

export type DebrisObject = {
  id: string;
  name: string;
  origin: string;
  sizeM: number;
  altitudeKm: number;
  ringTilt: number;
  ringPhase: number;
  speed: number;
};

export const SATELLITES: Satellite[] = [
  {
    id: "og-1",
    name: "SENTINEL-6B",
    cospar: "2026-041A",
    mission: "Ocean altimetry",
    missionType: "Earth observation",
    operator: "ESA / EUMETSAT",
    country: "European Union",
    orbit: "LEO · 1336 km",
    regime: "LEO",
    altitudeKm: 1336,
    velocityKms: 7.19,
    inclination: 66.0,
    health: "nominal",
    risk: 92,
    propellantKg: 43.3,
    predictionStatus: "Scored",
    lastPing: "14:22:07 UTC",
    lastUpdated: "38 s ago",
    ringTilt: 0.42,
    ringPhase: 0.2,
    speed: 0.35,
  },
  {
    id: "og-2",
    name: "IBEX-QUANTUM",
    cospar: "2025-118C",
    mission: "Quantum key relay",
    missionType: "Communications",
    operator: "IBM Research",
    country: "United States",
    orbit: "LEO · 780 km",
    regime: "LEO",
    altitudeKm: 780,
    velocityKms: 7.47,
    inclination: 98.2,
    health: "nominal",
    risk: 46,
    propellantKg: 18.9,
    predictionStatus: "Scored",
    lastPing: "14:21:55 UTC",
    lastUpdated: "1 min ago",
    ringTilt: -0.62,
    ringPhase: 1.9,
    speed: 0.44,
  },
  {
    id: "og-3",
    name: "TERRASCAN-4",
    cospar: "2024-072B",
    mission: "Land imaging",
    missionType: "Earth observation",
    operator: "NOAA",
    country: "United States",
    orbit: "SSO · 705 km",
    regime: "SSO",
    altitudeKm: 705,
    velocityKms: 7.5,
    inclination: 98.1,
    health: "degraded",
    risk: 31,
    propellantKg: 9.4,
    predictionStatus: "Recomputing",
    lastPing: "14:20:41 UTC",
    lastUpdated: "2 min ago",
    ringTilt: 0.18,
    ringPhase: 3.4,
    speed: 0.5,
  },
  {
    id: "og-4",
    name: "HELIOS-RELAY-2",
    cospar: "2023-009A",
    mission: "Comms backbone",
    missionType: "Communications",
    operator: "Airbus DS",
    country: "France",
    orbit: "MEO · 8062 km",
    regime: "MEO",
    altitudeKm: 8062,
    velocityKms: 5.42,
    inclination: 12.4,
    health: "nominal",
    risk: 8,
    propellantKg: 61.2,
    predictionStatus: "Scored",
    lastPing: "14:22:12 UTC",
    lastUpdated: "22 s ago",
    ringTilt: -0.22,
    ringPhase: 5.1,
    speed: 0.19,
  },
  {
    id: "og-5",
    name: "AURORA-GEO-7",
    cospar: "2022-155A",
    mission: "Space weather",
    missionType: "Science",
    operator: "JAXA",
    country: "Japan",
    orbit: "GEO · 35786 km",
    regime: "GEO",
    altitudeKm: 35786,
    velocityKms: 3.07,
    inclination: 0.1,
    health: "nominal",
    risk: 4,
    propellantKg: 88.6,
    predictionStatus: "Scored",
    lastPing: "14:22:03 UTC",
    lastUpdated: "31 s ago",
    ringTilt: 0.06,
    ringPhase: 2.6,
    speed: 0.1,
  },
  {
    id: "og-6",
    name: "KESTREL-SAR-1",
    cospar: "2026-004D",
    mission: "Radar recon",
    missionType: "Defence",
    operator: "Space Force",
    country: "United States",
    orbit: "LEO · 512 km",
    regime: "LEO",
    altitudeKm: 512,
    velocityKms: 7.61,
    inclination: 53.0,
    health: "critical",
    risk: 68,
    propellantKg: 12.7,
    predictionStatus: "Queued",
    lastPing: "14:19:58 UTC",
    lastUpdated: "4 min ago",
    ringTilt: 0.74,
    ringPhase: 4.4,
    speed: 0.58,
  },
  {
    id: "og-7",
    name: "NORDLYS-2",
    cospar: "2025-063B",
    mission: "Maritime AIS",
    missionType: "Communications",
    operator: "KSAT",
    country: "Norway",
    orbit: "SSO · 598 km",
    regime: "SSO",
    altitudeKm: 598,
    velocityKms: 7.56,
    inclination: 97.7,
    health: "nominal",
    risk: 22,
    propellantKg: 6.8,
    predictionStatus: "Scored",
    lastPing: "14:21:39 UTC",
    lastUpdated: "1 min ago",
    ringTilt: -0.35,
    ringPhase: 0.7,
    speed: 0.54,
  },
  {
    id: "og-8",
    name: "GAGAN-NAV-5",
    cospar: "2024-118A",
    mission: "Regional navigation",
    missionType: "Navigation",
    operator: "ISRO",
    country: "India",
    orbit: "MEO · 20180 km",
    regime: "MEO",
    altitudeKm: 20180,
    velocityKms: 3.87,
    inclination: 55.2,
    health: "nominal",
    risk: 11,
    propellantKg: 54.1,
    predictionStatus: "Scored",
    lastPing: "14:22:10 UTC",
    lastUpdated: "27 s ago",
    ringTilt: 0.3,
    ringPhase: 3.9,
    speed: 0.16,
  },
];

export const DEBRIS: DebrisObject[] = [
  {
    id: "deb-1",
    name: "COSMOS-1408 FRAG",
    origin: "ASAT test, 2021",
    sizeM: 0.34,
    altitudeKm: 1341,
    ringTilt: 0.5,
    ringPhase: 0.9,
    speed: 0.36,
  },
  {
    id: "deb-2",
    name: "CZ-6A UPPER STAGE",
    origin: "Launch debris, 2022",
    sizeM: 2.1,
    altitudeKm: 792,
    ringTilt: -0.5,
    ringPhase: 2.7,
    speed: 0.43,
  },
  {
    id: "deb-3",
    name: "IRIDIUM-33 FRAG",
    origin: "Collision, 2009",
    sizeM: 0.11,
    altitudeKm: 690,
    ringTilt: 0.3,
    ringPhase: 4.9,
    speed: 0.47,
  },
  {
    id: "deb-4",
    name: "UNKNOWN TRACK 44912",
    origin: "Unattributed",
    sizeM: 0.08,
    altitudeKm: 520,
    ringTilt: 0.8,
    ringPhase: 1.2,
    speed: 0.56,
  },
];

export const PRIMARY_SAT_ID = "og-1";
export const PRIMARY_DEBRIS_ID = "deb-1";

export function getSatellite(id: string): Satellite {
  return SATELLITES.find((s) => s.id === id) ?? SATELLITES[0]!;
}

/** The debris track paired with each asset for conjunction screening. */
export function pairedDebris(satId: string): DebrisObject {
  const idx = SATELLITES.findIndex((s) => s.id === satId);
  return DEBRIS[Math.max(0, idx) % DEBRIS.length]!;
}

/** Baseline conjunction geometry for the hero scenario. */
export const CONJUNCTION = {
  tcaUtc: "14:47:12 UTC",
  missDistanceM: 214,
  relativeVelocityKms: 14.2,
  altitudeDeltaKm: 5,
  inclinationDeltaDeg: 4.6,
  probability: 92,
  confidence: 96,
  uncertainty: 4,
  model: "XGBoost v3.2",
  inferenceMs: 120,
  screenedPairs: 1_842_006,
};

/** Per-asset conjunction summary so every satellite has a real analysis page. */
export type ConjunctionSummary = {
  satId: string;
  debrisId: string;
  probability: number;
  confidence: number;
  missDistanceM: number;
  relativeVelocityKms: number;
  tcaUtc: string;
  inferenceMs: number;
};

export function conjunctionFor(satId: string): ConjunctionSummary {
  const sat = getSatellite(satId);
  const deb = pairedDebris(satId);
  if (satId === PRIMARY_SAT_ID) {
    return {
      satId,
      debrisId: PRIMARY_DEBRIS_ID,
      probability: CONJUNCTION.probability,
      confidence: CONJUNCTION.confidence,
      missDistanceM: CONJUNCTION.missDistanceM,
      relativeVelocityKms: CONJUNCTION.relativeVelocityKms,
      tcaUtc: CONJUNCTION.tcaUtc,
      inferenceMs: CONJUNCTION.inferenceMs,
    };
  }
  return {
    satId,
    debrisId: deb.id,
    probability: sat.risk,
    confidence: Math.round(88 + (sat.risk % 9)),
    missDistanceM: Math.round(180 + (100 - sat.risk) * 24),
    relativeVelocityKms: Math.round((9 + (sat.risk % 7)) * 10) / 10,
    tcaUtc: `1${5 + (SATELLITES.findIndex((s) => s.id === satId) % 4)}:${String(12 + (sat.risk % 40)).padStart(2, "0")}:41 UTC`,
    inferenceMs: 96 + (sat.risk % 60),
  };
}

export type ShapFactor = {
  label: string;
  plain: string;
  value: string;
  contribution: number; // 0..1 share of the prediction
  direction: "increases" | "decreases";
};

export const SHAP_FACTORS: ShapFactor[] = [
  {
    label: "Closest approach distance",
    plain: "The two objects pass extremely close together",
    value: "214 m",
    contribution: 0.41,
    direction: "increases",
  },
  {
    label: "Relative velocity",
    plain: "They meet head-on at very high speed",
    value: "14.2 km/s",
    contribution: 0.27,
    direction: "increases",
  },
  {
    label: "Altitude difference",
    plain: "Almost no vertical margin between the orbits",
    value: "5 km",
    contribution: 0.18,
    direction: "increases",
  },
  {
    label: "Inclination difference",
    plain: "The orbit planes cross at a shallow angle",
    value: "4.6°",
    contribution: 0.09,
    direction: "increases",
  },
  {
    label: "Debris tracking age",
    plain: "The debris track is recent, so its position is well known",
    value: "36 h",
    contribution: 0.05,
    direction: "decreases",
  },
];

export const SHAP_NARRATIVE =
  "SENTINEL-6B and COSMOS-1408 FRAG are on track to pass within 214 m of each other at 14:47:12 UTC, closing at 14.2 km/s. At that speed and separation there is almost no margin for error: the two orbits sit only 5 km apart vertically and cross at a shallow angle, so a small tracking error in either object puts them in the same place at the same time. Nine out of ten historical encounters with this geometry in this altitude band were later confirmed as collisions or near-misses requiring a burn.";

export const EVIDENCE_SUMMARY = [
  "3 independent radar passes over the last 36 h agree on the debris track to within 40 m.",
  "Covariance from the latest state vector is tight — position error 61 m along-track.",
  "A geomagnetic G2 storm is raising drag uncertainty, but both objects sit above 1300 km and are largely unaffected.",
  "No manoeuvre has been uplinked to SENTINEL-6B in the last 14 days, so the orbit is well characterised.",
];

export const KEY_RISK_DRIVERS = [
  { label: "Very close approach", detail: "214 m — below the 500 m action threshold", tone: "danger" as const },
  { label: "High closing speed", detail: "14.2 km/s — top decile for this regime", tone: "danger" as const },
  { label: "Thin vertical margin", detail: "Only 5 km separates the two orbits", tone: "warn" as const },
  { label: "Well-tracked debris", detail: "Recent radar fixes reduce false-alarm chance", tone: "safe" as const },
];

export const RECOMMENDATION = {
  action: "Raise Orbit",
  detail: "+12 km prograde burn, 2 revolutions before TCA",
  fuelKg: 2.1,
  newRisk: 4,
  priority: "Critical",
  window: "14:35 UTC",
  windowClosesIn: "13 min",
  deltaV: 6.4,
  confidence: 94,
  rationale:
    "Raising the orbit opens 12 km of vertical separation and shifts the along-track phase by 38°, which clears the corridor without disturbing the science ground track beyond 0.4°.",
};

export type MissionStage = {
  label: string;
  detail: string;
  time: string;
  status: "done" | "active" | "pending";
};

export const MISSION_STAGES: MissionStage[] = [
  { label: "Prediction started", detail: "SENTINEL-6B vs 2021-093 fragment", time: "14:20:11", status: "done" },
  { label: "Risk calculated", detail: "P = 92% · confidence 96%", time: "14:21:03", status: "done" },
  { label: "Recommendation generated", detail: "Raise Orbit +12 km · 2.1 kg", time: "14:22:44", status: "done" },
  { label: "Operator review", detail: "Awaiting flight-dynamics approval", time: "—", status: "active" },
  { label: "Mission completed", detail: "Uplink window 14:35 UTC", time: "—", status: "pending" },
];

export type TimelineEvent = {
  time: string;
  label: string;
  detail: string;
  tone: "info" | "warn" | "danger" | "safe";
};

export const TIMELINE: TimelineEvent[] = [
  { time: "14:22", label: "Recommendation generated", detail: "Raise Orbit · 2.1 kg", tone: "safe" },
  { time: "14:21", label: "Collision risk: HIGH", detail: "P = 92% · conf 96%", tone: "danger" },
  { time: "14:21", label: "Explanation built", detail: "5 factors ranked", tone: "info" },
  { time: "14:20", label: "Prediction started", detail: "SENTINEL-6B vs 2021-093 frag", tone: "info" },
  { time: "14:18", label: "TLE catalogue refreshed", detail: "28,411 objects ingested", tone: "info" },
  { time: "14:12", label: "KP index rose to 6", detail: "Orbital uncertainty +18%", tone: "warn" },
];

export type AlertItem = {
  id: string;
  severity: "critical" | "warning" | "info";
  satId: string;
  satellite: string;
  title: string;
  body: string;
  probability: number;
  time: string;
  timestamp: string;
  status: "Open" | "Acknowledged" | "Resolved";
  priority: "P1" | "P2" | "P3";
};

export const ALERTS: AlertItem[] = [
  {
    id: "a1",
    severity: "critical",
    satId: "og-1",
    satellite: "SENTINEL-6B",
    title: "Conjunction — SENTINEL-6B",
    body: "TCA 14:47:12 UTC · miss distance 214 m · maneuver window closes in 13 min.",
    probability: 92,
    time: "2 min ago",
    timestamp: "2026-08-02 14:21 UTC",
    status: "Open",
    priority: "P1",
  },
  {
    id: "a2",
    severity: "critical",
    satId: "og-6",
    satellite: "KESTREL-SAR-1",
    title: "KESTREL-SAR-1 attitude fault",
    body: "Reaction wheel 3 offline. Collision risk elevated to 68% pending recovery.",
    probability: 68,
    time: "9 min ago",
    timestamp: "2026-08-02 14:13 UTC",
    status: "Acknowledged",
    priority: "P1",
  },
  {
    id: "a3",
    severity: "warning",
    satId: "og-2",
    satellite: "IBEX-QUANTUM",
    title: "Screening hit — IBEX-QUANTUM",
    body: "CZ-6A upper stage crosses within 1.1 km at 16:04 UTC. Monitoring, no burn required yet.",
    probability: 46,
    time: "18 min ago",
    timestamp: "2026-08-02 14:04 UTC",
    status: "Open",
    priority: "P2",
  },
  {
    id: "a4",
    severity: "warning",
    satId: "og-3",
    satellite: "TERRASCAN-4",
    title: "Geomagnetic storm G2",
    body: "Drag model uncertainty increased for all objects below 600 km.",
    probability: 31,
    time: "24 min ago",
    timestamp: "2026-08-02 13:58 UTC",
    status: "Acknowledged",
    priority: "P2",
  },
  {
    id: "a5",
    severity: "info",
    satId: "og-4",
    satellite: "HELIOS-RELAY-2",
    title: "Model retrain complete",
    body: "XGBoost v3.2 promoted · accuracy 96.4% on 2026-Q2 holdout.",
    probability: 8,
    time: "1 h ago",
    timestamp: "2026-08-02 13:21 UTC",
    status: "Resolved",
    priority: "P3",
  },
];

export const SPACE_WEATHER = {
  solarFlux: 168,
  kpIndex: 6,
  kpLabel: "High",
  storm: "G2 — Moderate",
  solarActivity: "Elevated · M1.4 flare",
};

export const AI_HEALTH = {
  status: "Healthy",
  accuracy: 96.4,
  precision: 94.1,
  recall: 92.8,
  updated: "2 mins ago",
  latencyMs: 120,
  lastPrediction: "14:22:44 UTC",
  predictionsToday: 1_284,
  driftScore: 0.03,
  version: "XGBoost v3.2",
};

export const SYSTEM_STATUS = [
  { label: "TLE ingest", value: "Nominal", tone: "safe" as const },
  { label: "Screening engine", value: "Nominal", tone: "safe" as const },
  { label: "Model serving", value: "Nominal", tone: "safe" as const },
  { label: "Ground uplink", value: "Degraded", tone: "warn" as const },
];

export const KPIS = [
  { label: "Active satellites", value: "1,284", trend: "+12 / 24h", tone: "info" as const },
  { label: "Tracked debris", value: "28,411", trend: "+341 / 24h", tone: "warn" as const },
  { label: "High-risk events", value: "3", trend: "1 critical · P1", tone: "danger" as const },
  { label: "Predictions today", value: "1,284", trend: "avg 0.12 s", tone: "info" as const },
  { label: "AI model status", value: "Healthy", trend: "XGBoost v3.2 · 96.4%", tone: "safe" as const },
  { label: "Avg collision risk", value: "35%", trend: "−4 pts / 24h", tone: "warn" as const },
];

export type Scenario = {
  id: string;
  name: string;
  action: string;
  deltaAltKm: number;
  risk: number;
  fuelKg: number;
  executionMin: number;
  confidence: number;
  score: number;
};

/**
 * Mock "AI" risk model: risk decays as the operator opens vertical separation
 * between the satellite and the debris track. Not physics — but it responds
 * believably and monotonically to operator input.
 */
export function predictRisk(deltaAltKm: number): number {
  const move = Math.abs(deltaAltKm);
  if (move < 0.05) return CONJUNCTION.probability;
  // Any altitude change opens vertical separation AND shifts the along-track
  // phase, so risk decays quickly; lowering re-enters a denser debris band.
  const decay = Math.exp(-Math.pow(move / 6.3, 1.25));
  const penalty = deltaAltKm < 0 ? 1.18 : 1;
  return Math.max(1.2, Math.min(97, CONJUNCTION.probability * decay * penalty));
}

/** Vertical separation at TCA, in metres, for the given trim. */
export function separationM(deltaAltKm: number): number {
  return (CONJUNCTION.altitudeDeltaKm + Math.abs(deltaAltKm)) * 1000;
}

export function estimateFuel(deltaAltKm: number): number {
  return Math.abs(deltaAltKm) * 0.175 + (deltaAltKm === 0 ? 0 : 0.28);
}

export function estimateDeltaV(deltaAltKm: number): number {
  return Math.abs(deltaAltKm) * 0.53;
}

/** Burn duration + settling time, in minutes. */
export function estimateExecutionMin(deltaAltKm: number): number {
  const move = Math.abs(deltaAltKm);
  if (move < 0.05) return 0;
  return Math.round((4.5 + move * 0.62) * 10) / 10;
}

/** Model confidence in the re-scored risk: falls off for very large trims. */
export function scenarioConfidence(deltaAltKm: number): number {
  const move = Math.abs(deltaAltKm);
  return Math.round(Math.max(71, 96 - move * 0.55 - (deltaAltKm < 0 ? 4 : 0)));
}

/**
 * Mission score blends residual safety, propellant economy and how quickly the
 * burn can be executed inside the window — the number an operator ranks on.
 */
export function missionScore(deltaAltKm: number): number {
  const risk = predictRisk(deltaAltKm);
  const safety = (100 - risk) * 0.68;
  const economy = Math.max(0, 22 - estimateFuel(deltaAltKm) * 3.4);
  const speed = Math.max(0, 10 - estimateExecutionMin(deltaAltKm) * 0.22);
  return Math.round(Math.max(4, Math.min(99, safety + economy + speed)));
}

export function scenarioFrom(id: string, name: string, deltaAltKm: number): Scenario {
  const label =
    Math.abs(deltaAltKm) < 0.05
      ? "No action"
      : `${deltaAltKm > 0 ? "Raise" : "Lower"} Orbit ${deltaAltKm > 0 ? "+" : "−"}${Math.abs(deltaAltKm).toFixed(1)} km`;
  return {
    id,
    name,
    action: label,
    deltaAltKm,
    risk: predictRisk(deltaAltKm),
    fuelKg: estimateFuel(deltaAltKm),
    executionMin: estimateExecutionMin(deltaAltKm),
    confidence: scenarioConfidence(deltaAltKm),
    score: missionScore(deltaAltKm),
  };
}

export type MissionRecord = {
  id: string;
  satellite: string;
  satId: string;
  mission: string;
  date: string;
  operator: string;
  risk: number;
  finalRisk: number;
  confidence: number;
  action: string;
  fuelKg: number;
  outcome: "Avoided" | "No action required" | "Monitoring";
  status: "Closed" | "Open" | "Under review";
  narrative: string;
  steps: { label: string; detail: string; time: string }[];
};

export const MISSION_HISTORY: MissionRecord[] = [
  {
    id: "m-2041",
    satellite: "TERRASCAN-4",
    satId: "og-3",
    mission: "Land imaging",
    date: "2026-07-28 09:14 UTC",
    operator: "A. Kovács · Flight Dynamics",
    risk: 74,
    finalRisk: 6,
    confidence: 95,
    action: "Raise Orbit +9 km",
    fuelKg: 1.7,
    outcome: "Avoided",
    status: "Closed",
    narrative:
      "Debris fragment from a 2022 upper stage crossed within 380 m. The model attributed 44% of the risk to relative velocity; a prograde burn two revolutions early cleared the corridor with 1.7 kg of propellant.",
    steps: [
      { label: "Prediction started", detail: "Screening hit at 380 m", time: "09:02" },
      { label: "Risk calculated", detail: "P = 74% · confidence 95%", time: "09:04" },
      { label: "Recommendation generated", detail: "Raise Orbit +9 km · 1.7 kg", time: "09:06" },
      { label: "Operator approved", detail: "A. Kovács · dual sign-off", time: "09:11" },
      { label: "Maneuver executed", detail: "Residual risk 6%", time: "09:14" },
    ],
  },
  {
    id: "m-2038",
    satellite: "IBEX-QUANTUM",
    satId: "og-2",
    mission: "Quantum key relay",
    date: "2026-07-21 22:03 UTC",
    operator: "M. Osei · Ops Duty",
    risk: 38,
    finalRisk: 38,
    confidence: 89,
    action: "No action",
    fuelKg: 0,
    outcome: "No action required",
    status: "Closed",
    narrative:
      "Risk fell below the 40% commit threshold after an updated state vector reduced covariance. The operator logged a monitoring-only decision and preserved the full propellant budget.",
    steps: [
      { label: "Prediction started", detail: "Screening hit at 1.4 km", time: "21:48" },
      { label: "Risk calculated", detail: "P = 38% · confidence 89%", time: "21:51" },
      { label: "Recommendation generated", detail: "Monitor — below threshold", time: "21:53" },
      { label: "Operator reviewed", detail: "M. Osei · no burn", time: "22:03" },
    ],
  },
  {
    id: "m-2033",
    satellite: "KESTREL-SAR-1",
    satId: "og-6",
    mission: "Radar recon",
    date: "2026-07-14 04:47 UTC",
    operator: "A. Kovács · Flight Dynamics",
    risk: 88,
    finalRisk: 11,
    confidence: 97,
    action: "Lower Orbit −7 km",
    fuelKg: 1.4,
    outcome: "Avoided",
    status: "Closed",
    narrative:
      "Two candidate maneuvers were simulated in the sandbox. The lower-orbit option was committed because it preserved 0.6 kg of propellant for the station-keeping budget while still clearing the corridor.",
    steps: [
      { label: "Prediction started", detail: "Screening hit at 240 m", time: "04:19" },
      { label: "Risk calculated", detail: "P = 88% · confidence 97%", time: "04:22" },
      { label: "Scenarios compared", detail: "3 candidates in sandbox", time: "04:31" },
      { label: "Operator approved", detail: "Lower Orbit −7 km", time: "04:40" },
      { label: "Maneuver executed", detail: "Residual risk 11%", time: "04:47" },
    ],
  },
  {
    id: "m-2029",
    satellite: "HELIOS-RELAY-2",
    satId: "og-4",
    mission: "Comms backbone",
    date: "2026-07-02 17:31 UTC",
    operator: "L. Dubois · Constellation Ops",
    risk: 52,
    finalRisk: 19,
    confidence: 91,
    action: "Phase shift 40°",
    fuelKg: 0.9,
    outcome: "Monitoring",
    status: "Under review",
    narrative:
      "In-plane phasing was preferred over an altitude change to protect the relay's ground-track schedule. The conjunction remains under watch pending the next radar pass.",
    steps: [
      { label: "Prediction started", detail: "Screening hit at 620 m", time: "17:02" },
      { label: "Risk calculated", detail: "P = 52% · confidence 91%", time: "17:06" },
      { label: "Recommendation generated", detail: "Phase shift 40° · 0.9 kg", time: "17:12" },
      { label: "Operator approved", detail: "L. Dubois · phasing only", time: "17:26" },
      { label: "Maneuver executed", detail: "Residual risk 19% · monitoring", time: "17:31" },
    ],
  },
];

/* ---------------- About page content ---------------- */

export const ARCHITECTURE_STEPS = [
  { step: "01", label: "Catalogue ingest", detail: "Space-Track GP/TLE feed, 28,411 objects, refreshed every 6 h." },
  { step: "02", label: "Conjunction screening", detail: "Pairwise sieve over 1.84 M candidate pairs per cycle." },
  { step: "03", label: "Feature builder", detail: "41 features: geometry, covariance, drag, debris provenance." },
  { step: "04", label: "Risk model", detail: "Gradient-boosted classifier scores every screened pair." },
  { step: "05", label: "Explanation service", detail: "SHAP attributions plus a plain-language operator summary." },
  { step: "06", label: "Maneuver planner", detail: "Altitude, phasing and Δv candidates, re-scored on operator input." },
  { step: "07", label: "Human approval", detail: "Dual sign-off, then an uplink package for the ground segment." },
];

export const TECH_STACK = [
  { group: "Frontend", items: ["React 19", "TanStack Start", "Tailwind CSS v4", "Custom canvas voxel renderer"] },
  { group: "Modelling", items: ["XGBoost v3.2", "SHAP attributions", "Scikit-learn feature pipeline"] },
  { group: "IBM platform", items: ["watsonx.ai model serving", "watsonx.governance audit", "IBM Cloud Object Storage"] },
  { group: "Data", items: ["Space-Track GP catalogue", "ESA DISCOS", "NOAA SWPC indices"] },
];

export const DATASETS = [
  { name: "Space-Track GP catalogue", detail: "28,411 objects · TLE epoch 2026-08-02", license: "Public, US Space Force" },
  { name: "ESA DISCOS", detail: "Debris size, mass and provenance characteristics", license: "ESA research licence" },
  { name: "NOAA SWPC indices", detail: "KP index, F10.7 solar flux, storm scale", license: "Public domain" },
  { name: "Historic CDM archive", detail: "18,402 labelled conjunctions, 2015–2026", license: "Synthetic for this demo" },
];

export const REFERENCES = [
  "Alfano, S. — “Review of Conjunction Probability Methods for Short-term Encounters.”",
  "Lundberg & Lee — “A Unified Approach to Interpreting Model Predictions” (SHAP), NeurIPS 2017.",
  "ESA Space Debris Office — Annual Space Environment Report, 2025.",
  "Kessler & Cour-Palais — “Collision Frequency of Artificial Satellites,” JGR 1978.",
  "NASA CARA — Conjunction Assessment Risk Analysis operator handbook.",
];

export const TEAM = [
  { name: "A. Kovács", role: "Flight dynamics & product", focus: "Operator workflow, maneuver planning" },
  { name: "M. Osei", role: "ML engineering", focus: "Risk model, SHAP explanation service" },
  { name: "L. Dubois", role: "Frontend & visualisation", focus: "Voxel renderer, mission console" },
  { name: "R. Iyer", role: "Data engineering", focus: "Catalogue ingest, screening pipeline" },
];
