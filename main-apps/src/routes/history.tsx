import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Play, ChevronDown, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { BlockyCard, BlockyButton, RiskChip, SectionHeading, StatTile } from "@/components/blocks";
import { VoxelEarth } from "@/components/voxel/VoxelEarth";
import { allMarkers } from "@/lib/orbit";
import { cn } from "@/lib/utils";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Mission History & Replay — OrbitalGuardian AI" },
      {
        name: "description",
        content:
          "Audit past conjunction assessments and replay each mission: prediction, SHAP explanation, recommendation and the committed avoidance maneuver.",
      },
      { property: "og:title", content: "Mission History & Replay — OrbitalGuardian AI" },
      {
        property: "og:description",
        content: "Replay past predictions, explanations and committed maneuvers.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "history"), (snapshot) => {
      const records: any[] = [];
      snapshot.forEach((doc) => records.push(doc.data()));
      // Sort newest first by date string
      records.sort((a, b) => b.date.localeCompare(a.date));
      setHistory(records);
      if (records.length > 0 && open === null) {
        setOpen(records[0].id);
      }
    });
    return () => unsub();
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter(
      (m) =>
        m.satellite.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.outcome.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  return (
    <AppShell>
      <SectionHeading kicker="Audit trail" title="Mission History">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by satellite or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-64 border border-border bg-background/50 pl-8 pr-3 text-[11.5px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <span className="tabular text-[11px] text-muted-foreground">
            {filteredHistory.length} assessments · retention 24 months
          </span>
        </div>
      </SectionHeading>

      <div className="mt-4 space-y-3">
        {filteredHistory.map((m, i) => {
          const expanded = open === m.id;
          return (
            <article
              key={m.id}
              className="block-surface animate-block-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : m.id)}
                className="flex w-full flex-wrap items-center gap-4 px-3 py-3 text-left"
              >
                <div className="h-16 w-24 shrink-0 overflow-hidden border border-border">
                  <VoxelEarth
                    markers={allMarkers(undefined, 6)}
                    resolution={6}
                    zoom={0.9}
                    showRings={false}
                    controls={false}
                    className="h-full w-full"
                    overlayHint=""
                  />
                </div>
                <div className="min-w-[170px]">
                  <div className="font-hud text-[12.5px] font-bold tracking-wide">{m.satellite}</div>
                  <div className="tabular text-[10.5px] text-muted-foreground">{m.date}</div>
                </div>
                <div className="min-w-[150px]">
                  <div className="hud-label text-[9px]">Action</div>
                  <div className="tabular text-[12px] text-foreground/85">{m.action}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="hud-label text-[9px]">Predicted</div>
                    <RiskChip risk={m.risk} showBar={false} />
                  </div>
                  <span className="text-muted-foreground">→</span>
                  <div>
                    <div className="hud-label text-[9px]">Residual</div>
                    <RiskChip risk={m.finalRisk} showBar={false} />
                  </div>
                </div>
                <span
                  className={cn(
                    "hud-label ml-auto border px-2 py-1 text-[9px]",
                    m.outcome === "Avoided"
                      ? "border-safe/40 text-safe"
                      : m.outcome === "Monitoring"
                        ? "border-warning/40 text-warning"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {m.outcome}
                </span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-150", expanded && "rotate-180")} />
              </button>

              {expanded && (
                <div className="grid gap-3 border-t border-border p-3 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="relative">
                    <VoxelEarth
                      markers={allMarkers()}
                      zoom={1.05}
                      overlayHint=""
                      className="h-[300px] w-full border border-border"
                    />
                    <div className="absolute bottom-3 left-3">
                      <BlockyButton 
                        size="sm" 
                        variant="primary"
                        onClick={() => {
                          toast.info(`Initializing replay for ${m.satellite}...`, {
                            description: "Loading telemetry and SHAP arrays into Voxel Engine",
                          });
                        }}
                      >
                        <Play className="h-3.5 w-3.5" /> Replay mission
                      </BlockyButton>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <StatTile label="Fuel used" value={m.fuelKg?.toFixed(1)} unit="kg" tone="neutral" />
                      <StatTile label="Risk reduction" value={`${m.risk - m.finalRisk}`} unit="pts" tone="safe" />
                    </div>
                    <div className="border-l-2 border-primary/60 bg-primary/5 px-3 py-2.5">
                      <div className="hud-label text-[9px] text-primary">Explanation replay</div>
                      <p className="mt-1 text-[12px] leading-relaxed text-foreground/90">{m.narrative}</p>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {history.length === 0 && (
          <div className="block-surface-flat p-8 text-center text-sm text-muted-foreground font-mono animate-pulse">
            Loading mission history from Firebase...
          </div>
        )}
      </div>
    </AppShell>
  );
}
