import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { riskLevel } from "@/lib/voxel-palette";

export function BlockyCard({
  children,
  className,
  title,
  subtitle,
  action,
  accent,
  dense,
  footer,
  hover = true,
}: {
  children?: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  accent?: "cyan" | "amber" | "red" | "green" | "none";
  dense?: boolean;
  footer?: ReactNode;
  hover?: boolean;
}) {
  const accentBar =
    accent && accent !== "none"
      ? {
          cyan: "before:bg-primary",
          amber: "before:bg-warning",
          red: "before:bg-danger",
          green: "before:bg-safe",
        }[accent]
      : null;

  return (
    <section
      className={cn(
        "block-surface relative animate-block-in",
        hover && "block-hover",
        accentBar &&
          cn("before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:content-['']", accentBar),
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-border/80 px-3.5 py-2.5">
          <div className="min-w-0">
            {title && <h3 className="hud-label truncate text-foreground/85">{title}</h3>}
            {subtitle && <p className="tabular mt-0.5 text-[10.5px] text-muted-foreground">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={dense ? "p-0" : "p-3.5"}>{children}</div>
      {footer && <div className="border-t border-border/80 px-3.5 py-2.5">{footer}</div>}
    </section>
  );
}

export function BlockyButton({
  children,
  className,
  variant = "default",
  size = "md",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "hero" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  const variants = {
    default: "bg-panel-raised text-foreground border-border hover:border-primary/70 hover:text-primary",
    primary: "bg-primary text-primary-foreground border-primary/60 hover:brightness-110",
    hero: "bg-primary text-primary-foreground border-primary/60 hover:brightness-110 shadow-[0_0_20px_-6px_var(--primary),3px_3px_0_0_var(--shadow-hard)]",
    danger: "bg-danger text-danger-foreground border-danger/60 hover:brightness-110",
    ghost: "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-panel-raised",
  }[variant];
  const sizes = {
    sm: "min-h-8 px-3 py-1.5 text-[11px]",
    md: "min-h-10 px-4 py-2 text-xs",
    lg: "min-h-11 px-6 py-3 text-sm",
  }[size];

  return (
    <button
      {...rest}
      className={cn(
        "block-notch inline-flex items-center justify-center gap-2 border font-hud uppercase tracking-[0.14em] transition-all duration-150 ease-[var(--ease-step)] active:translate-y-[2px] active:shadow-none disabled:pointer-events-none disabled:opacity-45",
        "shadow-block-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        variants,
        sizes,
        className,
      )}
    >
      {children}
    </button>
  );
}

export function BlockyInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={cn(
        "block-notch min-h-10 w-full border border-border bg-input/60 px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none",
        "shadow-[inset_0_2px_0_0_var(--shadow-hard)]",
        className,
      )}
    />
  );
}

export function BlockySelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const id = `sel-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="min-w-[132px]">
      <label htmlFor={id} className="hud-label mb-1 block text-[8.5px]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block-notch min-h-9 w-full border border-border bg-input/60 px-2.5 py-1.5 font-mono text-[11.5px] text-foreground focus:border-primary focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Counts a numeric readout up to its target — no jitter, settles exactly. */
export function useCountUp(target: number, durationMs = 650): number {
  const [val, setVal] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    if (Math.abs(from - target) < 0.01) {
      setVal(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - k, 3);
      const next = from + (target - from) * eased;
      setVal(next);
      fromRef.current = next;
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs]);

  return val;
}

export function CountUp({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const v = useCountUp(value);
  return (
    <>
      {v.toFixed(decimals)}
      {suffix}
    </>
  );
}

export function StatTile({
  label,
  value,
  unit,
  sub,
  tone = "info",
  big,
  icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  tone?: "info" | "warn" | "danger" | "safe" | "neutral";
  big?: boolean;
  icon?: ReactNode;
}) {
  const toneClass = {
    info: "text-primary",
    warn: "text-warning",
    danger: "text-danger",
    safe: "text-safe",
    neutral: "text-foreground",
  }[tone];
  return (
    <div className="block-surface-flat block-notch block-hover px-3.5 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="hud-label truncate text-[9.5px]">{label}</div>
        {icon && <span className={cn("shrink-0", toneClass)}>{icon}</span>}
      </div>
      <div
        className={cn(
          "tabular mt-1.5 flex items-baseline gap-1 font-semibold leading-none",
          toneClass,
          big ? "text-4xl" : "text-2xl",
        )}
      >
        {value}
        {unit && <span className="text-xs font-normal text-muted-foreground">{unit}</span>}
      </div>
      {sub && <div className="tabular mt-2 text-[10.5px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function RiskChip({ risk, showBar = true }: { risk: number; showBar?: boolean }) {
  const lvl = riskLevel(risk);
  const map = {
    high: { text: "text-danger", bg: "bg-danger", label: "HIGH" },
    medium: { text: "text-warning", bg: "bg-warning", label: "MED" },
    low: { text: "text-safe", bg: "bg-safe", label: "LOW" },
  }[lvl];
  const blocks = Math.max(1, Math.round((risk / 100) * 8));
  return (
    <div className="flex items-center gap-2">
      {showBar && (
        <div className="flex gap-[2px]" aria-hidden>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className={cn("h-3 w-[5px]", i < blocks ? map.bg : "bg-muted opacity-55")} />
          ))}
        </div>
      )}
      <span className={cn("tabular text-xs font-semibold", map.text)}>{risk.toFixed(0)}%</span>
      <span className={cn("hud-label border border-current/40 px-1 py-[1px] text-[9px]", map.text)}>{map.label}</span>
    </div>
  );
}

export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "info" | "warn" | "danger" | "safe";
  className?: string;
}) {
  const tones = {
    neutral: "border-border text-muted-foreground",
    info: "border-primary/45 text-primary bg-primary/10",
    warn: "border-warning/45 text-warning bg-warning/10",
    danger: "border-danger/45 text-danger bg-danger/10",
    safe: "border-safe/45 text-safe bg-safe/10",
  }[tone];
  return (
    <span
      className={cn(
        "hud-label inline-flex items-center gap-1 whitespace-nowrap border px-1.5 py-[2px] text-[9px]",
        tones,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone = "safe", pulse = true }: { tone?: "safe" | "warn" | "danger" | "info"; pulse?: boolean }) {
  const color = { safe: "text-safe", warn: "text-warning", danger: "text-danger", info: "text-primary" }[tone];
  return (
    <span
      className={cn("inline-block h-2 w-2 shrink-0", color, pulse && "animate-pulse-dot")}
      style={{ backgroundColor: "currentColor" }}
      aria-hidden
    />
  );
}

export function VoxelBarChart({
  items,
  segments = 14,
}: {
  items: { label: string; plain?: string; value: string; contribution: number; direction: "increases" | "decreases" }[];
  segments?: number;
}) {
  const max = Math.max(...items.map((i) => i.contribution));
  return (
    <div className="space-y-3">
      {items.map((it, idx) => {
        const filled = Math.max(1, Math.round((it.contribution / max) * segments));
        const up = it.direction === "increases";
        return (
          <div key={it.label}>
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <span className="text-[12px] font-medium text-foreground/90">{it.label}</span>
              <span className="tabular text-[11px] text-muted-foreground">{it.value}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-[3px]" aria-hidden>
                {Array.from({ length: segments }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-3.5 w-[9px] border-t",
                      i < filled
                        ? up
                          ? "animate-bar-grow border-t-danger-foreground/30 bg-danger"
                          : "animate-bar-grow border-t-safe-foreground/30 bg-safe"
                        : "border-t-transparent bg-muted/60",
                    )}
                    style={i < filled ? { animationDelay: `${idx * 60 + i * 18}ms` } : undefined}
                  />
                ))}
              </div>
              <span className={cn("tabular text-[11px] font-semibold", up ? "text-danger" : "text-safe")}>
                {up ? "+" : "−"}
                {(it.contribution * 100).toFixed(0)}%
              </span>
            </div>
            {it.plain && <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{it.plain}</p>}
          </div>
        );
      })}
    </div>
  );
}

export function ConfidenceMeter({ value, label = "Model confidence" }: { value: number; label?: string }) {
  const blocks = 20;
  const filled = Math.round((value / 100) * blocks);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="hud-label text-[9px]">{label}</span>
        <span className="tabular text-[12px] font-semibold text-safe">
          <CountUp value={value} />%
        </span>
      </div>
      <div className="mt-1.5 flex gap-[2px]" aria-hidden>
        {Array.from({ length: blocks }).map((_, i) => (
          <span
            key={i}
            className={cn("h-2 flex-1", i < filled ? (i > blocks - 4 ? "bg-safe" : "bg-safe/85") : "bg-muted/60")}
          />
        ))}
      </div>
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  description,
  children,
}: {
  kicker?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {kicker && <div className="hud-label text-primary">{kicker}</div>}
        <h1 className="mt-1 text-xl font-semibold tracking-wide text-foreground md:text-2xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function Breadcrumbs({ trail }: { trail: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5">
      {trail.map((t, i) => (
        <span key={t.label} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/60" aria-hidden />}
          {t.to && i < trail.length - 1 ? (
            <Link to={t.to} className="hud-label text-[9px] transition-colors hover:text-primary">
              {t.label}
            </Link>
          ) : (
            <span className="hud-label text-[9px] text-foreground/80">{t.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-shimmer bg-muted/60", className)} aria-hidden />;
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-live="polite">
      <Skeleton className="h-3 w-24" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <span className="grid h-10 w-10 place-items-center border border-border bg-panel-raised text-muted-foreground">
        <Inbox className="h-4 w-4" />
      </span>
      <h4 className="hud-label text-[10px] text-foreground/85">{title}</h4>
      <p className="max-w-sm text-[12px] leading-relaxed text-muted-foreground">{body}</p>
      {action && <div className="mt-1.5">{action}</div>}
    </div>
  );
}

export function DataRow({ label, value, tone }: { label: string; value: ReactNode; tone?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[11.5px] text-muted-foreground">{label}</span>
      <span className={cn("tabular text-right text-[12px] font-medium text-foreground", tone)}>{value}</span>
    </div>
  );
}
