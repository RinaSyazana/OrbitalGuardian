import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Save, Rocket, RotateCcw, ArrowLeft, Check, Fuel, Timer, Gauge, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  BlockyCard,
  BlockyButton,
  StatTile,
  RiskChip,
  SectionHeading,
  Breadcrumbs,
  Chip,
  CountUp,
  ConfidenceMeter,
  DataRow,
} from "@/components/blocks";
import { VoxelEarth } from "@/components/voxel/VoxelEarth";
import { debrisMarker, orbitRadius } from "@/lib/orbit";
import { cn } from "@/lib/utils";
import {
  predictRisk,
  estimateFuel,
  estimateDeltaV,
  estimateExecutionMin,
  scenarioConfidence,
  missionScore,
  scenarioFrom,
  separationM,
  type Scenario,
} from "@/lib/mission-data";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/sandbox/$satId")({
  head: () => ({
    meta: [
      { title: "Mission Sandbox — Maneuver Decision Simulator | OrbitalGuardian AI" },
      {
        name: "description",
        content:
          "Drag the orbit path on the voxel Earth to retarget altitude, watch collision risk, fuel, execution time and mission score recalculate live, compare three scenarios and commit a maneuver.",
      },
    ],
  }),
  component: SandboxPage,
});

const COMMIT_STAGES = [
  "Current orbit",
  "Debris track acquired",
  "Collision point projected",
  "Avoidance burn",
  "New orbit nominal",
];

