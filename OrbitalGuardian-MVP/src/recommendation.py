import json
import random

def generate_recommendation(risk_probability, miss_distance, relative_speed):
    """
    Phase 6: Rule-Based Expert System for Decision Support.
    Translates AI predictions into actionable operational maneuvers.
    """
    
    # 1. Safe Scenario
    if risk_probability < 0.5:
        return {
            "status": "Safe",
            "action": "Continue standard monitoring.",
            "estimated_new_risk": risk_probability
        }
        
    # 2. Critical High-Risk Scenario
    if miss_distance < 1000 and relative_speed > 5000:
        return {
            "status": "CRITICAL",
            "action": "Immediate collision avoidance maneuver required. Recommend raising orbit altitude by +5km.",
            "estimated_new_risk": 0.000001
        }
        
    # 3. Warning Scenario
    return {
        "status": "WARNING",
        "action": "Close approach detected. Recommend minor phasing maneuver (+1km).",
        "estimated_new_risk": 0.0001
    }

def run_recommendation_engine():
    print("Running Decision Recommendation Engine (Phase 6)...")
    
    # In a real pipeline, we would load the specific prediction values here.
    # We will simulate a High-Risk event based on typical Kaggle dataset values.
    simulated_risk_prob = 0.92
    simulated_miss_distance = 450.5 # meters
    simulated_rel_speed = 14200.0   # meters/second
    
    print(f"Detected Event -> Probability: {simulated_risk_prob*100}%, Distance: {simulated_miss_distance}m")
    
    recommendation = generate_recommendation(
        risk_probability=simulated_risk_prob,
        miss_distance=simulated_miss_distance,
        relative_speed=simulated_rel_speed
    )
    
    print(f"\nRecommended Action: {recommendation['action']}")
    print(f"Status Level: {recommendation['status']}")
    
    with open("data/sample_recommendation.json", "w") as f:
        json.dump(recommendation, f, indent=4)
        
    print("\nRecommendation saved to 'data/sample_recommendation.json' for the React Dashboard.")

if __name__ == "__main__":
    run_recommendation_engine()
