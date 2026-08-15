import { cn } from "@/lib/utils";
import { BlockyCard, StatusDot } from "@/components/blocks";
import { TIMELINE, ALERTS, SPACE_WEATHER, AI_HEALTH, type TimelineEvent, type AlertItem } from "@/lib/mission-data";

const toneColor = {
  info: "bg-primary",
  warn: "bg-warning",
  danger: "bg-danger",
  safe: "bg-safe",
} as const;

export function TimelineFeed({ events = TIMELINE }: { events?: TimelineEvent[] }) {
  return (
    <ol className="relative space-y-3 pl-5">
      <span className="absolute left-[5px] top-1 h-[calc(100%-8px)] w-[2px] bg-border" />
      {events.map((e, i) => (
        <li
          key={`${e.time}-${e.label}`}
          className="relative animate-slide-in-top"
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <span className={cn("absolute -left-5 top-[3px] h-3 w-3 border border-background", toneColor[e.tone])} />
          <div className="flex items-baseline gap-2">
            <span className="tabular text-[11px] text-muted-foreground">{e.time}</span>
            <span className="text-[12.5px] font-medium text-foreground">{e.label}</span>
          </div>
          <div className="tabular text-[11px] text-muted-foreground">{e.detail}</div>
        </li>
      ))}
    </ol>
  );
}

export function AlertCard({ alert }: { alert: AlertItem }) {
  const accent =
    alert.severity === "critical" ? "bg-danger" : alert.severity === "warning" ? "bg-warning" : "bg-primary";
  const label =
    alert.severity === "critical" ? "text-danger" : alert.severity === "warning" ? "text-warning" : "text-primary";
  return (
    <article className="block-surface-flat relative pl-4 pr-3 py-2.5">
      <span className={cn("absolute left-0 top-0 h-full w-[4px]", accent)} />
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-[12.5px] font-semibold text-foreground">{alert.title}</h4>
        <span className={cn("hud-label whitespace-nowrap text-[9px]", label)}>{alert.severity}</span>
      </div>
      <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">{alert.body}</p>
      <div className="tabular mt-1 text-[10px] text-muted-foreground/70">{alert.time}</div>
    </article>
  );
}

export function AlertsPanel({ limit = 4 }: { limit?: number }) {
  return (
    <BlockyCard title="Active alerts" accent="red" dense>
      <div className="divide-y divide-border/70">
        {ALERTS.slice(0, limit).map((a) => (
          <AlertCard key={a.id} alert={a} />
        ))}
      </div>
    </BlockyCard>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[11.5px] text-muted-foreground">{label}</span>
      <span className={cn("tabular text-[12px] font-medium text-foreground", tone)}>{value}</span>
    </div>
  );
}

export function SpaceWeatherWidget() {
  return (
    <BlockyCard title="Space weather" accent="amber">
      <div className="divide-y divide-border/60">
        <Row label="Solar activity" value={SPACE_WEATHER.solarActivity} tone="text-warning" />
        <Row label="Solar flux (F10.7)" value={`${SPACE_WEATHER.solarFlux} sfu`} />
        <Row
          label="KP index"
          value={`${SPACE_WEATHER.kpIndex} — ${SPACE_WEATHER.kpLabel}`}
          tone="text-warning"
        />
        <Row label="Geomagnetic storm" value={SPACE_WEATHER.storm} tone="text-warning" />
      </div>
      <div className="mt-2 flex items-center gap-2 border border-warning/40 bg-warning/10 px-2 py-1.5">
        <span className="text-warning">⚠</span>
        <span className="text-[11px] text-warning">Increased orbital uncertainty below 600 km</span>
      </div>
    </BlockyCard>
  );
}

export function AiHealthWidget() {
  return (
    <BlockyCard
      title="AI prediction model"
      accent="green"
      action={
        <span className="flex items-center gap-1.5">
          <StatusDot tone="safe" />
          <span className="hud-label text-[9px] text-safe">{AI_HEALTH.status}</span>
        </span>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: "Accuracy", v: `${AI_HEALTH.accuracy}%` },
          { l: "Precision", v: `${AI_HEALTH.precision}%` },
          { l: "Recall", v: `${AI_HEALTH.recall}%` },
        ].map((m) => (
          <div key={m.l} className="border border-border bg-panel-raised px-2 py-1.5">
            <div className="hud-label text-[9px]">{m.l}</div>
            <div className="tabular text-base font-semibold text-safe">{m.v}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 divide-y divide-border/60">
        <Row label="Serving model" value="LightGBM" />
        <Row label="Inference latency" value={`${AI_HEALTH.latencyMs} ms`} />
        <Row label="Last updated" value={AI_HEALTH.updated} />
      </div>
    </BlockyCard>
  );
}
