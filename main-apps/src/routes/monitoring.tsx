import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BlockyCard, BlockyButton, BlockyInput, RiskChip, SectionHeading, StatusDot } from "@/components/blocks";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Satellite } from "@/lib/mission-data"; // just for the type

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "Satellite Monitoring — OrbitalGuardian AI" },
      {
        name: "description",
        content: "Fleet-wide satellite health and collision-risk table: mission, operator, orbit regime, telemetry state and AI risk prediction per spacecraft.",
      },
    ],
  }),
  component: MonitoringPage,
});

const HEALTH = {
  nominal: { tone: "safe" as const, label: "Nominal" },
  degraded: { tone: "warn" as const, label: "Degraded" },
  critical: { tone: "danger" as const, label: "Critical" },
};

function MonitoringPage() {
  const [q, setQ] = useState("");
  const [onlyRisky, setOnlyRisky] = useState(false);
  const [satellites, setSatellites] = useState<Satellite[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "satellites"), (snapshot) => {
      const sats: Satellite[] = [];
      snapshot.forEach((doc) => {
        sats.push(doc.data() as Satellite);
      });
      // Sort to match original order (og-1 to og-8)
      sats.sort((a, b) => a.id.localeCompare(b.id));
      setSatellites(sats);
    });
    return () => unsub();
  }, []);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return satellites.filter(
      (s) =>
        (!t ||
          s.name.toLowerCase().includes(t) ||
          s.operator.toLowerCase().includes(t) ||
          s.mission.toLowerCase().includes(t)) &&
        (!onlyRisky || s.risk >= 25),
    );
  }, [q, onlyRisky, satellites]);

  return (
    <AppShell>
      <SectionHeading kicker="Fleet" title="Satellite Monitoring">
        <span className="tabular text-[11px] text-muted-foreground">
          {rows.length} of {satellites.length} assets shown
        </span>
      </SectionHeading>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[260px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <BlockyInput
            placeholder="Search asset, mission or operator…"
            className="pl-8"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <BlockyButton size="md" variant={onlyRisky ? "primary" : "default"} onClick={() => setOnlyRisky((v) => !v)}>
          <SlidersHorizontal className="h-3.5 w-3.5" /> Risk ≥ 25%
        </BlockyButton>
      </div>

      <div className="mt-3 space-y-2">
        <div className="hidden grid-cols-[1.4fr_1.2fr_1.1fr_1fr_0.8fr_1.4fr_auto] gap-3 px-3 lg:grid">
          {["Satellite", "Mission", "Operator", "Orbit", "Health", "Collision risk", ""].map((h) => (
            <span key={h} className="hud-label text-[9px]">
              {h}
            </span>
          ))}
        </div>

        {rows.map((s, i) => (
          <div
            key={s.id}
            className="block-surface-flat animate-block-in grid grid-cols-2 items-center gap-3 px-3 py-3 lg:grid-cols-[1.4fr_1.2fr_1.1fr_1fr_0.8fr_1.4fr_auto]"
            style={{ animationDelay: `${i * 35}ms` }}
          >
            <div>
              <div className="font-hud text-[12px] font-bold tracking-wide text-foreground">{s.name}</div>
              <div className="tabular text-[10px] text-muted-foreground">{s.cospar}</div>
            </div>
            <div className="text-[12px] text-foreground/85">{s.mission}</div>
            <div className="text-[12px] text-muted-foreground">{s.operator}</div>
            <div className="tabular text-[11.5px] text-foreground/85">{s.orbit}</div>
            <div className="flex items-center gap-1.5">
              <StatusDot tone={HEALTH[s.health].tone} pulse={s.health !== "nominal"} />
              <span className="text-[11.5px] text-foreground/85">{HEALTH[s.health].label}</span>
            </div>
            <RiskChip risk={s.risk} />
            <Link to="/analysis/$satId" params={{ satId: s.id }} className="justify-self-end">
              <BlockyButton size="sm" variant={s.risk >= 60 ? "danger" : "default"}>
                Mission Control
              </BlockyButton>
            </Link>
          </div>
        ))}

        {rows.length === 0 && (
          <BlockyCard>
            <p className="text-center text-[12px] text-muted-foreground">No assets match this filter.</p>
          </BlockyCard>
        )}
      </div>
    </AppShell>
  );
}
