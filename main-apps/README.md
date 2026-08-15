# Orbital Command Blocks

OrbitalGuardian AI — Lovable Build Prompt
"Voxel Mission Control" — a blocky, Minecraft-inspired space operations UI

Copy everything below into Lovable as your build prompt.

ROLE

You are a senior Space Systems UI/UX Engineer with 10+ years designing mission-control software for aerospace and defense (think NASA JPL ops rooms, ESA control centers, IBM enterprise AI dashboards). You also have a deep love for voxel/blocky aesthetics (Minecraft, Crossy Road, LEGO Ideas). Your job is to fuse those two worlds into one cohesive, believable product: a satellite collision-prediction and decision-support platform that looks like it was designed by a AAA game studio but functions like real operator software.

Do not make it look like a toy. The voxel language is a skin on top of serious, data-dense, enterprise-grade UX — like a mission-control room built entirely out of LEGO bricks by people who take orbital mechanics very seriously.

PRODUCT CONCEPT

Name: OrbitalGuardian AI Context: Built for an IBM hackathon, "Space Challenge" track (August theme). What it does: Predicts satellite collision risk using AI, explains the prediction with SHAP-based reasoning, recommends an avoidance maneuver, and lets the operator simulate different maneuvers before committing — turning "AI prediction" into "AI decision intelligence."

Core narrative the demo must tell:

Operator opens the Dashboard → sees live orbital traffic on a voxel Earth.
Selects a satellite → AI predicts 92% collision risk.
SHAP panel explains why in plain language.
AI recommends "Raise Orbit."
Operator opens the Mission Sandbox → drags the orbit path on the voxel Earth → risk recalculates live (92% → 8%).
Operator compares 2–3 scenarios side by side and commits to one.
VISUAL DESIGN LANGUAGE
The big idea

A voxel/cubed Earth (like a Minecraft globe built from stacked green/blue/white blocks — continents, oceans, ice caps, clouds, all rendered as chunky 3D cubes) sits at the center of the experience. It rotates slowly in the Dashboard and becomes fully interactive in the Collision Analysis and Mission Sandbox views. Satellites and debris are small blocky/voxel models orbiting around it on visible ring paths, like pieces on a game board. Everything else — panels, cards, charts, buttons — uses a flat, chunky, beveled "block" style: slightly thick borders, hard drop shadows (no soft blur — think pixel-art shadows offset 4-6px), and a restrained low-poly/voxel iconography.

Think: "NASA mission control, rebuilt in Minecraft, run by IBM."

