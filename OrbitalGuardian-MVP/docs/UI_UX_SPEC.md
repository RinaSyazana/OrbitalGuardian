# UI_UX_SPEC.md — OrbitalGuardian AI

> **Frontend Interface Specification — Page-by-Page Component & Interaction Reference**
> Version: 1.1 · Framework: React 19 + TanStack Router + TailwindCSS 4

---

## Design System Summary

| Token | Value | Usage |
|---|---|---|
| Primary accent | `#00e5ff` (electric cyan) | Active states, primary CTAs, HUD labels |
| Danger | `#ef4444` (red) | Critical risk, error states |
| Warning | `#f59e0b` (amber) | Medium risk, warning alerts |
| Safe | `#22c55e` (green) | Low risk, nominal health |
| Background | `#0a0f1a` | Page background (deep space) |
| Panel | `#111827` / glassmorphism | Card surfaces |
| Font: HUD | `Orbitron 700` | Headings, telemetry values |
| Font: Body | `IBM Plex Sans 400/500` | Body text, labels |
| Font: Mono | `IBM Plex Mono 400/500` | Tabular data, COSPAR IDs, timestamps |
| Border | `1px solid rgba(0,229,255,0.12)` | All card borders |

**Component classes used throughout:**
- `BlockyCard` — bordered panel with optional accent bar + title
- `BlockyButton` — HUD-style button (variants: `default`, `primary`, `danger`, `hero`)
- `StatTile` — KPI tile with label, large value, sub-label, and tone color
- `RiskChip` — inline collision risk badge with color-coded percentage
- `SectionHeading` — kicker label + H1 + optional right-side action slot
- `VoxelEarth` — CesiumJS 3D voxel globe with orbit ring markers
- `StatusDot` — pulsing/static dot indicator (safe/warn/danger)

---

## Page 1: Login / Operator Sign-In

**Route:** `/`
**Role access:** Unauthenticated (public — no auth guard)
**Page title:** `OrbitalGuardian AI — Operator Sign-In | Voxel Mission Control`

### Layout & Component Hierarchy

```
<div.starfield>                        ← CSS starfield background animation
  <div.grid-backdrop>                  ← subtle grid overlay (opacity 0.12)
  <VoxelEarth>                        ← 720×720px, right-aligned, opacity 0.80
    markers={allMarkers(undefined, 9)} ← all 8 satellites + 4 debris, no selection
    controls={false}                  ← auto-rotate only, no drag
  <div.z-10>                           ← left-aligned content column
    <Header>
      <span.IBM-badge>IBM</span>       ← "IBM" bordered badge
      <span.hud-label>Space Challenge · August 2026</span>
    <main.max-w-md.animate-hud-in>
      <div.icon-title>
        <Boxes icon / brand icon>
        <h1>ORBITALGUARDIAN <span.cyan>AI</span></h1>
        <p.hud-label>Collision prediction · Decision intelligence</p>
      <p.body-text>                   ← Operator auth context paragraph
      <form.block-surface>
        <label + BlockyInput id="operatorId">    ← Operator ID field
        <label + BlockyInput id="accessKey" type="password"> ← Access key field
        <ErrorBanner>                ← Conditional: AlertTriangle + message
        <BlockyButton type="submit" variant="hero">Access Mission Control →</BlockyButton>
        <p.fine-print>Authorised personnel only · All sessions are logged</p>
    <footer.hud-label>Sector 4 ground segment · link nominal · latency 42 ms</footer>
```

### Data Mapping & API Binding

| Component | Data source | Binding |
|---|---|---|
| `VoxelEarth` | `allMarkers(undefined, 9)` | Static — all satellite + debris markers from `lib/orbit.ts` |
| Error banner | Local state `error: string` | Set on invalid credential submit |
| Footer latency | Hardcoded string | `"42 ms"` — cosmetic HUD decoration |

No backend API calls on this page. Authentication is client-side only (MVP).

### Interactive States & UX Logic

**Loading state:** None — page renders synchronously; VoxelEarth canvas draws in ~200 ms.

**Empty state:** Not applicable (form always visible).

**Error state:**
- Wrong credentials: `error` state → red inline banner with `AlertTriangle` icon.
- `setError("")` called on any input change to clear the banner immediately.

**Success feedback:**
- Valid submit → `sessionStorage.setItem("og_auth", "1")` → `navigate({ to: "/dashboard" })`.
- TanStack Router transition: instant client-side navigation, no page reload.