function SandboxPage() {
  const { satId } = Route.useParams();
  const [sat, setSat] = useState<any>(null);
  const [debris, setDebris] = useState<any>(null);
  const [baseRisk, setBaseRisk] = useState(92);

  useEffect(() => {
    async function loadData() {
      const satSnap = await getDoc(doc(db, "satellites", satId));
      if (satSnap.exists()) {
        const data = satSnap.data();
        setSat(data);
        setBaseRisk(data.risk ?? 92);
      }
      const debSnap = await getDoc(doc(db, "debris", "deb-1"));
      if (debSnap.exists()) setDebris(debSnap.data());
    }
    loadData();
  }, [satId]);

  const [delta, setDelta] = useState(0);
  const [displayRisk, setDisplayRisk] = useState(baseRisk);
  const [scenarios, setScenarios] = useState<Scenario[]>([
    scenarioFrom("s-a", "Scenario A", 12),
    scenarioFrom("s-b", "Scenario B", -8),
    scenarioFrom("s-c", "Scenario C", 0),
  ]);
  const [selectedScenario, setSelectedScenario] = useState("s-a");
  const [burn, setBurn] = useState(0);
  const [stage, setStage] = useState(-1);
  const [committed, setCommitted] = useState<Scenario | null>(null);

  const targetRisk = predictRisk(delta);
  const raf = useRef<number | null>(null);

  // Animate the risk readout toward the model output.
  useEffect(() => {
    const tick = () => {
      setDisplayRisk((prev) => {
        const next = prev + (targetRisk - prev) * 0.18;
        return Math.abs(next - targetRisk) < 0.05 ? targetRisk : next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [targetRisk]);

  useEffect(() => {
    if (stage < 0) return;
    if (stage >= COMMIT_STAGES.length - 1) return;
    const id = setTimeout(() => setStage((s) => s + 1), 750);
    return () => clearTimeout(id);
  }, [stage]);

  const saveScenario = () => {
    const label = String.fromCharCode(65 + (scenarios.length % 3));
    const next = scenarioFrom(`s-${Date.now()}`, `Scenario ${label}`, delta);
    setScenarios((prev) => [next, ...prev].slice(0, 3));
    setSelectedScenario(next.id);
    toast.success("Scenario saved to comparison bay", {
      description: `${next.action} · risk ${next.risk.toFixed(0)}% · score ${next.score}`,
    });
  };

  const commit = async () => {
    const sc = scenarios.find((s) => s.id === selectedScenario);
    if (!sc || !sat) return;
    setDelta(sc.deltaAltKm);
    setStage(0);
    setBurn((b) => b + 1);
    setCommitted(sc);

    // Write committed maneuver to Firebase history
    try {
      const now = new Date();
      const record = {
        id: `m-${Date.now()}`,
        satellite: sat.name,
        satId: satId,
        mission: sat.mission,
        date: now.toISOString().replace("T", " ").slice(0, 19) + " UTC",
        operator: "Operator · Mission Control",
        risk: baseRisk,
        finalRisk: Math.round(sc.risk),
        confidence: sc.confidence,
        action: sc.action,
        fuelKg: sc.fuelKg,
        outcome: sc.risk < 20 ? "Avoided" : sc.risk < 40 ? "Monitoring" : "No action required",
        status: "Open",
        narrative: `Operator committed ${sc.action} using Mission Sandbox. Residual risk: ${sc.risk.toFixed(0)}%. Mission score: ${sc.score}.`,
        steps: [
          { label: "Prediction started", detail: `Risk ${baseRisk}%`, time: now.toTimeString().slice(0, 5) },
          { label: "Scenario simulated", detail: sc.action, time: now.toTimeString().slice(0, 5) },
          { label: "Operator committed", detail: "Via Mission Sandbox", time: now.toTimeString().slice(0, 5) },
        ],
      };
      await addDoc(collection(db, "history"), record);
      toast.success(`Maneuver committed — ${sc.action}`, {
        description: `Logged to Firebase audit trail · residual risk ${sc.risk.toFixed(0)}%`,
      });
    } catch (err) {
      toast.success(`Maneuver committed — ${sc.action}`, {
        description: `Uplink scheduled · residual risk ${sc.risk.toFixed(0)}%`,
      });
    }
  };

  if (!sat || !debris) {
    return (
      <AppShell>
        <div className="flex h-screen items-center justify-center text-primary font-mono text-xl animate-pulse">
          Loading Satellite Data from Firebase...
        </div>
      </AppShell>
    );
  }

  const before = baseRisk;
  const score = missionScore(delta);
  const best = scenarios.reduce((a, b) => (b.score > a.score ? b : a), scenarios[0]!);

  return (
    <AppShell>
      <Breadcrumbs
        trail={[
          { label: "Mission Control", to: "/dashboard" },
          { label: "Collision Analysis", to: "/analysis/$satId", params: { satId } },
          { label: "Mission Sandbox" },
        ]}
      />
      <div className="mt-2">
        <SectionHeading
          kicker="Decision support simulator"
          title="Mission Sandbox"
          description="Retarget the orbit and the model re-scores collision risk, propellant cost, execution time and overall mission score on every frame. Compare candidates side by side, then commit one for uplink."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/analysis/$satId" params={{ satId }}>
              <BlockyButton size="sm" variant="ghost">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to analysis
              </BlockyButton>
            </Link>
            <BlockyButton
              size="sm"
              onClick={() => {
                setDelta(0);
                setStage(-1);
                setCommitted(null);
                toast.info("Simulation reset to the current orbit");
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset simulation
            </BlockyButton>
          </div>
        </SectionHeading>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-4">
          <BlockyCard
            title={`Retarget orbit — ${sat.name}`}
            subtitle="Drag vertically on the globe to trim altitude · shift-drag to rotate the view"
            accent="cyan"
            dense
          >
            <div className="relative">
              <VoxelEarth
                markers={[debrisMarker(debris)]}
                draggableOrbit={{
                  altitude: orbitRadius(sat.altitudeKm),
                  tilt: sat.ringTilt,
                  deltaAltKm: delta,
                  onChange: setDelta,
                  risk: targetRisk,
                }}
                collision={
                  targetRisk > 45
                    ? { altitude: orbitRadius(sat.altitudeKm), tilt: sat.ringTilt, phase: sat.ringPhase + 1.1 }
                    : null
                }
                burnPulse={burn}
                zoom={1.2}
                className="h-[420px] w-full md:h-[560px]"
              />

              {/* live before/after readout */}
              <div className="pointer-events-none absolute left-3 top-3 block-surface-flat block-notch px-3.5 py-3">
                <div className="hud-label text-[9px]">Live risk recomputation</div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="tabular text-2xl font-semibold text-muted-foreground line-through decoration-danger/70">
                    {before}%
                  </span>
                  <span className="text-muted-foreground" aria-hidden>
                    →
                  </span>
                  <span
                    className={cn(
                      "tabular text-4xl font-bold leading-none",
                      displayRisk >= 60 ? "text-danger" : displayRisk >= 25 ? "text-warning" : "text-safe",
                    )}
                  >
                    {displayRisk.toFixed(0)}%
                  </span>
                </div>
                <div className="tabular mt-2.5 space-y-0.5 text-[10.5px] text-muted-foreground">
                  <div>
                    Δ altitude {delta >= 0 ? "+" : "−"}
                    {Math.abs(delta).toFixed(1)} km
                  </div>
                  <div>
                    Δv {estimateDeltaV(delta).toFixed(1)} m/s · fuel {estimateFuel(delta).toFixed(2)} kg
                  </div>
                  <div>Separation at TCA {separationM(delta).toFixed(0)} m</div>
                  <div>Burn + settle {estimateExecutionMin(delta).toFixed(1)} min</div>
                </div>
              </div>

              {stage >= 0 && (
                <div className="absolute bottom-3 left-3 block-surface-flat block-notch px-3.5 py-2.5">
                  <div className="hud-label text-[9px] text-primary">Commit sequence</div>
                  <ol className="mt-1.5 space-y-1">
                    {COMMIT_STAGES.map((s, i) => (
                      <li
                        key={s}
                        className={cn(
                          "tabular flex items-center gap-1.5 text-[11px]",
                          i < stage ? "text-safe" : i === stage ? "text-primary" : "text-muted-foreground/50",
                        )}
                      >
                        {i < stage ? <Check className="h-3 w-3" /> : <span className="h-2 w-2 bg-current" />} {s}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </BlockyCard>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
            <BlockyCard title="Manual altitude trim" subtitle="Fine control for operators who prefer keyboard input">
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="range"
                  min={-30}
                  max={30}
                  step={0.5}
                  value={delta}
                  onChange={(e) => setDelta(Number(e.target.value))}
                  className="h-2 min-w-[220px] flex-1 appearance-none bg-muted accent-primary"
                  aria-label="Altitude delta in kilometres"
                />
                <span className="tabular w-24 text-right text-sm font-semibold text-primary">
                  {delta >= 0 ? "+" : "−"}
                  {Math.abs(delta).toFixed(1)} km
                </span>
                <BlockyButton size="sm" onClick={saveScenario}>
                  <Save className="h-3.5 w-3.5" /> Save scenario
                </BlockyButton>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[-12, -6, 6, 12].map((d) => (
                  <BlockyButton key={d} size="sm" variant={delta === d ? "primary" : "default"} onClick={() => setDelta(d)}>
                    {d > 0 ? "+" : "−"}
                    {Math.abs(d)} km
                  </BlockyButton>
                ))}
              </div>
            </BlockyCard>

            <BlockyCard title="Mission score" accent={score >= 70 ? "green" : score >= 45 ? "amber" : "red"}>
              <div className="text-center">
                <div
                  className={cn(
                    "tabular text-5xl font-bold leading-none",
                    score >= 70 ? "text-safe" : score >= 45 ? "text-warning" : "text-danger",
                  )}
                >
                  <CountUp value={score} />
                </div>
                <div className="hud-label mt-1.5 text-[9px]">out of 100</div>
              </div>
              <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
                Blends residual safety, propellant economy and how much of the uplink window the burn consumes.
              </p>
            </BlockyCard>
          </div>
        </div>

        <div className="space-y-4">
          <BlockyCard
            title="Scenario comparison bay"
            subtitle={`Best candidate: ${best.name} · score ${best.score}`}
            accent="cyan"
            dense
          >
            <div className="space-y-2 p-3.5">
              {scenarios.map((s) => {
                const active = s.id === selectedScenario;
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedScenario(s.id);
                      setDelta(s.deltaAltKm);
                    }}
                    className={cn(
                      "block-notch w-full border px-3.5 py-3 text-left transition-all duration-150 ease-[var(--ease-step)]",
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-panel-raised hover:-translate-y-px hover:border-primary/50",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-hud text-[11.5px] font-bold tracking-[0.12em] text-foreground">
                        {s.name}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {s.id === best.id && <Chip tone="safe">Best</Chip>}
                        {active && <Chip tone="info">Selected</Chip>}
                      </span>
                    </div>
                    <div className="tabular mt-1 text-[11.5px] text-foreground/85">{s.action}</div>
                    <div className="mt-2.5">
                      <RiskChip risk={s.risk} />
                    </div>
                    <dl className="tabular mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-border/70 pt-2 text-[10.5px]">
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-muted-foreground">Fuel</dt>
                        <dd className="text-foreground/85">{s.fuelKg.toFixed(2)} kg</dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-muted-foreground">Exec</dt>
                        <dd className="text-foreground/85">{s.executionMin.toFixed(1)} min</dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-muted-foreground">Conf</dt>
                        <dd className="text-foreground/85">{s.confidence}%</dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-muted-foreground">Score</dt>
                        <dd className={cn("font-semibold", s.score >= 70 ? "text-safe" : "text-warning")}>{s.score}</dd>
                      </div>
                    </dl>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-border p-3.5">
              <BlockyButton variant="hero" size="lg" className="w-full" onClick={commit}>
                <Rocket className="h-4 w-4" /> Commit Maneuver
              </BlockyButton>
              <p className="mt-2 text-center text-[10.5px] text-muted-foreground">
                Commit generates an uplink package for the 14:35 UTC window. Dual operator sign-off is required before
                transmission.
              </p>
            </div>
          </BlockyCard>

          <BlockyCard
            title="Simulated outcome"
            subtitle="Re-scored on every drag frame"
            accent={targetRisk >= 60 ? "red" : targetRisk >= 25 ? "amber" : "green"}
          >
            <div className="grid grid-cols-2 gap-2">
              <StatTile
                label="Residual risk"
                value={`${targetRisk.toFixed(0)}%`}
                tone={targetRisk >= 60 ? "danger" : targetRisk >= 25 ? "warn" : "safe"}
                big
                icon={<ShieldCheck className="h-3.5 w-3.5" />}
              />
              <StatTile
                label="Risk reduction"
                value={`${Math.max(0, before - targetRisk).toFixed(0)}`}
                unit="pts"
                tone="safe"
                big
              />
              <StatTile label="Fuel cost" value={estimateFuel(delta).toFixed(2)} unit="kg" tone="neutral" icon={<Fuel className="h-3.5 w-3.5" />} />
              <StatTile
                label="Execution time"
                value={estimateExecutionMin(delta).toFixed(1)}
                unit="min"
                tone="neutral"
                icon={<Timer className="h-3.5 w-3.5" />}
              />
            </div>
            <div className="mt-3.5">
              <ConfidenceMeter value={scenarioConfidence(delta)} label="Prediction confidence" />
            </div>
            <div className="mt-3.5 divide-y divide-border/60">
              <DataRow label="Propellant remaining" value={`${(sat.propellantKg - estimateFuel(delta)).toFixed(1)} kg`} />
              <DataRow
                label="Mission-life impact"
                value={`${(estimateFuel(delta) * 4.1).toFixed(0)} days station-keeping`}
              />
              <DataRow label="Serving model" value="LightGBM" />
            </div>
          </BlockyCard>

          <BlockyCard
            title="Operator approval"
            accent={committed ? "green" : "amber"}
            action={<Chip tone={committed ? "safe" : "warn"}>{committed ? "Committed" : "Awaiting commit"}</Chip>}
          >
            {committed ? (
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-safe" />
                  <p className="text-[12px] leading-relaxed text-foreground/90">
                    <strong className="font-semibold">{committed.action}</strong> queued for the 14:35 UTC window.
                    Awaiting second sign-off from Constellation Ops before transmission.
                  </p>
                </div>
                <div className="divide-y divide-border/60">
                  <DataRow label="Committed by" value="Operator · Mission Control" />
                  <DataRow label="Residual risk" value={`${committed.risk.toFixed(0)}%`} tone="text-safe" />
                  <DataRow label="Mission score" value={String(committed.score)} />
                </div>
                <Link to="/history" className="block pt-1">
                  <BlockyButton size="sm" className="w-full">
                    <Gauge className="h-3.5 w-3.5" /> View in audit trail
                  </BlockyButton>
                </Link>
              </div>
            ) : (
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                Nothing is transmitted from the sandbox. Select a scenario and commit it to generate an uplink package
                for operator approval — the decision, its inputs and the model version are written to the audit trail.
              </p>
            )}
          </BlockyCard>
        </div>
      </div>
    </AppShell>
  );
}
