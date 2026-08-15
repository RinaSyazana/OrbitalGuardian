import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowUpRight, Radar } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BlockyCard, BlockyButton, StatTile, RiskChip, SectionHeading } from "@/components/blocks";
import { TimelineFeed, AlertsPanel, SpaceWeatherWidget, AiHealthWidget } from "@/components/widgets";
import { VoxelEarth } from "@/components/voxel/VoxelEarth";
import { allMarkers } from "@/lib/orbit";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Satellite } from "@/lib/mission-data"; // type only

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Mission Control — OrbitalGuardian AI" },
      {
        name: "description",
        content:
          "Live orbital traffic on a voxel Earth: KPI telemetry, space weather, AI model health, mission timeline and active collision alerts.",
      },
      { property: "og:title", content: "Mission Control — OrbitalGuardian AI" },
      {
        property: "og:description",
        content: "Live voxel-Earth orbital traffic with AI collision risk, space weather and alerting.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [selected, setSelected] = useState<string>("og-1");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "satellites"), (snapshot) => {
      const sats: Satellite[] = [];
      snapshot.forEach((doc) => sats.push(doc.data() as Satellite));
      sats.sort((a, b) => a.id.localeCompare(b.id));
      setSatellites(sats);
    });
    return () => unsub();
  }, []);

  const sat = satellites.find((s) => s.id === selected) ?? satellites[0];

  const highRisk = satellites.filter((s) => s.risk >= 60).length;
  const avgRisk = satellites.length
    ? Math.round(satellites.reduce((sum, s) => sum + s.risk, 0) / satellites.length)
    : 0;

  const KPIS = [
    { label: "Active satellites", value: satellites.length.toString(), sub: "in fleet", tone: "info" as const },
    { label: "Tracked debris", value: "28,411", sub: "+341 / 24h", tone: "warn" as const },
    { label: "High-risk events", value: highRisk.toString(), sub: "risk ≥ 60%", tone: "danger" as const },
    { label: "Avg collision risk", value: `${avgRisk}%`, sub: "fleet-wide", tone: "warn" as const },
    { label: "AI model status", value: "Healthy", sub: "LightGBM · 96.4%", tone: "safe" as const },
    { label: "Predictions today", value: "1,284", sub: "avg 0.12 s", tone: "info" as const },
  ];

  return (
    <AppShell>
      <SectionHeading kicker="Mission Control" title="Orbital Traffic Overview">
        <div className="flex items-center gap-2">
          <BlockyButton size="sm">Refresh catalogue</BlockyButton>
          {sat && (
            <Link to="/analysis/$satId" params={{ satId: selected }}>
              <BlockyButton size="sm" variant="primary">
                <Radar className="h-3.5 w-3.5" /> Open conjunction
              </BlockyButton>
            </Link>
          )}
        </div>
      </SectionHeading>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        {KPIS.map((k) => (
          <StatTile key={k.label} label={k.label} value={k.value} sub={k.sub} tone={k.tone} />
        ))}
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          <BlockyCard
            title="Voxel Earth — live orbital traffic"
            accent="cyan"
            dense
            action={
              <span className="hud-label text-[9px]">
                {satellites.length} satellites · 4 debris tracks · epoch 2026-08-02
              </span>
            }
          >
            <div className="relative">
              <VoxelEarth
                markers={allMarkers(selected)}
                onSelectMarker={(id) => id.startsWith("og-") && setSelected(id)}
                className="h-[420px] w-full md:h-[560px]"
              />
              {sat && (
                <div className="pointer-events-none absolute left-3 top-3 w-56 space-y-2">
                  <div className="block-surface-flat block-notch p-3">
                    <div className="hud-label text-[9px] text-primary">Selected asset</div>
                    <div className="mt-1 font-hud text-[13px] font-bold tracking-wide">{sat.name}</div>
                    <div className="tabular mt-0.5 text-[10.5px] text-muted-foreground">{sat.cospar}</div>
                    <div className="tabular mt-2 space-y-0.5 text-[11px] text-muted-foreground">
                      <div>{sat.orbit}</div>
                      <div>incl {sat.inclination?.toFixed(1)}°</div>
                      <div>ping {sat.lastPing}</div>
                    </div>
                    <div className="mt-2">
                      <RiskChip risk={sat.risk} />
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 right-3">
                {sat && (
                  <Link to="/analysis/$satId" params={{ satId: selected }}>
                    <BlockyButton size="sm" variant="primary">
                      Analyse {sat.name} <ArrowUpRight className="h-3.5 w-3.5" />
                    </BlockyButton>
                  </Link>
                )}
              </div>
            </div>
          </BlockyCard>

          <div className="grid gap-3 md:grid-cols-2">
            <SpaceWeatherWidget />
            <AiHealthWidget />
          </div>
        </div>

        <div className="space-y-3">
          <BlockyCard title="Mission timeline — live" accent="cyan">
            <TimelineFeed />
          </BlockyCard>
          <AlertsPanel />
        </div>
      </div>
    </AppShell>
  );
}
