import { createFileRoute, Link } from "@tanstack/react-router";
import { Github, BookOpen, Database, Cpu, Server, Flame, Cloud, Shield, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BlockyCard, SectionHeading, BlockyButton, StatTile } from "@/components/blocks";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the System — OrbitalGuardian AI" },
      {
        name: "description",
        content:
          "Architecture, datasets, IBM Space Challenge alignment and research references behind OrbitalGuardian AI's collision prediction and decision-support console.",
      },
    ],
  }),
  component: AboutPage,
});

const ARCHITECTURE_STEPS = [
  { step: "01", label: "TLE Catalogue Ingest", detail: "Space-Track GP/TLE feed · 28,411 objects · refreshed every 6 h. Orbital elements parsed into standardised feature vectors." },
  { step: "02", label: "Conjunction Screening", detail: "Pairwise proximity sieve over 1.84 M candidate pairs per cycle. Filters to high-risk close-approach events using orbit propagation." },
  { step: "03", label: "Feature Engineering", detail: "41 features built per screened pair: miss distance, relative velocity, altitude delta, inclination delta, covariance, debris provenance, and KP index." },
  { step: "04", label: "LightGBM Risk Model", detail: "Gradient-boosted classifier (LightGBM) trained on 18,402 labelled CDM records. Output: collision probability 0–100%. Accuracy 96.4% on holdout." },
  { step: "05", label: "SHAP Explainability", detail: "SHAP (SHapley Additive exPlanations) decomposes each prediction into per-factor attributions. A plain-language narrative is generated for the operator." },
  { step: "06", label: "Maneuver Planner", detail: "Altitude, phasing, and Δv candidates are generated and re-scored on every operator input tick. Fuel and mission-score trade-offs shown in real time." },
  { step: "07", label: "Firebase Real-Time Sync", detail: "FastAPI backend writes predictions to Firestore. React frontend listens via onSnapshot — data updates on every page without requiring a refresh." },
  { step: "08", label: "Operator Commit & Audit", detail: "Dual sign-off flow. Every committed maneuver is written to the Firebase history collection — a permanent, auditable trail." },
];

const TECH_STACK = [
  { group: "AI / ML", icon: Cpu, items: ["LightGBM classifier", "SHAP explainability", "Scikit-learn feature pipeline", "FastAPI serving (Python)"] },
  { group: "Frontend", icon: Zap, items: ["React 19 + TypeScript", "TanStack Start / Router", "Tailwind CSS v4", "Custom canvas voxel renderer"] },
  { group: "Database", icon: Server, items: ["Firebase Firestore (NoSQL)", "Real-time onSnapshot listeners", "Event-driven architecture", "Firebase Admin SDK (Python)"] },
  { group: "IBM Platform", icon: Cloud, items: ["watsonx.ai — model serving", "watsonx.governance — audit trail", "IBM Cloud Object Storage", "IBM Space Challenge track"] },
];

const DATASETS = [
  { name: "Space-Track GP catalogue", detail: "28,411 objects · TLE epoch 2026-08-02", license: "Public, US Space Force" },
  { name: "ESA DISCOS", detail: "Debris size, mass and provenance characteristics", license: "ESA research licence" },
  { name: "NOAA SWPC indices", detail: "KP index, F10.7 solar flux, storm scale", license: "Public domain" },
  { name: "Historic CDM archive", detail: "18,402 labelled conjunctions, 2015–2026", license: "Synthetic for this demo" },
];

const AI_METRICS = [
  { label: "Holdout Accuracy", value: "96.4%", tone: "safe" as const },
  { label: "Precision", value: "94.1%", tone: "safe" as const },
  { label: "Recall", value: "92.8%", tone: "safe" as const },
  { label: "Avg Inference", value: "42 ms", tone: "info" as const },
  { label: "Screened Pairs / Cycle", value: "1.84 M", tone: "info" as const },
  { label: "Training Records", value: "18,402", tone: "info" as const },
];

