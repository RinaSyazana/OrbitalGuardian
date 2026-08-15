import pandas as pd
import numpy as np
import xgboost as xgb
import shap
import json
import warnings
warnings.filterwarnings('ignore')

import lightgbm as lgb

def load_data_and_model(data_path="data/features_ready.csv", model_path="data/lightgbm_production.txt"):
    print("Loading feature matrix and LightGBM model...")
    df = pd.read_csv(data_path)
    X = df.drop(columns=['Target_HighRisk'])
    
    model = lgb.Booster(model_file=model_path)
    
    return X, model

def generate_shap_values(X, model, sample_size=100):
    print(f"Calculating SHAP values for {sample_size} sample predictions...")
    # We take a sample because calculating SHAP for millions of rows is very slow
    X_sample = X.sample(n=min(sample_size, len(X)), random_state=42)
    
    # TreeExplainer is extremely fast for XGBoost
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_sample)
    
    return explainer, shap_values, X_sample

def generate_human_readable_explanation(instance_index, X_sample, shap_values, feature_names):
    """
    Translates SHAP mathematical values into a human-readable sentence for operators.
    """
    # Get the feature values and their corresponding SHAP contributions for a specific event
    instance_features = X_sample.iloc[instance_index]
    instance_shap = shap_values[instance_index]
    
    # Sort features by absolute SHAP value (impact on the prediction)
    feature_impacts = list(zip(feature_names, instance_features, instance_shap))
    feature_impacts.sort(key=lambda x: abs(x[2]), reverse=True)
    
    # Get the top 3 features pushing the risk higher (positive SHAP)
    top_risk_drivers = [f for f in feature_impacts if f[2] > 0][:3]
    
    if not top_risk_drivers:
        return "Collision risk is low. No major risk factors detected."
    
    explanation = "Collision risk is heavily influenced because: \n"
    for feature_name, feature_val, shap_val in top_risk_drivers:
        explanation += f"- {feature_name} (Value: {feature_val:.2f}) increased the risk significantly.\n"
        
    return explanation

def run_explainability_pipeline():
    X, model = load_data_and_model()
    
    # Get SHAP values
    explainer, shap_values, X_sample = generate_shap_values(X, model)
    
    # Generate an explanation for the first high-risk prediction in our sample
    # LightGBM booster predict returns probabilities
    probs = model.predict(X_sample)
    high_risk_indices = np.where(probs > 0.5)[0]
    
    if len(high_risk_indices) > 0:
        target_idx = high_risk_indices[0]
        print(f"\n--- XAI Report for High-Risk Event #{target_idx} ---")
        explanation = generate_human_readable_explanation(target_idx, X_sample, shap_values, X.columns)
        print(explanation)
        
        # Save a sample explanation for the backend to use
        report = {
            "event_index": int(target_idx),
            "explanation_text": explanation
        }
        with open("data/sample_explanation.json", "w") as f:
            json.dump(report, f, indent=4)
        print("Saved sample explanation to 'data/sample_explanation.json'")
    else:
        print("\nNo high-risk events found in the sample to explain.")

if __name__ == "__main__":
    run_explainability_pipeline()
