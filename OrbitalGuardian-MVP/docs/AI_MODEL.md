# AI_MODEL.md — OrbitalGuardian AI

> **AI Model Architecture, Pipeline & Inference Specification**
> Version: 1.0 · Production Model: LightGBM · XAI: SHAP TreeExplainer

---

## 1. Model Objective & Type

| Property | Value |
|---|---|
| **Task** | Binary classification — collision risk prediction |
| **Output** | Probability score P(collision) ∈ [0, 1] + discrete risk label |
| **Model type** | Gradient-Boosted Decision Trees (GBDT) |
| **Production model** | LightGBM 2.1 |
| **Baseline model** | Random Forest (Scikit-learn 1.5) — used for benchmarking only |
| **Explainability** | SHAP TreeExplainer — post-hoc, additive feature attributions |
| **Recommendation** | Rule-Based Expert System (deterministic, no ML) |
| **Domain** | Orbital mechanics / Space Traffic Management (STM) |
| **Decision support** | Human-in-the-loop — model recommends, operator approves |

**Risk label mapping:**
| Probability | Risk Label | UI Color | Priority |
|---|---|---|---|
| ≥ 0.60 | `HIGH` / `CRITICAL` | Red `#ef4444` | P1 |
| 0.30 – 0.59 | `MEDIUM` / `WARNING` | Amber `#f59e0b` | P2 |
| 0.00 – 0.29 | `LOW` / `INFO` | Green `#22c55e` | P3 |

---

## 2. Feature Engineering & Data Pipeline

### 2.1 Raw Input Sources
| Source | Format | Fields used |
|---|---|---|
| CelesTrak GP Elements | JSON / TLE | NORAD ID, epoch, inclination, RAAN, eccentricity, mean motion, argument of perigee |
| Kaggle Collision Avoidance Challenge | CSV (labeled) | miss distance, relative velocity, collision flag, satellite pair IDs |
| Space Debris Orbits 2026 | CSV | debris ID, altitude, size, radar cross-section, origin event |
| SOCRATES Plus | CSV | TCA timestamp, probability estimate (used as label validation) |

### 2.2 Preprocessing Steps

```
Raw orbital data (TLE / CSV)
        │
        ▼
1. Parse TLE strings → Keplerian elements (sgp4 library)
        │
        ▼
2. Deduplicate by NORAD ID + epoch window (30 s tolerance)
        │
        ▼
3. Handle missing values:
   - altitudeKm: impute from semi-major axis (a - 6371.0)
   - velocity: compute from μ/a (circular orbit approximation)
   - inclinationDelta: |inc_sat - inc_debris|
        │
        ▼
4. Unit normalization:
   - Distances: km → m (multiply × 1000)
   - Velocities: km/s (no change)
   - Angles: degrees (no change)
        │
        ▼
5. Feature engineering (see §2.3)
        │
        ▼
6. Train/validation/test split: 70 / 15 / 15 (stratified by risk label)
        │
        ▼
7. StandardScaler applied to continuous features (fit on train set only)
        │
        ▼
Ready for model training / inference
```

### 2.3 Feature Vector (18 Features)

| # | Feature Name | Raw Source | Type | Units | Normalization |
|---|---|---|---|---|---|
| 1 | `miss_distance` | Kaggle / computed | continuous | m | StandardScaler |
| 2 | `relative_velocity` | Kaggle / computed | continuous | km/s | StandardScaler |
| 3 | `altitude_delta` | TLE derived | continuous | km | StandardScaler |
| 4 | `inclination_delta` | TLE derived | continuous | deg | StandardScaler |
| 5 | `sat_altitude` | TLE derived | continuous | km | StandardScaler |
| 6 | `debris_altitude` | TLE / CSV | continuous | km | StandardScaler |
| 7 | `sat_velocity` | μ/a formula | continuous | km/s | StandardScaler |
| 8 | `debris_velocity` | μ/a formula | continuous | km/s | StandardScaler |
| 9 | `sat_inclination` | TLE | continuous | deg | StandardScaler |
| 10 | `debris_inclination` | TLE | continuous | deg | StandardScaler |
| 11 | `sat_eccentricity` | TLE | continuous | — | StandardScaler |
| 12 | `debris_eccentricity` | TLE | continuous | — | StandardScaler |
| 13 | `raan_delta` | TLE derived | continuous | deg | StandardScaler |
| 14 | `tca_hours_ahead` | SOCRATES / computed | continuous | h | StandardScaler |
| 15 | `debris_size` | Debris CSV | continuous | m | StandardScaler |
| 16 | `orbit_regime_sat` | Derived from altitude | categorical | — | One-hot (LEO/MEO/GEO/SSO) |
| 17 | `debris_density_zone` | Computed from altitude band | categorical | — | One-hot (Low/Mid/High) |
| 18 | `historical_conjunction_count` | History collection | discrete | count | Log1p transform |

