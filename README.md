# 🛰️ OrbitalGuardian AI

> ### Explainable Decision Intelligence for Safer Space Traffic Management
>
> **Because every second matters in orbit.**

[![IBM AI Builders Challenge 2026](https://img.shields.io/badge/IBM-AI%20Builders%20Challenge%202026-blue?logo=ibm&logoColor=white)](#-selected-challenge-theme)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite&logoColor=white)](https://vite.dev/)
[![Python](https://img.shields.io/badge/Python-3.11+-yellow?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-teal?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![LightGBM](https://img.shields.io/badge/ML-LightGBM-success?logo=lightgbm&logoColor=white)](https://lightgbm.readthedocs.io/)
[![SHAP](https://img.shields.io/badge/XAI-SHAP-orange?logoColor=white)](https://shap.readthedocs.io/)
[![IBM Granite](https://img.shields.io/badge/GenAI-IBM%20Granite-blue?logo=ibm&logoColor=white)](https://www.ibm.com/granite)
[![LangChain](https://img.shields.io/badge/Orchestration-LangChain-green?logo=langchain&logoColor=white)](https://www.langchain.com/)
[![Firebase](https://img.shields.io/badge/Realtime-Firebase-red?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)

---

## 📖 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Description](#-solution-description)
- [AI Approach and Architecture](#-ai-approach-and-architecture)
- [Selected Challenge Theme](#-selected-challenge-theme)
- [How IBM Bob was Used](#-how-ibm-bob-was-used)
- [Target Users](#-target-users)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Demo & Project Resources](#-demo--project-resources)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Why This Project Matters](#-why-this-project-matters)
- [Team Five42](#-team-five42)

---

## 🎯 Problem Statement

As the number of satellites in Low Earth Orbit (LEO) grows exponentially, the risk of orbital collisions with space debris is at an all-time high. Satellite operators receive thousands of Conjunction Data Messages (CDMs) daily, creating severe alert fatigue. Current systems provide raw probability numbers but lack **explainability** — operators do not trust a "black box" algorithm to spend precious satellite propellant without understanding *why* the risk is high.

Traditional risk-analysis pipelines can produce technically correct values while still leaving an operator asking:
> **“What caused this risk to become critical, and what action should I evaluate next?”**

Without clear, auditable explanations and actionable decision-support, space traffic management remains dangerously manual and slow.

---

## 💡 Solution Description

**OrbitalGuardian AI** is an Explainable AI (XAI) platform designed to assist satellite operators in Space Traffic Management. By bridging the gap between AI prediction and human decision support, OrbitalGuardian translates complex orbital mechanics and risk probabilities into human-readable narratives.

Instead of asking an operator to interpret a mysterious collision score, OrbitalGuardian answers three questions in sequence:
> **1. How risky is the conjunction? → 2. Why is it risky? → 3. What should the operator consider doing?**

### From a number...
`92% collision probability`

### ...to an operational explanation
> **Collision probability is 92%. The primary driver is a 214 m miss distance at TCA, combined with a 14.2 km/s relative closing velocity. The model therefore classifies the event as critical.**

### ...to a decision-support recommendation
> **Raise Orbit +12 km** → estimated residual risk **4%** → estimated propellant **2.1 kg** → required **ΔV 6.4 m/s**.

The recommendation is **not an autonomous command**. The architecture explicitly keeps the operator in the loop: AI generates evidence and a recommendation, while the human decides whether to approve or reject the maneuver.

---

## 🤖 AI Approach and Architecture

Our architecture follows a robust hybrid pattern optimized for the IBM ecosystem, fulfilling all judging criteria for technological complexity, AI integration, and scalability.

OrbitalGuardian uses a layered AI approach rather than a single model:

### 1. Collision-Risk Prediction (LightGBM)
The production AI model is a **Gradient-Boosted Decision Tree classifier using LightGBM**. It performs binary classification to estimate the probability of collision and map that probability into a human-readable risk level.

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

After categorical expansion, the feature representation becomes **25 model features**. 

Reported model performance:

| Metric | LightGBM | Random Forest Baseline |
|---|---:|---:|
| **AUC-ROC** | **0.964** | 0.942 |
| **Accuracy** | **96.4%** | 93.1% |
| **Precision — HIGH risk** | **0.91** | 0.87 |
| **Recall — HIGH risk** | **0.94** | 0.88 |
| **F1 — HIGH risk** | **0.925** | 0.875 |
| **Inference time** | **42 ms incl. SHAP** | 180 ms |

### 2. Explainability Layer (SHAP)
For every inference, **SHAP TreeExplainer** ranks the most influential features and identifies whether each factor pushes the prediction toward higher or lower risk. The implementation retains the top five factors and stores both their numeric contribution and a plain-language explanation, providing a critical audit path.

Example evidence trail:

| SHAP factor | Example observation | Effect |
|---|---|---|
| Miss Distance | 214 m | ↑ Risk |
| Relative Velocity | 14.2 km/s | ↑ Risk |
| Altitude Delta | 5 km | ↑ Risk |
| Inclination Delta | 4.6° | ↑ Risk |
| Debris Tracking Age | 36 h | ↓ Risk |

### 3. Generative AI Narratives (IBM Granite + LangChain)
We use `ibm-watsonx-ai` and `langchain-ibm` to feed raw numerical SHAP factors and telemetry data into the **IBM Granite 13b-chat-v2** model. The LLM translates these metrics into concise, operational narratives (e.g., *"Risk is elevated to 92% due to critically low miss distance."*).
> **Design principle**: Generative AI explains the evidence; it does not replace the predictive model.

### 4. Rule-Based Expert Recommendation
The maneuver recommendation layer is intentionally deterministic. It uses rule-based expert logic to recommend "Raise Orbit +12 km", "Monitor", or "Immediate Human Review" based on the AI's risk score and confidence.

Example rules documented in the architecture:

| Condition | Decision-support output |
|---|---|
| Risk ≥ 90% and miss distance < 500 m | **Raise Orbit +12 km** |
| Risk ≥ 60% and miss distance < 1,000 m | **Lower Orbit -7 km / Raise Orbit** |
| Risk 30–59% | **Monitor — no burn** |
| Risk < 30% | **No action required** |
| Confidence < 80% | **Immediate Human Review** |

This separation is deliberate: the predictive model answers **“how risky?”**, SHAP answers **“why?”**, and the deterministic expert system answers **“what action should be evaluated?”**.

---

## 🚀 Selected Challenge Theme

OrbitalGuardian was developed for the **IBM AI Builders Challenge 2026** by team **Five42**, specifically targeting the **August Challenge Theme** which specified **Space-Tech & AI Innovation**. We leverage open-source AI tools, space-related datasets (Space-Track, ESA), and IBM's generative AI ecosystem to tackle one of the most critical challenges in aerospace today: Space Traffic Management (STM).

---

## 🛠️ How IBM Bob was Used

In alignment with the AI Builders Challenge rules, **IBM Bob** was our primary development copilot throughout the entire lifecycle of OrbitalGuardian AI:

1. **Architectural Design**: Bob guided the integration of LangChain and IBM Granite, ensuring our backend effectively utilized `ibm-watsonx-ai` and adhered to the IBM ecosystem.
2. **Code Generation**: Bob generated the complex React 19 frontend components, including the 3D CesiumJS Voxel Earth engine, real-time TanStack Router implementations, and the FastAPI backend bridging.
3. **Debugging & Refactoring**: Bob successfully diagnosed and resolved critical issues, such as Git large file limitations and asynchronous Python/FastAPI integration errors.
4. **Documentation**: Bob structured and generated comprehensive technical documentation (`ARCHITECTURE.md`, `AI_MODEL.md`, `DATABASE.md`, `UI_UX_SPEC.md`), ensuring our project meets enterprise-grade standards.

Why IBM technology is meaningful here

| IBM Technology | Role in OrbitalGuardian |
|---|---|
| **IBM Bob** | Development acceleration across architecture, implementation, debugging and documentation |
| **IBM Granite** | Generative-AI layer for operator-facing explanations |
| **watsonx.ai** | IBM generative-AI platform integration |
| **IBM Cloudant** | Persistent NoSQL operational data architecture |
| **watsonx.data** | Scalable telemetry/data-lake direction |

---

## 👥 Target Users

- **🛰️ Satellite Operators & Constellation Managers**: Need to make split-second, high-stakes decisions on avoidance maneuvers.
- **🏢 Space Agencies (NASA, ESA, JAXA)**: Require auditable, transparent AI systems for Space Traffic Management (STM).
- **📊 Space Traffic Analysts**: Inspect historical alerts, SHAP evidence, confidence levels and maneuver outcomes instead of relying on a single black-box score.

---

## 🏗️ System Architecture

OrbitalGuardian is organized into three main tiers:

| Tier | Main components |
|---|---|
| **Client** | React 19, TanStack Router, Vite, CesiumJS, Tailwind CSS |
| **Application** | FastAPI, LightGBM, SHAP, Recommendation Engine, IBM Granite / LangChain |
| **Data** | IBM Cloudant (Production Target), Firebase Firestore (MVP Realtime Bridge) |

The MVP combines a REST prediction path with Firestore event streaming to ensure 60fps real-time UI synchronization without polling.

---

## 🧩 Key Features

| Feature | Why it matters |
|---|---|
| 🌍 **3D Orbital Monitoring** | Interactive CesiumJS environment gives operators spatial context around satellites and debris. |
| 🤖 **LightGBM Risk Prediction** | Fast binary collision-risk scoring (96.4% accuracy). |
| 🔎 **SHAP Explainability** | Exposes the strongest risk drivers behind each prediction. |
| 💬 **IBM Granite Narratives** | LLM-generated operational narratives explaining the collision risks. |
| 📄 **Rule-Based Safety Guardrails** | Keeps maneuver recommendations deterministic and auditable |
| 🧪 **Maneuver Sandbox** | Real-time maneuver simulation recalculating risk, fuel, and mission score. |
| 🛡️ **Audit Trail** | Every committed maneuver is logged for compliance and post-action review. |
| 🧾 **Mission History** | Preserves review and maneuver outcomes for traceability |

---

## 🎬 Demo & Project Resources

| Resource | Link |
|---|---|
| 🌐 **Live Application** | [orbitalguardian.vercel.app](https://orbital-guardian-weld.vercel.app/) |
| 💻 **GitHub Repository** | [github.com/RinaSyazana/OrbitalGuardian](https://github.com/RinaSyazana/OrbitalGuardian) |
| 📦 **Dataset** | [Official ESA Collision Avoidance Challenge Dataset](https://zenodo.org/records/4463683) |
| 🧠 **AI Model Specification** | [`OrbitalGuardian-MVP/docs/AI_MODEL.md`](docs/AI_MODEL.md) |
| 🏗️ **System Architecture Specification** | [`OrbitalGuardian-MVP/docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| 🗃️ **Database Specification** | [`OrbitalGuardian-MVP/docs/DATABASE.md`](docs/DATABASE.md) |
| 📱 **UI/UX Specification** | [`OrbitalGuardian-MVP/docs/UI_UX_SPEC.md`](docs/UI_UX_SPEC.md) |

---

## 🧰 Tech Stack

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

The versions and stack composition above follow the supplied project architecture specification.

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- Firebase project / service credentials (for the realtime MVP bridge)

### 1. Backend Setup

```bash
cd OrbitalGuardian-MVP

# Create virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

# Seed the database (and generate Granite narratives)
python backend/seed_db.py

# Run the FastAPI server
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
cd main-apps
npm install
npm run dev
```

Visit `http://localhost:8081` in your browser. (The default operator login is `operator_admin` / `operator_admin123`).

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

## 👩‍💻 Team Five42

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

## 📜 License

This project is licensed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

### Built with 🛰️ by **Five42** for the **IBM AI Builders Challenge 2026** of **August Challenge Theme**.
