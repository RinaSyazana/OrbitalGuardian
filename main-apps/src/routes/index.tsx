import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Boxes, Lock, User, ChevronRight, AlertTriangle } from "lucide-react";
import { VoxelEarth } from "@/components/voxel/VoxelEarth";
import { BlockyButton, BlockyInput } from "@/components/blocks";
import { allMarkers } from "@/lib/orbit";

// Hardcoded credentials
const VALID_ID = "operator_admin";
const VALID_KEY = "operator_admin123";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OrbitalGuardian AI — Operator Sign-In | Voxel Mission Control" },
      {
        name: "description",
        content:
          "Sign in to OrbitalGuardian AI: AI-driven satellite collision prediction, SHAP explainability and maneuver simulation in a voxel mission-control console.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [operatorId, setOperatorId] = useState(VALID_ID);
  const [accessKey, setAccessKey] = useState(VALID_KEY);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (operatorId === VALID_ID && accessKey === VALID_KEY) {
      sessionStorage.setItem("og_auth", "1");
      sessionStorage.setItem("og_operator", operatorId);
      navigate({ to: "/dashboard" });
    } else {
      setError("Invalid operator ID or access key. Please try again.");
    }
  }

  return (
    <div className="starfield relative min-h-screen overflow-hidden">
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-[0.12]" />

      <div className="absolute -right-24 top-1/2 h-[720px] w-[720px] -translate-y-1/2 opacity-80 md:right-0">
        <VoxelEarth
          markers={allMarkers(undefined, 9)}
          resolution={9}
          zoom={0.85}
          className="h-full w-full"
          controls={false}
          overlayHint=""
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="border border-border bg-panel px-2 py-1 font-hud text-[11px] font-bold tracking-[0.2em] text-foreground">
            IBM
          </span>
          <span className="hud-label text-[9px]">Space Challenge · August 2026</span>
        </div>

        <div className="my-auto max-w-md animate-hud-in">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center border border-primary/50 bg-primary/15 text-primary">
              <Boxes className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-hud text-2xl font-bold tracking-[0.14em] text-foreground">
                ORBITALGUARDIAN <span className="text-primary">AI</span>
              </h1>
              <p className="hud-label text-[9px] text-primary">Collision prediction · Decision intelligence</p>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
            Operator authentication required. This console commands live maneuver planning for 1,284 tracked
            spacecraft against a 28,411-object debris catalogue.
          </p>

          <form className="block-surface mt-6 space-y-4 p-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="hud-label flex items-center gap-1.5 text-[9px]" htmlFor="operatorId">
                <User className="h-3 w-3" /> Operator ID
              </label>
              <BlockyInput
                id="operatorId"
                value={operatorId}
                onChange={(e) => { setOperatorId(e.target.value); setError(""); }}
                autoComplete="username"
              />
            </div>
            <div className="space-y-1.5">
              <label className="hud-label flex items-center gap-1.5 text-[9px]" htmlFor="accessKey">
                <Lock className="h-3 w-3" /> Access key
              </label>
              <BlockyInput
                id="accessKey"
                type="password"
                value={accessKey}
                onChange={(e) => { setAccessKey(e.target.value); setError(""); }}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 border border-danger/40 bg-danger/10 px-3 py-2 text-[11.5px] text-danger">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}

            <BlockyButton type="submit" variant="hero" size="lg" className="w-full">
              Access Mission Control <ChevronRight className="h-4 w-4" />
            </BlockyButton>
            <p className="tabular text-center text-[10px] text-muted-foreground/70">
              Authorised personnel only · All sessions are logged
            </p>
          </form>
        </div>

        <div className="hud-label text-[9px]">
          Sector 4 ground segment · link nominal · latency 42 ms
        </div>
      </div>
    </div>
  );
}
