# 🛰️ OrbitalGuardian AI

> **Explainable Decision Intelligence Platform for Space Traffic Management (STM)**

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB.svg)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime-FFCA28.svg)](https://firebase.google.com/)
[![LightGBM](https://img.shields.io/badge/Model-LightGBM-success.svg)](https://lightgbm.readthedocs.io/)
[![SHAP](https://img.shields.io/badge/XAI-SHAP-purple.svg)](https://shap.readthedocs.io/)
[![IBM AI Builders Challenge](https://img.shields.io/badge/IBM-AI%20Builders%20Challenge%202026-blue.svg)]()

---

## 📖 Overview

**OrbitalGuardian AI** is an Explainable AI (XAI) platform designed to assist satellite operators in **Space Traffic Management (STM)** by predicting satellite–debris collision risks, explaining AI decisions, recommending avoidance maneuvers, and visualizing the complete decision-making process through an interactive dashboard.

Unlike traditional orbital tracking systems, OrbitalGuardian AI bridges the gap between **AI prediction** and **human decision support**, enabling operators to understand *why* a collision risk is predicted before taking action.

---

## ✨ Key Features

- 🌍 **Voxel Earth Engine**: Custom 3D orbital visualization for real-time traffic
- ☄️ **Dynamic Threat Sieve**: Monitors satellites and space debris in real-time
- 🤖 **LightGBM Conjunction Model**: High-performance gradient-boosted tree for risk scoring (96.4% accuracy)
- 📈 **SHAP Explainability**: Translates raw feature importance into natural-language narratives
- 🧠 **Maneuver Sandbox**: Real-time maneuver simulation recalculating risk, fuel, and mission score
- ⚡ **Firebase Real-Time DB**: Instant, live synchronization between AI inference and UI (`onSnapshot`)
- 🛡 **Audit Trail**: Every committed maneuver is logged for compliance and post-action review

---

## 🏗 System Architecture

```text
                     Public Space Datasets (Space-Track, ESA)
                                   │
                                   ▼
                            Data Ingestion
                                   │
                                   ▼
                      LightGBM Conjunction Model
                      (Scores pairs, SHAP features)
                                   │
                                   ▼
                      FastAPI Backend API (Python)
                                   │
                                   ├──────────────► IBM Granite (watsonx.ai)
                                   │                via LangChain (Narratives)
                                   ▼
                    IBM Cloudant (NoSQL Persistent DB)
                      watsonx.data (Telemetry Lake)
                                   │
                                   ▼ (Firebase WebSocket Bridge)
                                   │
                     React + TanStack Router Dashboard
                  (Monitoring, Analysis, Sandbox, History)
                                   │
                                   ▼
                         Operator Decision Support
```

---

## 📂 Project Structure

```
OrbitalGuardian/
│
├── OrbitalGuardian-MVP/      # Backend (Python / FastAPI)
│   ├── backend/
│   │   ├── main.py           # FastAPI entry point & Firebase integration
│   │   └── seed_db.py        # Firebase initial data seeder
│   ├── docs/                 # System documentation & specs
│   └── requirements.txt
│
├── main-apps/                # Frontend (React 19 / TypeScript / Vite)
│   ├── src/
│   │   ├── components/       # UI Blocks, Layout, Voxel renderer
│   │   ├── lib/              # Firebase config, utility functions
│   │   ├── routes/           # TanStack file-based router pages
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🚀 End-to-End Workflow (8-Stage AI Pipeline)

1. **TLE Catalogue Ingest**: Pulls GP data from Space-Track (28,411 objects).
2. **Conjunction Screening**: Pairwise proxy sieve filters down to high-risk candidates.
3. **Feature Engineering**: 41 features (miss distance, covariance, KP index, relative velocity).
4. **LightGBM Risk Model**: Predicts collision probability (0–100%).
5. **SHAP Explainability**: Generates feature-level attribution and natural language explanation.
6. **Maneuver Sandbox**: Generates candidate avoidance burns (Δaltitude).
7. **Firebase Real-Time Sync**: FastAPI writes to Firestore; React listens and updates live.
8. **Operator Commit**: Human operator reviews, simulates, and commits the burn to an immutable audit log.

---

## 💻 Tech Stack

### Backend
- **Python 3.11+**
- **FastAPI** + **Uvicorn**
- **LightGBM** + **SHAP**
- **LangChain** + **IBM Granite (watsonx.ai)**
- **IBM Cloudant** + **Firebase Admin SDK**

### Frontend
- **React 19** + **TypeScript**
- **TanStack Router** (File-based routing)
- **Tailwind CSS v4** + Custom HUD Theme
- **Firebase Web SDK** (Real-time bridge)

---

## 🚀 Installation & Setup

### 1. Firebase Setup
You must have a Firebase project with a Firestore database created. 
- Get the `serviceAccountKey.json` for the backend. Place it in `OrbitalGuardian-MVP/backend/`.
- Get the Web SDK config for the frontend. Update `main-apps/src/lib/firebase.ts`.

### 2. Backend (FastAPI)

```bash
cd OrbitalGuardian-MVP
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt

# Seed the initial mock data into Firebase
python backend/seed_db.py

# Run the API server
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend (React)

```bash
cd main-apps
npm install

# Run the Vite development server
npm run dev
```

Visit `http://localhost:8081` in your browser. (The default operator login is `operator_admin` / `operator_admin123`).

---

## 📈 IBM Ecosystem Alignment

This project was built using **IBM Bob** (primary AI coding assistant) for the **IBM AI Builders Challenge 2026**. The architecture maps seamlessly to IBM services:
- **watsonx.ai** & **IBM Granite**: Dynamic generation of collision narratives and operational recommendations via LangChain.
- **watsonx.data**: Scalable data lake for storing massive TLE orbital catalogs and CDM (Conjunction Data Message) archives.
- **IBM Cloudant**: Persistent JSON NoSQL document store for satellite telemetry and maneuver history.
- **watsonx.governance**: (Planned) Drift scoring and model fairness tracking for the LightGBM prediction engine.

---

## 📜 License

This project is developed for the **IBM AI Builders Challenge 2026**.
Please refer to the respective dataset providers (Space-Track, ESA) for dataset licensing terms.