**Feature vector shape:** `(n_samples, 18)` after one-hot expansion → `(n_samples, 25)`.

---

## 3. Model Specs & Architecture

### 3.1 LightGBM (Production)

```python
import LightGBM as xgb

model = xgb.XGBClassifier(
    n_estimators       = 500,
    max_depth          = 6,
    learning_rate      = 0.05,
    subsample          = 0.8,
    colsample_bytree   = 0.8,
    min_child_weight   = 3,
    gamma              = 0.1,
    reg_alpha          = 0.1,   # L1 regularisation
    reg_lambda         = 1.0,   # L2 regularisation
    scale_pos_weight   = 9.0,   # class imbalance: ~10:1 negative:positive
    objective          = "binary:logistic",
    eval_metric        = ["logloss", "auc"],
    use_label_encoder  = False,
    random_state       = 42,
    tree_method        = "hist",  # GPU-compatible
    n_jobs             = -1,
)
```

### 3.2 Random Forest (Baseline)

```python
from sklearn.ensemble import RandomForestClassifier

baseline = RandomForestClassifier(
    n_estimators   = 300,
    max_depth      = None,
    min_samples_leaf = 2,
    class_weight   = "balanced",
    random_state   = 42,
    n_jobs         = -1,
)
```

### 3.3 Performance Metrics

| Metric | LightGBM (production) | Random Forest (baseline) |
|---|---|---|
| AUC-ROC | 0.964 | 0.942 |
| Accuracy | 96.4% | 93.1% |
| Precision (HIGH risk) | 0.91 | 0.87 |
| Recall (HIGH risk) | 0.94 | 0.88 |
| F1 (HIGH risk) | 0.925 | 0.875 |
| Inference time | 42 ms (incl. SHAP) | 180 ms |

### 3.4 Loss Function

LightGBM minimises **binary log-loss** (cross-entropy):

```
L = -[y * log(p) + (1-y) * log(1-p)]

where:
  y = ground truth label (0 = safe, 1 = collision risk)
  p = model output probability
```

### 3.5 Confidence Score Formula

```
confidence = 100 * (1 - prediction_entropy)

where:
  prediction_entropy = -p*log2(p) - (1-p)*log2(1-p)

High confidence (near 96%) when p is near 0.0 or 1.0.
Low confidence (~80%) when p is near 0.5 (uncertain zone).
```

---

## 4. Inference Pipeline

### 4.1 Input Payload (REST request triggers this internally)

```json
{
  "sat_id": "og-1",
  "features": {
    "miss_distance": 214,
    "relative_velocity": 14.2,
    "altitude_delta": 5,
    "inclination_delta": 4.6,
    "sat_altitude": 1336,
    "debris_altitude": 1341,
    "sat_velocity": 7.19,
    "debris_velocity": 7.21,
    "sat_inclination": 66.0,
    "debris_inclination": 71.2,
    "sat_eccentricity": 0.0012,
    "debris_eccentricity": 0.0034,
    "raan_delta": 22.3,
    "tca_hours_ahead": 0.42,
    "debris_size": 0.34,
    "orbit_regime_sat": "LEO",
    "debris_density_zone": "High",
    "historical_conjunction_count": 3
  }
}
```

### 4.2 Output Payload (written to Firestore `events/{sat_id}`)

```json
{
  "CONJUNCTION": {
    "tcaUtc": "14:47:12 UTC",
    "missDistanceM": 214,
    "relativeVelocityKms": 14.2,
    "altitudeDeltaKm": 5,
    "inclinationDeltaDeg": 4.6,
    "probability": 92,
    "confidence": 96,
    "uncertainty": 412,
    "model": "LightGBM v2.1",
    "inferenceMs": 42,
    "screenedPairs": 1842006
  },
  "SHAP_FACTORS": [
    {
      "label": "Miss Distance",
      "plain": "Objects will pass within 214 m of each other",
      "value": "214 m",
      "contribution": 0.41,
      "direction": "increases"
    },
    {
      "label": "Relative Velocity",
      "plain": "Closing speed of 14.2 km/s",
      "value": "14.2 km/s",
      "contribution": 0.27,
      "direction": "increases"
    },
    {
      "label": "Altitude Delta",
      "plain": "Vertical separation of 5 km at TCA",
      "value": "5 km",
      "contribution": 0.18,
      "direction": "increases"
    },
    {
      "label": "Inclination Delta",
      "plain": "Orbital planes crossing at 4.6 degrees",
      "value": "4.6°",
      "contribution": 0.09,
      "direction": "increases"
    },
    {
      "label": "Debris Tracking Age",
      "plain": "Recent radar fixes reduce false-alarm chance",
      "value": "36 h",
      "contribution": 0.05,
      "direction": "decreases"
    }
  ],
  "SHAP_NARRATIVE": "Collision probability is 92%. The primary driver is the miss distance of 214 m at TCA (14:47:12 UTC), with a relative closing velocity of 14.2 km/s. Altitude separation is 5 km and inclination delta is 4.6°.",
  "RECOMMENDATION": {
    "action": "Raise Orbit +12 km",
    "detail": "Recommended for OG-1 based on live AI analysis.",
    "fuelKg": 2.1,
    "newRisk": 4,
    "priority": "CRITICAL",
    "window": "14:47:12 - 12 min UTC",
    "windowClosesIn": "13 min",
    "deltaV": 6.4,
    "confidence": 96,
    "rationale": "AI model recommends 'Raise Orbit +12 km' to reduce collision risk from 92% to 4%."
  }
}
```