Aesthetic pillars
Voxel Earth: cube-based globe, continents built from green/brown blocks, oceans in layered blue voxels, white cloud/ice clusters — exactly like the reference cube-Earth image. It should feel touchable: draggable to rotate, scrollable to zoom, with a subtle idle rotation when not being touched.
Blocky chrome, serious data: cards, buttons, nav items, and modals have visible pixel-corner or beveled-edge styling (2-4px "step" corners instead of smooth border-radius, or a very small 4px radius with a hard 1px dark outline) — never soft glassmorphism.
Orbit rings as UI: satellites move along visible circular/elliptical guide rings around the voxel Earth. Debris fields appear as small red/gray voxel clusters.
Glow = data, not decoration: use neon-cyan/amber glow sparingly and only to mean something (active alert, selected satellite, live prediction) — this keeps it from tipping into "kids' game" territory.
Color palette
Background: deep space navy/near-black gradient (
#05060F → 
#0B0F2A), with sparse pixel-dot starfield.
Primary accent: electric cyan (
#22D3EE) — AI/data elements, active states.
Secondary accent: amber/orange (
#F59E0B) — warnings, risk indicators.
Danger: voxel red (
#EF4444) — high collision risk, debris.
Safe/success: voxel green (
#4ADE80) — low risk, healthy status.
Panel surfaces: dark slate blocks (
#12172E, 
#1A2140) with a 1-2px lighter top edge to fake a "brick bevel" (like a Minecraft block highlight).
Earth voxels: ocean blues (
#1E5FA8, 
#2E7FD1), land greens/browns (
#4C8C3A, 
#8A6E45), cloud/ice white (
#F1F5F9).
Typography
Headings: a blocky/geometric monospace or pixel-adjacent sans (e.g. "Press Start 2P" only for tiny accent labels/badges — NOT body text, it's unreadable at scale) OR a bold geometric grotesk (e.g. Space Grotesk, Rajdhani, Orbitron) for a "sci-fi HUD" feel without sacrificing legibility.
Body/data: clean readable sans (Inter, IBM Plex Sans) — this is where the "enterprise-grade" trust comes from. Never use pixel fonts for dense data or paragraphs.
Numbers/telemetry: tabular/monospace figures (IBM Plex Mono) for all percentages, coordinates, timestamps — reinforces the "real instrumentation" feel.
Iconography & motion
Icons: simple voxel/isometric-cube style glyphs where possible (satellite, debris, alert, fuel, orbit) — fall back to a clean line-icon set (Lucide) recolored to fit if custom voxel icons aren't feasible in the prototype.
Motion: snap/step transitions (150-200ms, ease-out, slight "block settling" feel) rather than smooth elastic easing — reinforces the discrete, chunky material language. Orbit rotation itself should be smooth (real physics), contrasting nicely with the snappy UI chrome.
INFORMATION ARCHITECTURE
Login (Operator Authentication)
   └── Dashboard (Mission Control)
        ├── Satellite Monitoring
        ├── Collision Analysis  ⭐ hero screen
        │     └── Mission Sandbox (simulation mode)
        ├── Mission History (with Mission Replay)
        └── About
PAGE-BY-PAGE SPEC
1. Login
Full-bleed starfield background with the voxel Earth slowly rotating, small and distant, top-right or center.
IBM badge/logo placement (top-left), OrbitalGuardian AI wordmark in the blocky HUD font.
Simple email/password fields styled as blocky input "slots," one primary cyan CTA button ("Access Mission Control").
Subtle boot-up animation on load (HUD lines drawing in, like a terminal powering on) — keep under 1.5s, don't block the demo.
2. Dashboard — "Mission Control" (hero landing screen)

Center-stage: the voxel Earth, large, interactive (drag to rotate, scroll/pinch to zoom), with:

Satellites as small blocky models on visible orbit rings, color-coded by risk (green/amber/red).
Debris as small gray/red voxel clusters.
Clicking a satellite highlights it and shows a floating blocky tooltip card (name, orbit, risk %).

Surrounding panel grid (widgets, all blocky cards on a dark HUD grid):

KPI strip: Active Satellites / Tracked Debris / High-Risk Events / Model Accuracy — big tabular numbers.
Space Weather widget: Solar Activity, KP Index (e.g. "6 — High," with a small warning tag "⚠ Increased orbital uncertainty"), Geomagnetic Storm status.
AI Health Status widget: "AI Prediction Model — Healthy," Model Accuracy 96%, "Last updated 2 mins ago" with a pulsing green dot.
Mission Timeline (live feed): vertical stepped timeline — "14:20 Prediction Started → 14:21 Collision Risk: High → 14:22 Recommendation Generated" — new entries slide in from the top.
Alerts panel: stacked blocky alert cards, red/amber left-edge accent bar by severity.
3. Satellite Monitoring
Data table styled as stacked "blocks"/rows with a subtle bevel between rows (not plain lines).
Columns: Satellite · Mission · Operator · Orbit · Health · Collision Risk · Prediction.
Risk column uses a small voxel-pixel bar or colored block chip (green/amber/red), not just text.
Row action button labeled "Mission Control" (not "View Details") — opens Collision Analysis for that satellite.
Filter/search bar at top styled as a blocky HUD input.
4. Collision Analysis — the hero/demo screen

Four-zone layout:

A — Satellite Info (top strip or left column): name, orbit type, operator, last telemetry ping.
B — 3D Earth viewport (center, largest area): the voxel Earth zoomed to the relevant orbital region, showing the satellite, the debris object, their converging paths, and the projected collision point marked with a pulsing red voxel marker.
C — Prediction panel: Collision Probability (92%, large type), Confidence (96%), AI Model (XGBoost), Inference Time (0.12s) — displayed as a small grid of blocky stat tiles.
D — Recommendation panel: Action ("Raise Orbit"), Estimated Fuel (2.1 kg), Estimated New Risk (4%), Priority (Critical, red chip), Execution Window (14:35 UTC).

SHAP explainability panel: horizontal bar chart of top factors (Closest Distance, Relative Velocity, Altitude Difference, Inclination Difference) rendered as stacked voxel-block bars (each bar literally built from small cube segments, filling like a Minecraft health bar) — plus a plain-language sentence underneath explaining the prediction in natural language.

Primary CTA: a prominent button labeled "Open Mission Sandbox" — this is the centerpiece feature, make it visually unmissable (glowing cyan, slightly larger than other buttons).

5. Mission Sandbox (a.k.a. "Collision Simulation Lab")

This is the single most important screen for wowing judges — build it with the most care.

The voxel Earth becomes fully interactive: the operator can grab and drag the satellite's orbit path (a visible ring/arc) to a new altitude.
As they drag, a live-updating readout shows Before → After risk (e.g. "92% → 12%") with the number animating down in real time (mock this with a simple formula tied to drag distance — it doesn't need real physics for a prototype).
Below/beside the 3D view: a scenario comparison panel letting the operator save up to 3 scenarios side by side:
Scenario A — Raise Orbit — Risk 8% — Fuel 2.0 kg
Scenario B — Lower Orbit — Risk 12% — Fuel 1.4 kg
Scenario C — No Action — Risk 92%
Each scenario is a blocky card; the operator can select one and hit "Commit Maneuver."
Small animated sequence on commit: Current Orbit → Debris → Collision Point → Avoidance Burn → New Orbit, played out on the voxel globe (can be a simple keyframed camera/marker animation, doesn't need to be physically simulated).
6. Mission History
Timeline/list of past predictions, each expandable into a Mission Replay: Prediction → Explanation → Recommendation → Animation, replayed in the same voxel-Earth viewport used in Collision Analysis.
Each history entry is a blocky card with a thumbnail snapshot of the Earth view at time of prediction.
7. About
Keep minimal: Architecture, AI/Datasets, IBM alignment blurb, Research References, GitHub link. Same blocky card styling, lighter on data density than other pages.
COMPONENT SYSTEM TO BUILD
VoxelEarth — the core 3D component (rotate, zoom, orbit rings, satellite/debris markers, draggable orbit path in Sandbox mode).
StatTile — blocky stat card (label, big tabular number, optional trend/status dot).
RiskChip — colored voxel-style badge (green/amber/red) for risk level.
VoxelBarChart — SHAP factor bars built from stacked cube segments.
TimelineFeed — vertical stepped event timeline with slide-in animation.
AlertCard — left-accent-bar alert block.
ScenarioCard — sandbox comparison card with select state.
BlockyButton / BlockyCard / BlockyInput — base primitives with the beveled/stepped-corner style, used everywhere for consistency.
TECHNICAL NOTES FOR THE PROTOTYPE
Use mock/static data — no real ML backend needed; simulate the "AI prediction" with a simple weighted formula so numbers respond believably to Sandbox interactions.
The 3D Earth can be built with Three.js/React Three Fiber using instanced cube geometry for the voxel look (a low-res cube-sphere of blocks), or — if time-constrained for the prototype — a stylized 2.5D/isometric SVG/CSS version that reads as voxel and is draggable, as a fallback that still sells the concept.
Fully responsive, but optimize primarily for a 16:9 desktop demo view since this will be presented live to judges.
Prioritize build order: Dashboard → Collision Analysis → Mission Sandbox first (these carry the demo). Satellite Monitoring, Mission History, About, and Login can be simpler/lower-fidelity.
TONE CHECK

If at any point a screen looks like a children's game menu, pull back: add more real data density, tighten the type scale, use more restrained color, and let the voxel language live mainly in the Earth/satellite visuals and card bevels — not in every UI element. The goal is "operator software that happens to be built from blocks," not "a Minecraft mod."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://voxel-orbit-guard.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d96de1c0-9fbf-430a-b6e6-20beb6e10c94).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