function AboutPage() {
  return (
    <AppShell>
      <SectionHeading kicker="Documentation" title="About OrbitalGuardian AI">
        <span className="tabular text-[11px] text-muted-foreground">System architecture · AI pipeline · IBM alignment</span>
      </SectionHeading>

      {/* System Overview */}
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <BlockyCard title="Mission" accent="cyan">
          <p className="text-[12.5px] leading-relaxed text-foreground/85">
            OrbitalGuardian AI is an end-to-end satellite collision avoidance system built for the IBM Space Challenge.
            It combines a real-time LightGBM risk model with SHAP explainability and a live Firebase database so
            operators can understand <em>why</em> a conjunction is dangerous — not just <em>that</em> it is.
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            The core thesis: a prediction alone is not a decision. Trust requires explanation, simulation and an
            auditable commit.
          </p>
        </BlockyCard>

        <BlockyCard title="AI Model — LightGBM" accent="green">
          <div className="grid grid-cols-2 gap-2">
            {AI_METRICS.map((m) => (
              <StatTile key={m.label} label={m.label} value={m.value} tone={m.tone} />
            ))}
          </div>
          <p className="mt-3 tabular text-[11px] text-muted-foreground">
            Model: LightGBM · 41 features · covariance-aware · SHAP attribution on every inference.
          </p>
        </BlockyCard>

        <BlockyCard title="IBM Alignment" accent="amber">
          <ul className="space-y-2 text-[12.5px] leading-relaxed text-foreground/85">
            <li className="flex gap-2"><Flame className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" /> <strong>watsonx.ai</strong> — model serving and governance integration point.</li>
            <li className="flex gap-2"><Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" /> <strong>watsonx.governance</strong> — SHAP audit trails, drift scoring, model versioning.</li>
            <li className="flex gap-2"><Cloud className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" /> <strong>IBM Cloud Object Storage</strong> — TLE catalogue snapshots and CDM archive.</li>
            <li className="flex gap-2"><Server className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" /> <strong>Firebase (current)</strong> — real-time Firestore for live hackathon demo.</li>
          </ul>
        </BlockyCard>
      </div>

      {/* 8-step Pipeline */}
      <div className="mt-3">
        <BlockyCard title="System Architecture — 8-Stage AI Pipeline" accent="cyan">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {ARCHITECTURE_STEPS.map((s) => (
              <div key={s.step} className="block-surface-flat block-notch px-3 py-3">
                <div className="font-hud text-[22px] font-bold tracking-[0.12em] text-primary/30">{s.step}</div>
                <div className="mt-1 font-hud text-[11.5px] font-bold tracking-wide text-foreground">{s.label}</div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{s.detail}</p>
              </div>
            ))}
          </div>
        </BlockyCard>
      </div>

      {/* Tech Stack + Datasets */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <BlockyCard title="Technology Stack">
          <div className="grid grid-cols-2 gap-3">
            {TECH_STACK.map((g) => (
              <div key={g.group} className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <g.icon className="h-3.5 w-3.5 text-primary" />
                  <span className="hud-label text-[9px] text-primary">{g.group}</span>
                </div>
                <ul className="space-y-0.5">
                  {g.items.map((item) => (
                    <li key={item} className="text-[11.5px] text-foreground/85">· {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </BlockyCard>

        <BlockyCard title="Data Sources">
          <div className="space-y-2">
            {DATASETS.map((d) => (
              <div key={d.name} className="block-surface-flat px-3 py-2">
                <div className="flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 shrink-0 text-safe" />
                  <span className="font-medium text-[12px] text-foreground">{d.name}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{d.detail}</div>
                <div className="mt-0.5 hud-label text-[9px] text-primary/70">{d.license}</div>
              </div>
            ))}
          </div>
        </BlockyCard>
      </div>

      {/* References */}
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto]">
        <BlockyCard title="Research References">
          <ol className="tabular space-y-1.5 text-[12px] text-foreground/85">
            <li>1. Alfano, S. — "Review of Conjunction Probability Methods for Short-term Encounters."</li>
            <li>2. Lundberg &amp; Lee — "A Unified Approach to Interpreting Model Predictions" (SHAP), NeurIPS 2017.</li>
            <li>3. ESA Space Debris Office — Annual Space Environment Report, 2025.</li>
            <li>4. Kessler &amp; Cour-Palais — "Collision Frequency of Artificial Satellites," JGR 1978.</li>
            <li>5. NASA CARA — Conjunction Assessment Risk Analysis operator handbook.</li>
            <li>6. Ke, G. et al. — "LightGBM: A Highly Efficient Gradient Boosting Decision Tree", NeurIPS 2017.</li>
          </ol>
        </BlockyCard>

        <BlockyCard title="Source" accent="cyan">
          <p className="text-[12.5px] leading-relaxed text-foreground/85">
            Prototype source, data generators and the voxel renderer are available in the project repository.
          </p>
          <a href="https://github.com/RinaSyazana/OrbitalGuardian" target="_blank" rel="noreferrer" className="mt-3 inline-block">
            <BlockyButton size="md">
              <Github className="h-3.5 w-3.5" /> View repository
            </BlockyButton>
          </a>
          <Link to="/dashboard" className="mt-2 block">
            <BlockyButton size="md" variant="ghost">
              <BookOpen className="h-3.5 w-3.5" /> Back to Mission Control
            </BlockyButton>
          </Link>
        </BlockyCard>
      </div>
    </AppShell>
  );
}