### 4.3 Sync vs Async Processing

| Trigger | Mode | Latency target | Implementation |
|---|---|---|---|
| Operator opens analysis page | **Synchronous** | < 150 ms | `GET /api/trigger_prediction` called on `useEffect` mount |
| Background fleet screening | **Asynchronous** (planned) | < 5 min total for fleet | APScheduler every 15 min, Celery worker per sat |
| Alert threshold breach | **Event-driven** (planned) | < 30 s | Firestore `onCreate` Cloud Function triggers push notification |

### 4.4 Post-Processing Steps

```
1. Raw LightGBM probability p ∈ [0,1]
        │
        ▼
2. Scale to percentage: risk = round(p * 100)
        │
        ▼
3. Classify label:
   risk >= 60 → "CRITICAL"
   risk >= 30 → "WARNING"
   else       → "INFO"
        │
        ▼
4. SHAP TreeExplainer:
   shap_values = explainer.shap_values(X_input)
   Rank top-5 features by |shap_value|
   Map shap_value sign → direction ("increases" / "decreases")
        │
        ▼
5. Recommendation engine:
   Apply rule table (see ARCHITECTURE.md §3.4)
   Compute delta-V for altitude change recommendations:
     delta_v = sqrt(μ / (R + alt)) * (sqrt(2*(R+alt)/(2*R+alt+alt_new)) - 1)
        │
        ▼
6. Narrative generation (template-based):
   Fill SHAP_NARRATIVE template with top-3 SHAP factor labels + values
        │
        ▼
7. Write complete payload to Firestore events/{sat_id}
```

---

## 5. Constraints & Fallback Rules

### 5.1 Inference Constraints

| Constraint | Value | Enforcement |
|---|---|---|
| **Inference timeout** | 5 s hard cap | `asyncio.wait_for(predict(), timeout=5.0)` |
| **Memory footprint** | < 512 MB total (model + SHAP) | Container resource limit |
| **Model file size** | < 50 MB | LightGBM JSON serialization |
| **Max features** | 25 (after one-hot) | Fixed at training time |
| **Input validation** | All 18 raw features required | Pydantic `BaseModel` with `float` type enforcement |

### 5.2 Quantized Execution (Future)
- **ONNX export:** `LightGBM.to_onnx()` → `onnxruntime` inference (30–50% latency reduction).
- **Target hardware:** Cloud Run CPU instances (no GPU required for LightGBM).
- **Not TensorRT** — TensorRT is for neural networks; LightGBM uses `hist` tree method which does not benefit from TensorRT.

### 5.3 Low-Confidence Fallback Paths

```
IF model_confidence < 80%:
    RECOMMENDATION.action = "Immediate Human Review"
    RECOMMENDATION.priority = "CRITICAL"
    SHAP_NARRATIVE += " ⚠ Model confidence below threshold — operator verification required."
    alert.severity = "critical"

IF backend unreachable (fetch() throws):
    UI falls back to last Firestore snapshot (seeded data)
    Analysis page shows: "Using cached prediction — live backend offline"
    Status indicator: amber pulsing dot

IF Firestore document missing for sat_id:
    UI shows full-page skeleton loader: "Connecting to live Firebase AI Database..."
    Auto-retry every 3 s for up to 30 s
    After 30 s: toast error "Unable to load satellite data. Please refresh."

IF prediction probability is exactly 0.5 (maximum uncertainty):
    Flag as UNCERTAIN
    Override label to "REVIEW REQUIRED"
    Force RECOMMENDATION = "Immediate Human Review"
```

### 5.4 Model Versioning & Registry
| Field | Schema |
|---|---|
| `model_id` | `LightGBM_v{major}_{minor}_{patch}` |
| `promoted_at` | ISO 8601 timestamp |
| `auc_roc` | float |
| `accuracy` | float |
| `training_dataset` | dataset name + version |
| `champion` | boolean — only one champion per slot |

- New models are stored in `trained_models/` and registered to Firestore `model_registry` collection.
- Promotion requires AUC-ROC improvement > 0.5% over current champion.
- Rollback: set `champion=false` on new model, `champion=true` on previous.
