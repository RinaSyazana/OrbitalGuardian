import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Satellite,
  Radar,
  FlaskConical,
  History,
  Info,
  LogOut,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/blocks";

const NAV = [
  { to: "/dashboard", label: "Mission Control", icon: LayoutDashboard },
  { to: "/monitoring", label: "Satellites", icon: Satellite },
  { to: "/analysis/og-1", label: "Collision Analysis", icon: Radar },
  { to: "/sandbox/og-1", label: "Mission Sandbox", icon: FlaskConical },
  { to: "/history", label: "Mission History", icon: History },
  { to: "/about", label: "About", icon: Info },
] as const;

// Simple auth helper — checks sessionStorage flag
export function isLoggedIn(): boolean {
  return sessionStorage.getItem("og_auth") === "1";
}

export function logout() {
  sessionStorage.removeItem("og_auth");
}

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }

  // Display the logged-in operator name
  const operatorName = sessionStorage.getItem("og_operator") ?? "Operator";
  const initials = operatorName.slice(0, 2).toUpperCase();

  return (
    <div className="starfield min-h-screen text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1720px] items-center gap-4 px-4">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center border border-primary/50 bg-primary/15 text-primary">
              <Boxes className="h-4 w-4" />
            </span>
            <span className="leading-tight">
              <span className="block font-hud text-[13px] font-bold tracking-[0.18em] text-foreground">
                ORBITALGUARDIAN
              </span>
              <span className="hud-label block text-[8.5px] text-primary">AI Decision Intelligence</span>
            </span>
          </Link>

          <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: false }}
                activeProps={{ className: "!text-primary !border-primary/50 !bg-primary/10" }}
                className="flex items-center gap-1.5 border border-transparent px-2.5 py-1.5 font-hud text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground transition-colors duration-150 hover:bg-panel-raised hover:text-foreground"
              >
                <n.icon className="h-3.5 w-3.5" />
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden items-center gap-1.5 md:flex">
              <StatusDot tone="safe" />
              <span className="hud-label text-[9px] text-safe">LightGBM online</span>
            </span>
            <span className="tabular hidden text-[11px] text-muted-foreground md:block">
              {new Date().toISOString().slice(11, 19)} UTC
            </span>
            <span className="hidden items-center gap-2 border-l border-border pl-4 sm:flex">
              <span className="grid h-7 w-7 place-items-center border border-border bg-panel-raised tabular text-[10px] text-primary">
                {initials}
              </span>
              <span className="leading-tight">
                <span className="block text-[11.5px] font-medium">{operatorName}</span>
                <span className="hud-label block text-[8.5px]">Mission Control</span>
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="text-muted-foreground transition-colors hover:text-danger"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <nav className="flex overflow-x-auto border-t border-border lg:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: false }}
              activeProps={{ className: "!text-primary !bg-primary/10" }}
              className="flex shrink-0 items-center gap-1.5 px-3 py-2 font-hud text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
            >
              <n.icon className="h-3.5 w-3.5" />
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className={cn("mx-auto max-w-[1720px] px-4 py-5")}>{children}</main>

      <footer className="mx-auto max-w-[1720px] px-4 pb-6 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <span className="hud-label text-[9px]">
            OrbitalGuardian AI · IBM Space Challenge · Demo data — not for operational use
          </span>
          <span className="tabular text-[10px] text-muted-foreground/70">
            Catalogue 28,411 objects · TLE epoch 2026-08-02
          </span>
        </div>
      </footer>
    </div>
  );
}
