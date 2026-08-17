# 🛰️ OrbitalGuardian AI

> ### Explainable Decision Intelligence for Safer Space Traffic Management
>
> **Because every second matters in orbit.**

[![IBM AI Builders Challenge 2026](https://img.shields.io/badge/IBM-AI%20Builders%20Challenge%202026-1261FE?logo=ibm&logoColor=white)](#-ibm-ai-builders-challenge)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=111827)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![LightGBM](https://img.shields.io/badge/ML-LightGBM-9ACD32?logo=lightgbm&logoColor=111827)](https://lightgbm.readthedocs.io/)
[![SHAP](https://img.shields.io/badge/XAI-SHAP-FF6F00?logoColor=white)](https://shap.readthedocs.io/)
[![IBM Granite](https://img.shields.io/badge/GenAI-IBM%20Granite-1261FE?logo=ibm&logoColor=white)](https://www.ibm.com/granite)
[![LangChain](https://img.shields.io/badge/Orchestration-LangChain-1C3D3A?logo=langchain&logoColor=white)](https://www.langchain.com/)
[![Firebase](https://img.shields.io/badge/Realtime-Firebase-FFCA28?logo=firebase&logoColor=111827)](https://firebase.google.com/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Table of Contents

- [At a Glance](#at-a-glance)
- [Problem Statement](#problem-statement)
- [Target Users](#target-users)
- [The Core Idea](#the-core-idea)
- [AI Architecture](#ai-architecture)
- [Collision-Risk Prediction — LightGBM](#collision-risk-prediction-lightgbm)
- [Explainability — SHAP](#explainability-shap)
- [Generative AI — IBM Granite + LangChain](#generative-ai-ibm-granite--langchain)
- [Recommendation Engine](#recommendation-engine)
- [3D Situational Awareness](#3d-situational-awareness)
- [Real-Time System Architecture](#real-time-system-architecture)
- [Data & Dataset Provenance](#data--dataset-provenance)
- [AI Inference Example](#ai-inference-example)
- [Data Model & Auditability](#data-model--auditability)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Human-in-the-Loop & Safety Philosophy](#human-in-the-loop--safety-philosophy)
- [IBM AI Builders Challenge](#ibm-ai-builders-challenge)
- [Demo & Project Resources](#demo--project-resources)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Documentation](#project-documentation)
- [Team Five42](#team-five42)
- [License](#license)
- [The Takeaway](#the-takeaway)

---

## ⚡ At a Glance

**OrbitalGuardian AI** is a prototype Space Traffic Management (STM) decision-support platform that combines **machine learning, explainable AI, generative AI, orbital data, and interactive 3D visualization** into one operator workflow.

Instead of asking an operator to interpret a mysterious collision score, OrbitalGuardian answers three questions in sequence:

> **1. How risky is the conjunction? → 2. Why is it risky? → 3. What should the operator consider doing?**

| Capability | What OrbitalGuardian delivers |
|---|---|
| 🎯 **Risk Prediction** | LightGBM-based binary classification for collision-risk probability |
| 🔎 **Explainability** | SHAP TreeExplainer ranks the factors driving each prediction |
| 🧠 **AI Narrative** | IBM Granite + LangChain turns technical evidence into an operator-friendly explanation |
| 🛠️ **Maneuver Support** | Deterministic rule-based recommendations with fuel, delta-V and expected residual risk |
| 🌍 **3D Situational Awareness** | CesiumJS-based orbital visualization and fleet monitoring |
| 📡 **Realtime Operations** | Firebase Firestore `onSnapshot` streaming for live UI updates in the MVP |
| 🧾 **Auditability** | Alerts, prediction events and mission history support human review and post-action analysis |
| 👤 **Human-in-the-Loop** | AI recommends; the human operator remains the final decision-maker |

---

## 🏆 Why This Project Matters

The hard part of Space Traffic Management is not simply producing another probability score. The real challenge is converting complex conjunction information into a **fast, understandable and defensible operational decision**.

A collision-avoidance workflow must deal with:

- Large volumes of conjunction alerts and limited operator attention.
- Multiple orbital and relative-motion variables influencing risk at the same time.
- The need to understand **why** a model is raising an alert before taking a costly action.
- Operational trade-offs such as **risk reduction vs. propellant consumption**.
- The need for an auditable trail when humans review or approve a maneuver.

OrbitalGuardian is designed around that gap: **from prediction → explanation → recommendation → human decision**.

---

## 🎯 Problem Statement

Active collision avoidance is already a routine space-operations task. ESA notes that a typical Low Earth Orbit spacecraft can receive **hundreds of close-encounter alerts per week**, with automatic filtering reducing these to a much smaller set of actionable events that still require expert analysis. citeturn854262search0

The original ESA Collision Avoidance Challenge framed the machine-learning problem as predicting the final collision-risk estimate from sequences of Conjunction Data Messages (CDMs). citeturn854262search0turn854262search3

### The gap OrbitalGuardian targets

Traditional risk-analysis pipelines can produce technically correct values while still leaving an operator asking:

> **“What caused this risk to become critical, and what action should I evaluate next?”**

OrbitalGuardian turns the model output into an explainable operational story.

---

## 👥 Target Users

### 🛰️ Satellite Operators
Rapidly inspect conjunctions, understand the dominant risk factors, and evaluate an AI-generated maneuver recommendation.

### 🏢 Space Agencies & Mission Teams
Use a transparent, human-in-the-loop interface for screening and reviewing conjunction events.

### 📊 Space Traffic Analysts
Inspect historical alerts, SHAP evidence, confidence levels and maneuver outcomes instead of relying on a single black-box score.

---

## 💡 The Core Idea

### From a number...

`92% collision probability`

### ...to an operational explanation

> **Collision probability is 92%. The primary driver is a 214 m miss distance at TCA, combined with a 14.2 km/s relative closing velocity. The model therefore classifies the event as critical.**

### ...to a decision-support recommendation

> **Raise Orbit +12 km** → estimated residual risk **4%** → estimated propellant **2.1 kg** → required **ΔV 6.4 m/s**.

The recommendation is **not an autonomous command**. The architecture explicitly keeps the operator in the loop: AI generates evidence and a recommendation, while the human decides whether to approve or reject the maneuver. fileciteturn0file2L10-L20

---

# 🤖 AI Architecture

OrbitalGuardian uses a layered AI approach rather than a single model.

```text
                    ORBITAL / CDM DATA
                           │
                           ▼
                 ┌───────────────────┐
                 │ Feature Pipeline  │
                 │ TLE + CDM +      │
                 │ conjunction data │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ LightGBM Classifier│
                 │ Collision Risk    │
                 └─────────┬─────────┘
                           │
                Probability + Confidence
                           │
                           ▼
                 ┌───────────────────┐
                 │ SHAP TreeExplainer│
                 │ WHY?              │
                 └─────────┬─────────┘
                           │
                    Ranked risk factors
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
   ┌───────────────────┐       ┌───────────────────┐
   │ IBM Granite +     │       │ Rule-Based Expert │
   │ LangChain         │       │ Recommendation    │
   │ WHY in plain      │       │ WHAT TO CONSIDER  │
   └─────────┬─────────┘       └─────────┬─────────┘
             │                           │
             └─────────────┬─────────────┘
                           ▼
                ┌────────────────────┐
                │ Operator Decision  │
                │ Human-in-the-loop  │
                └────────────────────┘
```

The architecture documentation describes a hybrid monolith-as-microservice pattern for the MVP, with decoupled interface boundaries that can be scaled independently in a production deployment. fileciteturn0file0L8-L19

---

## 🧠 1. Collision-Risk Prediction — LightGBM

The production AI model is a **Gradient-Boosted Decision Tree classifier using LightGBM**. The task is binary classification: estimate the probability of collision and map that probability into a human-readable risk level. fileciteturn0file2L8-L20

### Model inputs

The documented feature pipeline contains **18 raw features**, covering:

- Miss distance
- Relative velocity
- Satellite and debris altitude
- Altitude separation
- Inclination and inclination difference
- RAAN difference
- Orbital eccentricity
- Time to closest approach
- Debris size
- Orbit regime and debris-density zone
- Historical conjunction count

After categorical expansion, the feature representation becomes **25 model features**. fileciteturn0file2L77-L100

### Reported model performance

| Metric | LightGBM | Random Forest Baseline |
|---|---:|---:|
| **AUC-ROC** | **0.964** | 0.942 |
| **Accuracy** | **96.4%** | 93.1% |
| **Precision — HIGH risk** | **0.91** | 0.87 |
| **Recall — HIGH risk** | **0.94** | 0.88 |
| **F1 — HIGH risk** | **0.925** | 0.875 |
| **Inference time** | **42 ms incl. SHAP** | 180 ms |

These figures are taken directly from the project's model specification. fileciteturn0file2L146-L155

> **Why this matters:** for a safety-oriented screening workflow, high-risk recall is especially important because missing a genuinely dangerous conjunction can be more consequential than flagging an extra event for human review.

---

## 🔎 2. Explainability — SHAP

OrbitalGuardian does not stop at `P(collision)`.

For every inference, **SHAP TreeExplainer** ranks the most influential features and identifies whether each factor pushes the prediction **toward higher or lower risk**. The implementation retains the top five factors and stores both their numeric contribution and a plain-language explanation. fileciteturn0file2L306-L318

Example evidence trail:

| SHAP factor | Example observation | Effect |
|---|---|---|
| Miss Distance | 214 m | ↑ Risk |
| Relative Velocity | 14.2 km/s | ↑ Risk |
| Altitude Delta | 5 km | ↑ Risk |
| Inclination Delta | 4.6° | ↑ Risk |
| Debris Tracking Age | 36 h | ↓ Risk |

This creates an important audit path:

`Prediction → contributing features → plain-language evidence → operator review`

---

## 🧠 3. Generative AI — IBM Granite + LangChain

SHAP is excellent for attribution, but raw feature contributions are not how operators normally communicate during an operational review.

The project therefore introduces an IBM Granite/LangChain generative-AI layer to convert model evidence and telemetry context into concise operator-facing narratives. The architecture documents IBM Granite through `watsonx.ai` with LangChain integration for SHAP-grounded narrative generation. fileciteturn0file0L68-L75

The inference specification also documents a template-based narrative post-processing path, providing a deterministic fallback for rendering the final explanation. fileciteturn0file2L294-L322

### Design principle

> **Generative AI explains the evidence; it does not replace the predictive model.**

This separation makes the system easier to audit and reduces the risk of an LLM becoming the sole source of a high-stakes decision.

---

## 🛠️ 4. Recommendation Engine — Deterministic by Design

The maneuver recommendation layer is intentionally **rule-based rather than generative**.

Example rules documented in the architecture:

| Condition | Decision-support output |
|---|---|
| Risk ≥ 90% and miss distance < 500 m | **Raise Orbit +12 km** |
| Risk ≥ 60% and miss distance < 1,000 m | **Lower Orbit -7 km / Raise Orbit** |
| Risk 30–59% | **Monitor — no burn** |
| Risk < 30% | **No action required** |
| Confidence < 80% | **Immediate Human Review** |

This separation is deliberate: the predictive model answers **“how risky?”**, SHAP answers **“why?”**, and the deterministic expert system answers **“what action should be evaluated?”**. fileciteturn0file0L101-L117

---

# 🌌 3D Situational Awareness

OrbitalGuardian presents the AI output through an interactive monitoring environment rather than a static ML report.

### Operator experience

```text
Fleet Dashboard
     │
     ├── Monitor satellites & risk levels
     │
     ├── Inspect live alerts
     │
     ▼
Conjunction Analysis
     │
     ├── 3D orbital context
     ├── AI probability
     ├── confidence
     ├── TCA / miss distance / relative velocity
     ├── SHAP evidence
     ├── AI narrative
     └── maneuver recommendation
     │
     ▼
Maneuver Sandbox
     │
     ├── change maneuver assumptions
     ├── recalculate risk
     ├── estimate propellant usage
     └── review expected post-maneuver risk
     │
     ▼
Mission History / Audit Trail
```

The frontend stack documented in the architecture includes React, TanStack Router, CesiumJS, Recharts and Tailwind CSS, while Firebase listeners provide the MVP's live UI synchronization. fileciteturn0file0L54-L78

---

# 📡 Real-Time System Architecture

The MVP combines a REST prediction path with Firestore event streaming:

```text
React / CesiumJS
      │
      ├── HTTPS / REST ───────────────► FastAPI
      │                                  │
      │                                  ├── LightGBM
      │                                  ├── SHAP
      │                                  └── Recommendation rules
      │                                  │
      │                                  └──────► Firestore event
      │                                                │
      ◄──────────── Firebase onSnapshot ◄────────────┘
```

The documented system flow shows the analysis page loading the current Firestore state, triggering a synchronous prediction through FastAPI, calculating SHAP factors and recommendation rules, writing the completed event, and pushing the update back to the UI through Firestore. fileciteturn0file0L203-L241

### MVP vs. production direction

The current MVP uses synchronous inference triggered by the frontend. Production architecture plans introduce scheduled screening, queue-based processing and worker pools for fleet-scale screening. fileciteturn0file0L272-L296

---

# 🗃️ Data & Dataset Provenance

Data provenance is a critical part of a space-safety project. OrbitalGuardian documents multiple input sources for orbital state, conjunction events and validation context.

## Primary labelled dataset

### ESA Collision Avoidance Challenge Dataset

**Official dataset:**

🔗 **[Collision Avoidance Challenge Dataset — Zenodo](https://zenodo.org/records/4463683)**

The dataset is the official dataset used in ESA's Collision Avoidance Challenge. It contains anonymised **Conjunction Data Messages (CDMs) collected from 2015–2019** and includes data for modelling the evolution of collision risk across conjunction events. citeturn854262search7turn854262search3

The Zenodo record also states that each row represents one CDM, with multiple CDMs forming time-series observations for individual close-approach events. citeturn854262search7

## Additional documented sources

| Source | Purpose | Link |
|---|---|---|
| **CelesTrak GP Elements** | Current orbital elements / TLE-derived orbital state | [CelesTrak GP Data](https://celestrak.org/NORAD/elements/) |
| **CelesTrak SOCRATES Plus** | Current conjunction screening context, TCA, miss distance and relative speed | [SOCRATES Plus](https://celestrak.org/SOCRATES/) |
| **ESA Collision Avoidance Challenge** | Problem definition and operational context | [ESA Kelvins Challenge](https://kelvins.esa.int/collision-avoidance-challenge/) |

CelesTrak provides GP orbital data in formats including TLE, JSON and CSV, while SOCRATES Plus publishes conjunction search results with fields such as TCA, minimum range and relative speed. citeturn211784search0turn211784search1

> **Note:** The project's internal model specification also lists a `Space Debris Orbits 2026` CSV source. No public URL for that project-specific file is documented in the supplied technical specification, so it is not represented here as an externally verified download link. fileciteturn0file2L31-L39

---

# 🧪 AI Inference Example

For a representative high-risk conjunction, the documented inference payload contains:

```text
Miss distance           214 m
Relative velocity       14.2 km/s
Altitude delta          5 km
Inclination delta       4.6°
TCA                      14:47:12 UTC

Model probability        92%
Model confidence         96%
Inference + SHAP         42 ms

Recommendation            Raise Orbit +12 km
Estimated propellant      2.1 kg
Estimated ΔV               6.4 m/s
Expected residual risk     4%
```

The full example is documented in `AI_MODEL.md`, including the SHAP evidence and recommendation payload. fileciteturn0file2L215-L278

---

# 🧾 Data Model & Auditability

The project stores structured operational information across satellite, debris, event, alert and history entities.

```text
satellites
    │
    ├── events     → latest AI conjunction analysis
    ├── alerts     → active / acknowledged / resolved warnings
    └── history    → mission and maneuver audit trail

      debris ──────► events
```

The documented schema stores not only probability and confidence, but also SHAP factors, narrative evidence, recommendation details, fuel estimates, delta-V, maneuver windows and post-action history. fileciteturn0file1L20-L103 fileciteturn0file1L156-L189

This creates a more complete operational record than a single prediction table.

---

# 🧩 Key Features

| Feature | Why it matters |
|---|---|
| 🌍 **3D Orbital Monitoring** | Gives operators spatial context around satellites and debris |
| 🤖 **LightGBM Risk Prediction** | Fast binary collision-risk scoring |
| 🔎 **SHAP Explainability** | Exposes the strongest risk drivers behind each prediction |
| 💬 **IBM Granite Narrative Layer** | Converts technical evidence into human-readable language |
| 🛡️ **Rule-Based Safety Guardrails** | Keeps maneuver recommendations deterministic and auditable |
| 🧪 **Maneuver Sandbox** | Helps compare risk / fuel trade-offs before committing an action |
| 📡 **Realtime Firestore Updates** | Keeps fleet and analysis views synchronized in the MVP |
| 🧾 **Mission History** | Preserves review and maneuver outcomes for traceability |
| ⚠️ **Low-Confidence Fallbacks** | Escalates uncertain cases to human review rather than forcing an automated decision |

The AI model specification explicitly defines fallback handling for low confidence, backend outages, missing Firestore data and maximum-uncertainty predictions. fileciteturn0file2L327-L367

---

# 🏗️ System Architecture

OrbitalGuardian is organized into three main tiers:

| Tier | Main components |
|---|---|
| **Client** | React 19, TanStack Router, Vite, CesiumJS, Recharts, Tailwind CSS |
| **Application** | FastAPI, LightGBM, SHAP, recommendation engine, IBM Granite / LangChain |
| **Data** | IBM Cloudant, watsonx.data, Firebase Firestore realtime bridge |

The architecture document describes Cloudant as the intended persistent system of record, watsonx.data as the telemetry/data-lake layer, and Firestore as the MVP's ephemeral realtime bridge. fileciteturn0file0L35-L41

---

# 🔐 Human-in-the-Loop & Safety Philosophy

OrbitalGuardian is designed as **decision support, not autonomous spacecraft control**.

### Safety principles

1. **Prediction is separated from recommendation.**
2. **Explainability is presented before action.**
3. **Low-confidence predictions are escalated to human review.**
4. **Maneuver rules are deterministic and auditable.**
5. **The operator approves or rejects the proposed action.**
6. **The system maintains an operational history for review.**

The documented security and production architecture further proposes Firebase Authentication, JWT validation, RBAC and managed secrets for a production deployment. fileciteturn0file0L157-L173

---

# 🚀 IBM AI Builders Challenge

OrbitalGuardian was developed for the **IBM AI Builders Challenge 2026** by team **Five42**.

### Why IBM technology is meaningful here

| IBM Technology | Role in OrbitalGuardian |
|---|---|
| **IBM Granite** | Generative-AI layer for operator-facing explanations |
| **watsonx.ai** | IBM generative-AI platform integration |
| **IBM Cloudant** | Persistent NoSQL operational data architecture |
| **watsonx.data** | Scalable telemetry/data-lake direction |
| **IBM Bob** | Development acceleration across architecture, implementation, debugging and documentation |

### How IBM Bob was used

IBM Bob was used as a development copilot across the project lifecycle, including:

- Architecture planning and component integration.
- Frontend and backend code generation.
- Debugging and refactoring.
- Documentation and technical specification development.
- Iteration across the AI, database and UI layers.

The project architecture and technical documents explicitly describe IBM-oriented services and the use of Bob as part of the development workflow.

---

# 🎬 Demo & Project Resources

| Resource | Link |
|---|---|
| 🌐 **Live Application** | [Open OrbitalGuardian](https://orbital-guardian-weld.vercel.app/) |
| 💻 **GitHub Repository** | [github.com/RinaSyazana/OrbitalGuardian](https://github.com/RinaSyazana/OrbitalGuardian) |
| 🎬 **Demo Video** | Add final public demo link here |
| 📦 **Dataset** | [Official ESA Collision Avoidance Challenge Dataset](https://zenodo.org/records/4463683) |
| 🧠 **AI Model Specification** | [`AI_MODEL.md`](AI_MODEL.md) |
| 🏗️ **Architecture Specification** | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| 🗃️ **Database Specification** | [`DATABASE.md`](DATABASE.md) |

> **For judges:** Start with the live application, then review `AI_MODEL.md` for the model pipeline, `ARCHITECTURE.md` for the system design, and `DATABASE.md` for the data model.

---

# 🧰 Tech Stack

### Frontend

- React 19.2
- TypeScript 5.9
- Vite 8
- TanStack Router
- Tailwind CSS 4
- CesiumJS
- Recharts
- Radix UI

### Backend & AI

- Python 3.11+
- FastAPI
- Uvicorn
- LightGBM
- Scikit-learn
- SHAP
- LangChain
- IBM Granite / watsonx.ai
- Pandas

### Data & Infrastructure

- IBM Cloudant
- watsonx.data
- Firebase Firestore
- Firebase Admin SDK
- Docker
- GitHub Actions

The versions and stack composition above follow the supplied project architecture specification. fileciteturn0file0L54-L78

---

# 🚀 Getting Started

## Prerequisites

- Python 3.11+
- Node.js 20+
- Firebase project / service credentials for the realtime MVP bridge
- Git

## 1. Clone the repository

```bash
git clone https://github.com/RinaSyazana/OrbitalGuardian.git
cd OrbitalGuardian
```

## 2. Backend setup

```bash
cd OrbitalGuardian-MVP

python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Seed the database:

```bash
python backend/seed_db.py
```

Start the API:

```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## 3. Frontend setup

```bash
cd main-apps
npm install
npm run dev
```

Open the local Vite URL shown in your terminal.

### Demo credentials

> The supplied architecture specification documents the MVP credential as:
>
> `operator_admin / operator_admin123`
>
> **Security note:** these are demonstration credentials only. The production target is Firebase Authentication + JWT + RBAC. fileciteturn0file0L90-L99

---

# 📚 Project Documentation

| Document | Purpose |
|---|---|
| [`README.md`](README.md) | Project overview, demo flow and quick start |
| [`AI_MODEL.md`](AI_MODEL.md) | AI model, features, SHAP, inference and fallbacks |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | System topology, API flow, realtime architecture and scalability |
| [`DATABASE.md`](DATABASE.md) | Data model, collections, indexes and retention strategy |


---

# 👩‍💻 Team Five42

| Name | Role |
|---|---|
| **Rina Syazana Binti Rahman** | Developer / Project Lead |
| **Muhammad Luqman Nurhakim Bin Rosli** | Developer |
| **Nadyie Azil Bin Nazeri** | Developer |
| **Nur Aleya Binti Muhammad Hafeez** | Developer |

**Faculty of Computer and Mathematical Sciences**  
Universiti Teknologi MARA (UiTM), 40450 Shah Alam, Selangor, Malaysia

**Supervisor:** Dr. Azliza Mohd Ali

**Submission:** August 2026

---

# 📜 License

This project is licensed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## ⭐ The Takeaway

> **OrbitalGuardian AI is not just a collision predictor.**
>
> It is a prototype for an **explainable, human-centered Space Traffic Management workflow** that connects prediction, evidence, generative AI, operational recommendation and auditability in one interface.
>
> **Predict the risk. Explain the risk. Evaluate the action. Keep the human in control.**

---

### Built with 🛰️ by **Five42** for the **IBM AI Builders Challenge 2026**.