**Validation rules:**
- No empty-field prevention in MVP (submitting blank shows invalid credential error).
- Password field uses `type="password"` — browser default masking.

---

## Page 2: Mission Control Dashboard

**Route:** `/dashboard`
**Role access:** `operator` — guarded by `sessionStorage.og_auth === "1"` check in `AppShell`.
**Page title:** `Mission Control — OrbitalGuardian AI`

### Layout & Component Hierarchy

```
<AppShell>                             ← Sidebar nav + topbar wrapper
  <SectionHeading kicker="Mission Control" title="Orbital Traffic Overview">
    <BlockyButton>Refresh catalogue</BlockyButton>
    <Link to="/analysis/$satId"><BlockyButton variant="primary">Open conjunction</BlockyButton></Link>

  <div.grid-4-cols>                    ← 4-column KPI grid
    <StatTile label="Active satellites" value={n} sub="in fleet" tone="info"/>
    <StatTile label="Tracked debris" value="28,411" sub="+341/24h" tone="warn"/>
    <StatTile label="High-risk events" value={highRisk} sub="risk ≥ 60%" tone="danger"/>
    <StatTile label="Avg collision risk" value={avgRisk%} sub="fleet-wide" tone="warn"/>
    <StatTile label="AI model status" value="Healthy" sub="LightGBM v3.2 · 96.4%" tone="safe"/>
    <StatTile label="Predictions today" value="1,284" sub="avg 0.12 s" tone="info"/>

  <div.grid-2-cols>                    ← Main content 2-col (3:1 ratio on xl)
    <div.left-col>
      <BlockyCard title="Voxel Earth — live orbital traffic" accent="cyan">
        <VoxelEarth
          markers={allMarkers(selected)}  ← selected sat highlighted
          onSelectMarker={setSelected}    ← click changes selection
          className="h-[560px]"
        />
        <SelectedAssetOverlay>           ← Absolute positioned HUD card top-left
          sat.name, sat.cospar, sat.orbit, sat.inclination, sat.lastPing
          <RiskChip risk={sat.risk}/>
        <BlockyButton variant="primary">Analyse {sat.name}</BlockyButton>  ← bottom-right

      <div.grid-2-cols>
        <SpaceWeatherWidget/>            ← Geomagnetic index, solar wind, G-band
        <AiHealthWidget/>               ← Model version, accuracy, last retrain

    <div.right-col>
      <BlockyCard title="Mission timeline — live">
        <TimelineFeed/>                  ← Firestore alerts rendered as timeline
      <AlertsPanel/>                    ← Severity-colored alert cards
```

### Data Mapping & API Binding

| Component | Collection / Endpoint | Binding | Update mode |
|---|---|---|---|
| `StatTile` × 6 | `satellites` collection | Derived: count, filter, reduce | Firestore `onSnapshot` (realtime) |
| `VoxelEarth` | `lib/orbit.ts allMarkers()` | Satellite IDs + risk levels for marker coloring | Re-render on `selected` change |
| `SelectedAssetOverlay` | `satellites` snapshot | `sat.name`, `cospar`, `orbit`, `inclination`, `lastPing`, `risk` | Realtime |
| `SpaceWeatherWidget` | Static / mock (MVP) | Hardcoded G2 storm indicator | — |
| `AiHealthWidget` | `satellites[].predictionStatus`, `alerts` | LightGBM version + accuracy from seeded data | Realtime |
| `TimelineFeed` | `alerts` collection | Alert documents sorted by timestamp | Firestore `onSnapshot` |
| `AlertsPanel` | `alerts` collection | All alerts, severity → color map | Firestore `onSnapshot` |

### Interactive States & UX Logic

**Loading state:**
- KPI tiles: render with `0` / `"..."` until first Firestore snapshot arrives (< 300 ms).
- VoxelEarth: shows black canvas with animated orbit lines while WebGL context initializes.
- No explicit skeleton loader — Firestore cache provides near-instant initial data.

**Satellite selection:**
- Click a VoxelEarth marker → `setSelected(id)` → `SelectedAssetOverlay` updates.
- "Open conjunction" button links to `/analysis/${selected}`.

**Empty state:** If `satellites.length === 0` after 3 s: StatTiles show `"—"`. (Firestore offline fallback.)

**Error state:** None explicit — Firestore offline mode silently uses cached data.

**Success feedback:** `RiskChip` and `StatTile` animate value changes via CSS `transition-all`.

---

## Page 3: Collision Analysis

**Route:** `/analysis/:satId`
**Role access:** `operator`
**Page title:** `Collision Analysis | OrbitalGuardian AI`

