# OrbitalGuardian AI: Explainable AI for Space Traffic Management 🛰️

> **"Because every second matters in orbit."**

[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.11+-yellow?logo=python&logoColor=white)](https://www.python.org/)
[![LightGBM](https://img.shields.io/badge/Model-LightGBM-success.svg)](https://lightgbm.readthedocs.io/)
[![IBM](https://img.shields.io/badge/IBM-AI%20Builders%20Challenge%202026-blue.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

### Developed by **Five42**

| Name | Role |
|---|---|
| Rina Syazana Binti Rahman | Developer / Project Lead |
| Muhammad Luqman Nurhakim Bin Rosli | Developer |
| Nadyie Azil Bin Nazeri | Developer |
| Nur Aleya Binti Muhammad Hafeez | Developer |

**Faculty of Computer and Mathematical Sciences**
Universiti Teknologi MARA (UiTM), 40450, Shah Alam, Selangor, Malaysia

**Supervised by:** Dr. Azliza Mohd Ali & Dr. Ezzatul Akmal Kamaru-Zaman
Faculty of Computer and Mathematical Sciences, UiTM

**Date of Submission:** August 2026

---

## 🏆 IBM AI Builders Challenge Submission

> This project was submitted to the **IBM AI Builders Challenge 2026** by team **Five42**.

| Resource | Link |
|---|---|
| 🌐 **Live App** | [orbitalguardian.vercel.app](https://orbitalguardian.vercel.app/) |
| 🎬 **Demo Video** | [Watch on Google Drive](#) |
| 💻 **Codebase (Repository)** | [github.com/RinaSyazana/OrbitalGuardian](https://github.com/RinaSyazana/OrbitalGuardian) |
| 📄 **Project Report** | `IBM_Submission/Report_OrbitalGuardian.pdf` |
| 🛠️ **Setup Instructions** | See [Getting Started](#-getting-started) section below |

> **Judges**: The live app is accessible at the Vercel link above. The full source code is available in the GitHub repository.

---

## 📖 Table of Contents

- [Problem Statement](#-problem-statement--target-audience)
- [Solution Description](#-solution-description)
- [Selected Challenge Theme](#-selected-challenge-theme)
- [AI Approach and Architecture](#-ai-approach-and-architecture)
- [How IBM Bob was Used](#-how-ibm-bob-was-used)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [License](#-license)

---

## 🎯 Problem Statement & Target Audience

As the number of satellites in Low Earth Orbit (LEO) grows exponentially, the risk of orbital collisions with space debris is at an all-time high. Satellite operators receive thousands of Conjunction Data Messages (CDMs) daily, creating severe alert fatigue. Current systems provide raw probability numbers but lack **explainability** — operators do not trust a "black box" algorithm to spend precious satellite propellant without understanding *why* the risk is high.

### Target Audience
- **Satellite Operators & Constellation Managers**: Need to make split-second, high-stakes decisions on avoidance maneuvers.
- **Space Agencies (NASA, ESA, JAXA)**: Require auditable, transparent AI systems for Space Traffic Management (STM).

---

## 💡 Solution Description

**OrbitalGuardian AI** is an Explainable AI (XAI) platform designed to assist satellite operators in Space Traffic Management. By bridging the gap between AI prediction and human decision support, OrbitalGuardian translates complex orbital mechanics and risk probabilities into human-readable narratives. 

Instead of just outputting a collision percentage, the platform uses **SHAP (SHapley Additive exPlanations)** and **IBM Granite (via LangChain)** to explain exactly which factors (e.g., miss distance, relative velocity, covariance overlap) are driving the risk, and recommends optimized avoidance maneuvers in a real-time, interactive 3D Voxel dashboard.

---

## 🌌 Selected Challenge Theme

**Space-Tech & AI Innovation**: We have leveraged open-source AI tools, space-related datasets (Space-Track, ESA), and IBM's generative AI ecosystem to tackle a critical aerospace challenge: Space Traffic Management (STM).

---

## 🤖 AI Approach and Architecture

Our architecture follows a robust hybrid pattern optimized for the IBM ecosystem, fulfilling all judging criteria for technological complexity, AI integration, and scalability.

### 1. LightGBM Predictive Engine (Open-Source AI)
A high-performance Gradient-Boosted Decision Tree (GBDT) model trained on historical orbital data and CDMs to predict collision probability with 96.4% accuracy.

### 2. SHAP Explainability Layer
We apply a SHAP TreeExplainer to the LightGBM model. This provides exact attribution for why a collision risk is high, ensuring the AI's decision is fully transparent and auditable.

### 3. IBM Granite & LangChain (Generative AI)
Using `ibm-watsonx-ai` and `langchain-ibm`, we feed the raw numerical SHAP factors and telemetry data into the **IBM Granite 13b-chat-v2** model. The LLM translates these metrics into concise, operational narratives (e.g., *"Risk is elevated to 92% due to critically low miss distance. Immediate maneuver is recommended."*).

### 4. IBM Cloudant & watsonx.data (Data Tier)
- **IBM Cloudant**: Serves as the persistent NoSQL JSON document store for all satellite telemetry, events, and maneuver history.
- **watsonx.data**: Scalable data lake for storing massive TLE orbital catalogs and CDM archives.
- *(Note: For the MVP live demonstration, Firebase Firestore acts purely as an ephemeral WebSocket bridge to ensure 60fps real-time UI synchronization without polling).*

---

## 🛠️ How IBM Bob was Used

In alignment with the AI Builders Challenge rules, **IBM Bob** was our primary development tool throughout the entire lifecycle of OrbitalGuardian AI:
1. **Architectural Design**: Bob guided the integration of LangChain and IBM Granite, ensuring our backend effectively utilized `ibm-watsonx-ai`.
2. **Code Generation**: Bob generated the complex React 19 frontend components, including the 3D CesiumJS Voxel Earth engine and real-time TanStack Router implementations.
3. **Debugging & Refactoring**: Bob successfully diagnosed and resolved critical issues, such as Git large file limitations and asynchronous Python/FastAPI integration errors.
4. **Documentation**: Bob structured and generated comprehensive technical documentation (`ARCHITECTURE.md`, `AI_MODEL.md`, etc.), ensuring our project meets enterprise-grade standards.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🌍 **Voxel Earth Engine** | Custom 3D orbital visualization for real-time traffic using CesiumJS. |
| 🤖 **LightGBM Prediction** | High-performance risk scoring model (96.4% accuracy). |
| 💬 **IBM Granite Narratives** | LLM-generated operational narratives explaining the collision risks. |
| 🧠 **Maneuver Sandbox** | Real-time maneuver simulation recalculating risk, fuel, and mission score. |
| 🛡 **Audit Trail** | Every committed maneuver is logged for compliance and post-action review. |

---

## ⚙️ Tech Stack

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

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.11+
- Node.js 20+
- Firebase service account key (for real-time MVP bridge)

### 2. Backend Setup

```bash
cd OrbitalGuardian-MVP
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt

# Seed the initial mock data (and generate Granite narratives)
python backend/seed_db.py

# Run the API server
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
cd main-apps
npm install

# Run the Vite development server
npm run dev
```

Visit `http://localhost:8081` in your browser. (The default operator login is `operator_admin` / `operator_admin123`).

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed for the **IBM AI Builders Challenge 2026**.