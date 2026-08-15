import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import lightgbm as lgb
import json

def load_data(path="data/features_ready.csv"):
    df = pd.read_csv(path)
    X = df.drop(columns=['Target_HighRisk'])
    y = df['Target_HighRisk']
    return train_test_split(X, y, test_size=0.2, random_state=42)

def evaluate_model(name, model, X_test, y_test):
    preds = model.predict(X_test)
    probs = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else preds
    
    metrics = {
        "Accuracy": accuracy_score(y_test, preds),
        "Precision": precision_score(y_test, preds, zero_division=0),
        "Recall": recall_score(y_test, preds, zero_division=0),
        "F1-Score": f1_score(y_test, preds, zero_division=0),
        "ROC-AUC": roc_auc_score(y_test, probs)
    }
    
    print(f"--- {name} Performance ---")
    for k, v in metrics.items():
        print(f"{k}: {v:.4f}")
    print("\n")
    return metrics

def train_and_compare():
    X_train, X_test, y_train, y_test = load_data()
    
    # Calculate scale_pos_weight to handle the massive class imbalance!
    # Formula: count(negative examples) / count(positive examples)
    neg_count = (y_train == 0).sum()
    pos_count = (y_train == 1).sum()
    class_weight = neg_count / pos_count if pos_count > 0 else 1.0
    
    print(f"Class Imbalance Detected. Negative: {neg_count}, Positive: {pos_count}")
    print(f"Applying scale_pos_weight: {class_weight:.2f}\n")
    
    print("Training Random Forest (Baseline)...")
    # Random Forest uses class_weight="balanced"
    rf_model = RandomForestClassifier(n_estimators=50, max_depth=5, class_weight="balanced", random_state=42)
    rf_model.fit(X_train, y_train)
    rf_metrics = evaluate_model("Random Forest", rf_model, X_test, y_test)
    
    print("Training LightGBM...")
    # LightGBM uses scale_pos_weight
    lgb_model = lgb.LGBMClassifier(n_estimators=50, max_depth=5, scale_pos_weight=class_weight, random_state=42, verbose=-1)
    lgb_model.fit(X_train, y_train)
    lgb_metrics = evaluate_model("LightGBM", lgb_model, X_test, y_test)
    
    print("Training XGBoost (Production Model)...")
    # XGBoost uses scale_pos_weight
    xgb_model = xgb.XGBClassifier(n_estimators=50, max_depth=5, learning_rate=0.1, scale_pos_weight=class_weight, random_state=42)
    xgb_model.fit(X_train, y_train)
    xgb_metrics = evaluate_model("XGBoost", xgb_model, X_test, y_test)
    
    # Save the production model
    lgb_model.booster_.save_model("data/lightgbm_production.txt")
    print("LightGBM production model saved to 'data/lightgbm_production.txt'")
    
    # Save a summary report
    report = {
        "Random Forest": rf_metrics,
        "LightGBM": lgb_metrics,
        "XGBoost": xgb_metrics
    }
    with open("data/model_comparison_report.json", "w") as f:
        json.dump(report, f, indent=4)
    print("Model comparison report saved to 'data/model_comparison_report.json'")

if __name__ == "__main__":
    train_and_compare()