### Layout & Component Hierarchy

```
<AppShell>
  <SectionHeading kicker="Conjunction assessment" title="{sat.name} vs {debris.name}">
    <Chip>TCA: {CONJUNCTION.tcaUtc}</Chip>
    <BlockyButton onClick={triggerPrediction} loading={triggering}>Re-run AI</BlockyButton>
    <Link to="/sandbox/$satId"><BlockyButton variant="primary">Open sandbox</BlockyButton></Link>

  <div.grid-3-cols>                    ← Top KPI row
    <StatTile label="Collision probability" value={probability%} tone={riskTone}/>
    <StatTile label="Miss distance" value={missDistanceM m} tone="warn"/>
    <StatTile label="Relative velocity" value={relVelocity km/s} tone="info"/>
    <StatTile label="Confidence" value={confidence%} tone="safe"/>
    <StatTile label="Altitude delta" value={altDelta km} tone="info"/>
    <StatTile label="Incl. delta" value={inclDelta°} tone="info"/>

  <div.grid-2-cols>
    <div.left-col>
      <BlockyCard title="Conjunction geometry" accent="cyan">
        <VoxelEarth
          markers={[satelliteMarker(sat), debrisMarker(debris)]}
          ← Selected sat + threatening debris only
        />

      <BlockyCard title="SHAP explanation — top factors">
        <VoxelBarChart data={SHAP_FACTORS}/>  ← Horizontal bar chart, cyan bars
        <SHAP_NARRATIVE paragraph/>           ← Plain-language AI explanation

    <div.right-col>
      <BlockyCard title="AI recommendation" accent="danger/warn/safe based on priority">
        <PriorityBadge priority={RECOMMENDATION.priority}/>
        <h2>{RECOMMENDATION.action}</h2>
        <p>{RECOMMENDATION.rationale}</p>
        <DataRow label="Fuel required" value={fuelKg kg}/>
        <DataRow label="Delta-V" value={deltaV m/s}/>
        <DataRow label="Expected new risk" value={newRisk%}/>
        <DataRow label="Window closes in" value={windowClosesIn}/>
        <DataRow label="Maneuver confidence" value={confidence%}/>
        <ConfidenceMeter value={RECOMMENDATION.confidence}/>
        <BlockyButton variant="danger/primary">Commit maneuver</BlockyButton>

      <BlockyCard title="Conjunction data">
        <DataRow label="TCA" value={CONJUNCTION.tcaUtc}/>
        <DataRow label="Screened pairs" value={screenedPairs.toLocaleString()}/>
        <DataRow label="Covariance uncertainty" value={uncertainty m}/>
        <DataRow label="Model" value={CONJUNCTION.model}/>
        <DataRow label="Inference time" value={inferenceMs ms}/>
```

### Data Mapping & API Binding

| Component | Source | Fields | Mode |
|---|---|---|---|
| Top 6 `StatTile` | `events/{satId}.CONJUNCTION` | `probability`, `missDistanceM`, `relativeVelocityKms`, `confidence`, `altitudeDeltaKm`, `inclinationDeltaDeg` | Firestore `onSnapshot` (realtime) |
| `VoxelEarth` | `satellites/{satId}` + `debris/deb-1` | `altitudeKm`, `ringTilt`, `ringPhase` | Realtime snapshot |
| `VoxelBarChart` | `events/{satId}.SHAP_FACTORS` | `label`, `contribution`, `direction` | Realtime |
| SHAP narrative | `events/{satId}.SHAP_NARRATIVE` | Full narrative string | Realtime |
| Recommendation card | `events/{satId}.RECOMMENDATION` | All recommendation fields | Realtime |
| `ConfidenceMeter` | `RECOMMENDATION.confidence` | 0–100 | Realtime |
| "Re-run AI" button | `GET /api/trigger_prediction?sat_id={satId}` | Triggers fresh inference | On click |
| Page auto-trigger | `GET /api/trigger_prediction?sat_id={satId}` | Fresh inference on mount | `useEffect([satId])` |

### Interactive States & UX Logic

**Loading state (initial):**
- Full-page: `<div className="flex h-screen items-center justify-center text-primary font-mono text-xl animate-pulse">Connecting to live Firebase AI Database...</div>`
- Shown until `sat && debris && aiData` all truthy (typically < 300 ms with cached Firestore data).

**Loading state (re-run):**
- `triggering === true` → "Re-run AI" button shows spinner icon + disabled state.
- StatTiles retain last-known values during re-trigger; no flicker.

