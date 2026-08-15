import { createFileRoute, Link } from "@tanstack/react-router";
import { FlaskConical, Fuel, Gauge, Timer, Cpu, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BlockyCard, BlockyButton, StatTile, RiskChip, VoxelBarChart, SectionHeading } from "@/components/blocks";
import { VoxelEarth } from "@/components/voxel/VoxelEarth";
import { satelliteMarker, debrisMarker, orbitRadius } from "@/lib/orbit";
import { useState, useEffect, useCallback } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/analysis/$satId")({
  head: () => ({
    meta: [
      { title: "Collision Analysis | OrbitalGuardian AI" },
      {
        name: "description",
        content: "AI conjunction analysis and SHAP factor explanation.",
      },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const { satId } = Route.useParams();
  
  const [sat, setSat] = useState<any>(null);
  const [debris, setDebris] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [triggering, setTriggering] = useState(false);

  // Auto-trigger the AI prediction from the backend whenever this satellite page opens
  const triggerPrediction = useCallback(async (id: string) => {
    setTriggering(true);
    try {
      await fetch(`http://localhost:8000/api/trigger_prediction?sat_id=${id}`);
    } catch (e) {
      // Backend offline — Firebase snapshot will still show seeded data
    } finally {
      setTriggering(false);
    }
  }, []);

  useEffect(() => {
    // Trigger prediction immediately on page load for this satellite
    triggerPrediction(satId);

    const unsubSat = onSnapshot(doc(db, "satellites", satId), (doc) => {
      if (doc.exists()) setSat(doc.data());
    });
    const unsubDeb = onSnapshot(doc(db, "debris", "deb-1"), (doc) => {
      if (doc.exists()) setDebris(doc.data());
    });
    const unsubEvent = onSnapshot(doc(db, "events", satId), (doc) => {
      if (doc.exists()) setAiData(doc.data());
    });

    return () => {
      unsubSat();
      unsubDeb();
      unsubEvent();
    };
  }, [satId, triggerPrediction]);

  if (!sat || !debris || !aiData) {
    return (
      <AppShell>
        <div className="flex h-screen items-center justify-center text-primary font-mono text-xl animate-pulse">
          Connecting to live Firebase AI Database...
        </div>
      </AppShell>
    );
  }

  const { CONJUNCTION, SHAP_FACTORS, SHAP_NARRATIVE, RECOMMENDATION } = aiData;

  return (
    <AppShell>
      <SectionHeading kicker="Conjunction assessment" title={`${sat.name} vs ${debris.name}`}>
        <div className="flex items-center gap-2">
          <BlockyButton
            size="sm"
            variant="default"
            onClick={() => triggerPrediction(satId)}
            disabled={triggering}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${triggering ? "animate-spin" : ""}`} />
            {triggering ? "Computing..." : "Re-run Prediction"}
          </BlockyButton>
          <Link to="/sandbox/$satId" params={{ satId }}>
            <BlockyButton variant="hero" size="lg">
              <FlaskConical className="h-4 w-4" /> Open Mission Sandbox
            </BlockyButton>
          </Link>
        </div>
      </SectionHeading>

      {/* Zone A — satellite info strip */}
      <div className="mt-4 grid gap-3 md:grid-cols-4 xl:grid-cols-6">
        {[
          { l: "Asset", v: sat.name },
          { l: "COSPAR", v: sat.cospar },
          { l: "Orbit", v: sat.orbit },
          { l: "Operator", v: sat.operator },
          { l: "Inclination", v: `${sat.inclination?.toFixed(1) || 0}°` },
          { l: "Last telemetry", v: sat.lastPing },
        ].map((f) => (
          <div key={f.l} className="block-surface-flat block-notch px-3 py-2">
            <div className="hud-label text-[9px]">{f.l}</div>
            <div className="tabular mt-0.5 text-[12.5px] font-medium text-foreground">{f.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_400px]">
        {/* Zone B — viewport */}
        <div className="space-y-3">
          <BlockyCard title="Conjunction geometry — voxel Earth" accent="red" dense>
            <div className="relative">
              <VoxelEarth
                markers={[satelliteMarker(sat, sat.id), debrisMarker(debris)]}
                collision={{ altitude: orbitRadius(sat.altitudeKm), tilt: sat.ringTilt, phase: sat.ringPhase + 1.1 }}
                zoom={1.15}
                className="h-[400px] w-full md:h-[540px]"
              />
              <div className="pointer-events-none absolute left-3 top-3 space-y-1.5">
                {[
                  { c: "bg-primary", t: `${sat.name} — primary` },
                  { c: "bg-muted-foreground", t: `${debris.name} — ${debris.sizeM} m` },
                  { c: "bg-danger", t: `Projected TCA ${CONJUNCTION.tcaUtc}` },
                ].map((l) => (
                  <div key={l.t} className="block-surface-flat flex items-center gap-2 px-2 py-1">
                    <span className={`h-2.5 w-2.5 ${l.c}`} />
                    <span className="tabular text-[10.5px] text-foreground/85">{l.t}</span>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute bottom-3 right-3 block-surface-flat px-3 py-2">
                <div className="hud-label text-[9px]">Miss distance at TCA</div>
                <div className="tabular text-2xl font-semibold text-danger">
                  {CONJUNCTION.missDistanceM} <span className="text-xs text-muted-foreground">m</span>
                </div>
                <div className="tabular text-[10.5px] text-muted-foreground">
                  Δv rel {CONJUNCTION.relativeVelocityKms} km/s · Δalt {CONJUNCTION.altitudeDeltaKm} km
                </div>
              </div>
            </div>
          </BlockyCard>

          {/* SHAP */}
          <BlockyCard title="SHAP explainability — why this prediction" accent="cyan">
            {SHAP_FACTORS && SHAP_FACTORS.length > 0 ? (
              <VoxelBarChart items={SHAP_FACTORS} />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground font-mono text-sm border border-dashed border-primary/20 animate-pulse">
                Computing SHAP factors...
              </div>
            )}
            <div className="mt-3 border-l-2 border-primary/60 bg-primary/5 px-3 py-2.5">
              <div className="hud-label text-[9px] text-primary">Plain-language explanation</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/90">{SHAP_NARRATIVE}</p>
            </div>
          </BlockyCard>
        </div>

        <div className="space-y-3">
          {/* Zone C — prediction */}
          <BlockyCard title="AI prediction" accent="red">
            <div className="border border-danger/40 bg-danger/10 px-3 py-3 text-center">
              <div className="hud-label text-[9px] text-danger">Collision probability</div>
              <div className="tabular text-5xl font-bold leading-none text-danger">{CONJUNCTION.probability}%</div>
              <div className="mt-2 flex justify-center">
                <RiskChip risk={CONJUNCTION.probability} />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <StatTile label="Confidence" value={`${CONJUNCTION.confidence}%`} tone="safe" />
              <StatTile label="Model" value="LGBM" sub="LightGBM" tone="info" />
              <StatTile label="Inference" value={`${(CONJUNCTION.inferenceMs / 1000).toFixed(2)}`} unit="s" tone="info" />
            </div>
            <div className="tabular mt-3 space-y-1.5 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <Cpu className="h-3 w-3 text-primary" /> Features: 41 · covariance-aware
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-3 w-3 text-primary" /> TCA {CONJUNCTION.tcaUtc} · 25 min to close
              </div>
            </div>
          </BlockyCard>

          {/* Zone D — recommendation */}
          <BlockyCard title="Recommended action" accent="green">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-hud text-lg font-bold tracking-wide text-safe">{RECOMMENDATION.action}</div>
                <div className="tabular text-[11px] text-muted-foreground">{RECOMMENDATION.detail}</div>
              </div>
              <span className="hud-label border border-danger/50 bg-danger/15 px-2 py-1 text-[9px] text-danger">
                {RECOMMENDATION.priority}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <StatTile label="Estimated fuel" value={RECOMMENDATION.fuelKg} unit="kg" tone="neutral" />
              <StatTile label="Estimated new risk" value={`${RECOMMENDATION.newRisk}%`} tone="safe" />
              <StatTile label="Δv budget" value={RECOMMENDATION.deltaV} unit="m/s" tone="neutral" />
              <StatTile label="Execution window" value={RECOMMENDATION.window} tone="warn" />
            </div>
            <div className="tabular mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              <Fuel className="h-3 w-3 text-warning" /> Leaves {sat.propellantKg} kg of station-keeping propellant
            </div>
            <div className="tabular mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
              <Gauge className="h-3 w-3 text-warning" /> Ground-track drift: +0.4° over 7 days
            </div>
            <Link to="/sandbox/$satId" params={{ satId }} className="mt-4 block">
              <BlockyButton variant="hero" size="lg" className="w-full">
                <FlaskConical className="h-4 w-4" /> Simulate in Mission Sandbox
              </BlockyButton>
            </Link>
            <p className="mt-2 text-center text-[10.5px] text-muted-foreground">
              No maneuver is uplinked until an operator commits a scenario.
            </p>
          </BlockyCard>
        </div>
      </div>
    </AppShell>
  );
}
