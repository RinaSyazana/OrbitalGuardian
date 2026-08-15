# OrbitalGuardian AI - MVP Pipeline

This directory contains the foundational Machine Learning pipeline for the OrbitalGuardian AI project, aligning with **Phases 1-6** of the system architecture.

## Folder Structure
- `data/`: *(Ignored by Git)* Contains the Kaggle datasets, CelesTrak TLE data, and the trained model weights.
- `docs/`: Contains highly detailed architectural documentation for Phases 1 through 6.
- `src/`: Contains the modular Python scripts for data ingestion, feature engineering, model training, explainable AI, and decision support.

---

## How Team Members Can Run and Test the Project

Because the training datasets and model files are too large to push to GitHub, they are blocked by the `.gitignore`. Depending on your role on the team, here is how you can run the project after cloning this repository:

### Option A: The "Backend/Frontend Developer" Route (Fastest)
If you are building the FastAPI backend or the React dashboard, you **do not** need to download massive datasets or train the AI yourself.
1. Ask the AI/Data Engineer to send you the trained model file: `lightgbm_production.txt` (via Slack, Discord, or Google Drive).
2. Place that file inside your `data/` folder.
3. You can now load the model directly in Python to make predictions!
```python
import lightgbm as lgb
model = lgb.Booster(model_file="data/lightgbm_production.txt")
# Ready to run inference!
```

### Option B: The "Data Scientist" Route (Full Pipeline)
If you want to modify the AI, engineer new features, or retrain the model from scratch, you must execute the full pipeline.
1. Download the datasets manually from Kaggle:
   - [Collision Avoidance Challenge](https://www.kaggle.com/datasets/shadmanrohan/collisionavoidancechallenge)
   - [Space Debris Orbits 2026](https://www.kaggle.com/datasets/masanakashima/space-debris-orbits-2026)
2. Place the unzipped folders inside the `data/` directory.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the pipeline in order:
   ```bash
   python src/data_pipeline.py      # Downloads CelesTrak & loads Kaggle data
   python src/features.py           # Extracts orbital physics features
   python src/train_models.py       # Trains LightGBM and evaluates performance
   python src/explainability.py     # Generates SHAP human-readable explanations
   python src/recommendation.py     # Runs the Decision Support rule engine
   ```

---