**Error state:**
- Backend unreachable: silent catch; existing Firestore snapshot data remains displayed.
- Toast (planned): "Backend offline — showing last prediction."

**Success feedback:**
- New prediction arrives via `onSnapshot` → all StatTiles and VoxelBarChart update with CSS transition.
- `CountUp` animation on probability number (0 → final value over 800 ms).

---

## Page 4: Satellite Monitoring Fleet View

**Route:** `/monitoring`
**Role access:** `operator`
**Page title:** `Satellite Monitoring — OrbitalGuardian AI`

### Layout & Component Hierarchy

```
<AppShell>
  <SectionHeading kicker="Fleet" title="Satellite Monitoring">
    <span>{rows.length} of {total} assets shown</span>

  <div.filter-bar>
    <BlockyInput placeholder="Search asset, mission or operator…" icon={Search}/>
    <BlockyButton variant={onlyRisky ? "primary" : "default"} onClick={toggleRisky}>
      <SlidersHorizontal/> Risk ≥ 25%

  <div.table-container>
    <HeaderRow cols=["Satellite", "Mission", "Operator", "Orbit", "Health", "Collision risk", ""]/>
    {rows.map(s =>
      <SatelliteRow
        key={s.id}
        animationDelay={index * 35ms}            ← staggered entry animation
        cols=[
          [s.name, s.cospar],                   ← Bold name + mono COSPAR
          s.mission,
          s.operator,
          s.orbit,                              ← e.g. "LEO · 1336 km"
          <StatusDot tone={health.tone} pulse={!nominal}/> + health.label,
          <RiskChip risk={s.risk}/>,
          <BlockyButton variant={risk>=60?"danger":"default"}>Mission Control</BlockyButton>
        ]
      />
    )}
    {rows.length === 0 && <BlockyCard><p>No assets match this filter.</p></BlockyCard>}
```

### Data Mapping & API Binding

| Component | Collection | Fields | Mode |
|---|---|---|---|
| Satellite rows | `satellites` collection | All satellite fields | Firestore `onSnapshot` |
| Row count header | Local state `rows.length` / `satellites.length` | Filter results | Derived from snapshot |
| Search filter | Local state `q: string` | `name`, `operator`, `mission` substring match | `useMemo` (client-side) |
| Risk filter toggle | Local state `onlyRisky: boolean` | `risk >= 25` | `useMemo` (client-side) |
| `RiskChip` | `satellites[].risk` | 0–100 | Realtime |
| `StatusDot` | `satellites[].health` | `nominal/degraded/critical` | Realtime |

### Interactive States & UX Logic

**Loading state:** Rows animate in with `animate-block-in` + staggered `animationDelay`. If Firestore snapshot not yet received: table is empty (no skeleton — data arrives in < 300 ms from cache).

**Empty state:** `<BlockyCard>No assets match this filter.</BlockyCard>` — shown when search + filter yield zero results.

**Error state:** None explicit in MVP — Firestore offline returns cached rows.

**Success feedback:**
- Risk filter toggle: `BlockyButton` switches `variant="primary"` (cyan) when active.
- Rows cascade in with 35 ms stagger per row on initial load.
- "Mission Control" button turns `variant="danger"` (red) when `risk >= 60`.

---

## Page 5: Mission Sandbox — Maneuver Decision Simulator

**Route:** `/sandbox/:satId`
**Role access:** `operator`
**Page title:** `Mission Sandbox — Maneuver Decision Simulator | OrbitalGuardian AI`

### Layout & Component Hierarchy

