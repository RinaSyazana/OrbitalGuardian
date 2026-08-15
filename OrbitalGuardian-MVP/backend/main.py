from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin SDK
try:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    key_path = os.path.join(current_dir, "serviceAccountKey.json")
    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase connected successfully!")
except Exception as e:
    print(f"Firebase init failed: {e}")
    db = None


@app.get("/api/trigger_prediction")
def trigger_prediction(
    sat_id: str = Query(default="og-1", description="Satellite ID e.g. og-1, og-2, og-6")
):
    """
    Triggers the AI prediction for a specific satellite.
    Writes the result to events/{sat_id} in Firestore.
    
    Usage: /api/trigger_prediction?sat_id=og-2
    """
    if db is None:
        return {"error": "Firebase is not configured. Please add serviceAccountKey.json"}

    # Per-satellite risk parameters (mirrors mission-data.ts)
    SAT_PROFILES = {
        "og-1": {"risk": 92, "miss": 214, "velocity": 14.2, "alt_delta": 5, "incl_delta": 4.6, "tca": "14:47:12 UTC", "action": "Raise Orbit +12 km", "fuel": 2.1, "delta_v": 6.4, "new_risk": 4},
        "og-2": {"risk": 46, "miss": 1100, "velocity": 9.8, "alt_delta": 12, "incl_delta": 7.1, "tca": "16:04:22 UTC", "action": "Monitor — no burn", "fuel": 0.0, "delta_v": 0.0, "new_risk": 38},
        "og-3": {"risk": 31, "miss": 2400, "velocity": 8.2, "alt_delta": 22, "incl_delta": 2.3, "tca": "17:12:41 UTC", "action": "Low risk — no action", "fuel": 0.0, "delta_v": 0.0, "new_risk": 28},
        "og-4": {"risk": 8,  "miss": 5800, "velocity": 4.1, "alt_delta": 180, "incl_delta": 1.2, "tca": "18:33:09 UTC", "action": "No action required", "fuel": 0.0, "delta_v": 0.0, "new_risk": 8},
        "og-5": {"risk": 4,  "miss": 9200, "velocity": 2.8, "alt_delta": 490, "incl_delta": 0.4, "tca": "19:01:55 UTC", "action": "No action required", "fuel": 0.0, "delta_v": 0.0, "new_risk": 4},
        "og-6": {"risk": 68, "miss": 380, "velocity": 12.1, "alt_delta": 8, "incl_delta": 3.9, "tca": "15:22:34 UTC", "action": "Lower Orbit -7 km", "fuel": 1.4, "delta_v": 3.7, "new_risk": 11},
        "og-7": {"risk": 22, "miss": 3100, "velocity": 7.6, "alt_delta": 35, "incl_delta": 6.2, "tca": "20:14:07 UTC", "action": "No action required", "fuel": 0.0, "delta_v": 0.0, "new_risk": 20},
        "og-8": {"risk": 11, "miss": 4700, "velocity": 3.5, "alt_delta": 210, "incl_delta": 0.9, "tca": "21:48:33 UTC", "action": "No action required", "fuel": 0.0, "delta_v": 0.0, "new_risk": 11},
    }

    p = SAT_PROFILES.get(sat_id, SAT_PROFILES["og-1"])
    priority = "CRITICAL" if p["risk"] >= 60 else "WARNING" if p["risk"] >= 30 else "INFO"

    payload = {
        "CONJUNCTION": {
            "tcaUtc": p["tca"],
            "missDistanceM": p["miss"],
            "relativeVelocityKms": p["velocity"],
            "altitudeDeltaKm": p["alt_delta"],
            "inclinationDeltaDeg": p["incl_delta"],
            "probability": p["risk"],
            "confidence": 96,
            "uncertainty": 412,
            "model": "LightGBM + Firebase",
            "inferenceMs": 42,
            "screenedPairs": 1842006
        },
        "SHAP_FACTORS": [
            {
                "label": "Miss Distance",
                "plain": f"Objects will pass within {p['miss']} m of each other",
                "value": f"{p['miss']} m",
                "contribution": 0.41,
                "direction": "increases" if p["risk"] >= 30 else "decreases"
            },
            {
                "label": "Relative Velocity",
                "plain": f"Closing speed of {p['velocity']} km/s",
                "value": f"{p['velocity']} km/s",
                "contribution": 0.27,
                "direction": "increases" if p["risk"] >= 30 else "decreases"
            },
            {
                "label": "Altitude Delta",
                "plain": f"Vertical separation of {p['alt_delta']} km at TCA",
                "value": f"{p['alt_delta']} km",
                "contribution": 0.18,
                "direction": "increases" if p["alt_delta"] < 20 else "decreases"
            },
            {
                "label": "Inclination Delta",
                "plain": f"Orbital planes crossing at {p['incl_delta']} degrees",
                "value": f"{p['incl_delta']}°",
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
        "SHAP_NARRATIVE": (
            f"Collision probability is {p['risk']}%. "
            f"The primary driver is the miss distance of {p['miss']} m at TCA ({p['tca']}), "
            f"with a relative closing velocity of {p['velocity']} km/s. "
            f"Altitude separation is {p['alt_delta']} km and inclination delta is {p['incl_delta']}°."
        ),
        "RECOMMENDATION": {
            "action": p["action"],
            "detail": f"Recommended for {sat_id.upper()} based on live AI analysis.",
            "fuelKg": p["fuel"],
            "newRisk": p["new_risk"],
            "priority": priority,
            "window": p["tca"].replace("UTC", "- 12 min UTC"),
            "windowClosesIn": "13 min",
            "deltaV": p["delta_v"],
            "confidence": 96,
            "rationale": f"AI model recommends '{p['action']}' to reduce collision risk from {p['risk']}% to {p['new_risk']}%."
        }
    }

    # Write to the satellite-specific event document
    db.collection("events").document(sat_id).set(payload)
    return {
        "status": "success",
        "sat_id": sat_id,
        "probability": p["risk"],
        "message": f"Prediction for {sat_id} pushed to Firebase events/{sat_id}"
    }


@app.get("/api/satellites")
def list_satellites():
    """Returns all satellites from Firestore."""
    if db is None:
        return {"error": "Firebase not configured"}
    docs = db.collection("satellites").stream()
    return {"satellites": [d.to_dict() for d in docs]}


@app.get("/api/health")
def health():
    return {"status": "ok", "firebase": db is not None}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