```
<AppShell>
  <Breadcrumbs links={[Dashboard, Analysis, Sandbox]}/>
  <SectionHeading kicker="Maneuver simulator" title="{sat.name} · Avoidance Sandbox">
    <BlockyButton onClick={resetScenario}><RotateCcw/> Reset</BlockyButton>
    <BlockyButton onClick={saveScenario}><Save/> Save scenario</BlockyButton>

  <div.grid-3-cols>
    <StatTile label="Current risk" value={currentRisk%} tone={riskTone} icon={Gauge}/>
    <StatTile label="Delta-V" value={deltaV m/s} tone="info" icon={Rocket}/>
    <StatTile label="Fuel" value={fuel kg} tone="warn" icon={Fuel}/>
    <StatTile label="Exec. window" value={execMin min} tone="info" icon={Timer}/>
    <StatTile label="Mission score" value={score/100} tone="safe" icon={ShieldCheck}/>
    <StatTile label="Separation" value={separationM m} tone="info"/>

  <div.grid-2-cols>
    <div.left-col>
      <BlockyCard title="Orbit adjustment — drag to retarget" accent="cyan">
        <VoxelEarth
          markers={[satelliteMarker(sat, scenario), debrisMarker(debris)]}
          onOrbitDrag={handleDrag}    ← Pointer-drag changes scenario.altitudeKm
          className="h-[480px]"
        />
        <AltitudeSlider min={200} max={40000} value={scenario.altitudeKm}/>

      <BlockyCard title="Scenario comparison">
        <div.grid-3-cols>
          {["Raise +12km", "Lower -7km", "Phase shift"].map(s => <ScenarioCard .../>)}

    <div.right-col>
      <BlockyCard title="Maneuver parameters">
        <DataRow label="Target altitude" value={scenario.altitudeKm km}/>
        <DataRow label="Altitude change" value={Δalt km}/>
        <DataRow label="Burn direction" value={prograde/retrograde}/>
        <DataRow label="Execution time" value={execMin min}/>
        <DataRow label="Fuel cost" value={fuel kg}/>
        <DataRow label="New collision risk" value={newRisk%}/>
        <ConfidenceMeter value={scenarioConfidence}/>

      <BlockyCard title="Commit sequence" accent="danger">
        <CommitStages stages={COMMIT_STAGES} current={commitStage}/>  ← 5-step progress
        <BlockyButton variant="danger" onClick={commitManeuver}>
          <Rocket/> Commit maneuver
        <p.fine-print>This action is logged and irreversible. Dual sign-off required.</p>
```

### Data Mapping & API Binding

| Component | Source | Fields | Mode |
|---|---|---|---|
| `sat` state | `doc(db, "satellites", satId)` via `getDoc` | All satellite fields | One-shot on mount |
| `debris` state | `doc(db, "debris", "deb-1")` via `getDoc` | Debris fields | One-shot on mount |
| `StatTile` risk | `predictRisk(scenario)` | Computed from scenario state | Local computation |
| `StatTile` fuel | `estimateFuel(scenario)` | Computed | Local computation |
| `StatTile` delta-V | `estimateDeltaV(scenario)` | Computed | Local computation |
| `StatTile` exec window | `estimateExecutionMin(scenario)` | Computed | Local computation |
| `StatTile` mission score | `missionScore(scenario)` | Composite score formula | Local computation |
| Commit action | `addDoc(collection(db, "history"), payload)` | New history record | On commit click |
| Save scenario | `toast.success("Scenario saved")` | Local Sonner toast | On save click |

### Interactive States & UX Logic

**Loading state:**
- `sat === null || debris === null`: Full-page pulse: `"Loading satellite data..."`.
- Data arrives via `getDoc` in ~200 ms.

**Drag interaction:**
- Pointer drag on VoxelEarth orbit ring → `onOrbitDrag(newAltKm)` → `setScenario({...scenario, altitudeKm: newAltKm})`.
- All 6 StatTiles recompute in < 16 ms (synchronous local math functions).
- VoxelEarth orbit ring re-renders to new radius: `orbitRadius(altitudeKm)`.

**Scenario comparison cards:**
- Three preset scenarios shown (Raise +12 km, Lower -7 km, Phase shift 40°).
- Click selects scenario → `setScenario(scenarioFrom("raise" | "lower" | "phase"))`.
- Active card has cyan border; inactive cards have default border.

**Commit flow:**
- Click "Commit maneuver" → sets `commitStage = 1`.
- `CommitStages` animates through 5 stages over 5 × 800 ms intervals.
- On completion: `addDoc(db, "history", {...})` → `toast.success("Maneuver committed — residual risk {newRisk}%")`.
- Navigate back to `/analysis/${satId}` after 2 s delay.

**Reset:**
- `resetScenario()` → `setScenario(scenarioFrom("current", sat))` — returns to sat's current orbital parameters.

**Error state:**
- Firestore write failure: `toast.error("Failed to log maneuver. Please try again.")`.

---

## Page 6: Mission History & Replay

**Route:** `/history`
**Role access:** `operator`
**Page title:** `Mission History & Replay — OrbitalGuardian AI`

### Layout & Component Hierarchy

```
<AppShell>
  <SectionHeading kicker="Audit log" title="Mission History & Replay"/>

  <div.grid-3-cols>                    ← Summary KPIs
    <StatTile label="Total events" value={history.length}/>
    <StatTile label="Avoidances" value={avoided count} tone="safe"/>
    <StatTile label="Avg risk reduction" value={avgReduction%} tone="info"/>

  <div.event-list>
    {history.map(record =>
      <AccordionItem
        key={record.id}
        header={
          <div.grid-5-cols>
            <RiskChip risk={record.risk}/> → <RiskChip risk={record.finalRisk}/>
            {record.satellite}
            {record.action}
            {record.outcome badge}
            {record.date}
          </div>
        }
        isOpen={open === record.id}
        onToggle={setOpen}
      >
        <div.expanded-content>
          <VoxelEarth markers={...} className="h-[200px]"/>  ← Mini globe replay
          <p.narrative>{record.narrative}</p>
          <div.steps-timeline>
            {record.steps.map(step =>
              <TimelineStep label={step.label} detail={step.detail} time={step.time}/>
            )}
          <BlockyButton onClick={replay}><Play/> Replay prediction</BlockyButton>
```

### Data Mapping & API Binding

| Component | Collection | Fields | Mode |
|---|---|---|---|
| History accordion | `history` collection | All history fields | Firestore `onSnapshot` |
| Summary KPI tiles | Derived from `history` array | `length`, filter by outcome, reduce risk delta | `useMemo` |
| Mini `VoxelEarth` | `history[].satId` → satellite orbit params | `ringTilt`, `ringPhase`, `altitudeKm` | From history record |
| Replay button | No backend call (MVP) | Opens analysis page: `navigate("/analysis/" + record.satId)` | On click |

### Interactive States & UX Logic

**Loading state:** Accordion renders empty; Firestore snapshot arrives in < 300 ms.

**Accordion expand:**
- First record auto-expanded on mount (`open = records[0].id`).
- Expand: `ChevronDown` icon rotates 180° via `cn(open ? "rotate-180" : "")` CSS transition.
- One open at a time; clicking same header collapses it.

**Replay button:** Navigates to `/analysis/${record.satId}` — triggers fresh AI prediction for that satellite.

**Empty state:** Not rendered in current design (history always seeded). Future: "No conjunction events recorded yet."

---

## Page 7: About / XAI Explainer

**Route:** `/about`
**Role access:** Public (no auth guard)
**Page title:** `About OrbitalGuardian AI — Explainable AI for Space Traffic Management`

### Layout & Component Hierarchy

```
<AppShell>
  <SectionHeading kicker="Platform overview" title="About OrbitalGuardian AI"/>

  <div.hero-section>
    <VoxelEarth markers={allMarkers()} className="h-[300px]"/>
    <p.mission-statement>Explainable Decision Intelligence for Space Traffic Management...</p>

  <div.tech-cards>
    <BlockyCard title="AI Model — LightGBM">Technical description + metrics</BlockyCard>
    <BlockyCard title="Explainability — SHAP">SHAP explanation methodology</BlockyCard>
    <BlockyCard title="Rule Engine">Recommendation system rationale</BlockyCard>
    <BlockyCard title="Data Sources">CelesTrak, Kaggle, SOCRATES</BlockyCard>

  <div.architecture-diagram>...</div>  ← System architecture illustration

  <div.team-section>IBM AI Builders Challenge 2026 attribution</div>
```

### Data Mapping & API Binding
All content static — no API calls, no Firestore subscriptions. Page serves as documentation.

### Interactive States
- **No loading state** — fully static content.
- Internal anchor links (`#ai-model`, `#xai`, `#datasets`) for navigation.

---

## AppShell (Shared Layout)

Applied to all authenticated pages (`/dashboard`, `/analysis/*`, `/monitoring`, `/sandbox/*`, `/history`, `/about`).

```
<AppShell>
  <Sidebar>
    <Logo: Boxes icon + "ORBITALGUARDIAN AI">
    <NavItems>
      - <NavLink to="/dashboard">Mission Control</NavLink>
      - <NavLink to="/monitoring">Satellite Monitoring</NavLink>
      - <NavLink to="/history">History & Replay</NavLink>
      - <NavLink to="/about">About</NavLink>
    <SessionInfo: operator name from sessionStorage>
    <LogoutButton: clears sessionStorage, navigate("/">
  <main.content-area>
    {children}   ← Route <Outlet/>
```

**Auth guard:** `AppShell` checks `sessionStorage.getItem("og_auth") !== "1"` → redirects to `/` via `useNavigate`.

**Active nav state:** TanStack Router `Link` receives `data-status="active"` attribute → cyan left border + brighter text.
