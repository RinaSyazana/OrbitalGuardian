import pandas as pd
import numpy as np

def extract_orbital_features(df):
    """
    Extracts the exact orbital Keplerian elements from the ESA/Kaggle dataset for both 
    the Target (t) and Chaser (c) objects, as specified in the Phase 3 Architecture.
    """
    print("Extracting Orbital Features...")
    features = pd.DataFrame(index=df.index)
    
    # Target Satellite Orbital Features
    features['Target_SMA'] = df.get('t_j2k_sma', 0)
    features['Target_Eccentricity'] = df.get('t_j2k_ecc', 0)
    features['Target_Inclination'] = df.get('t_j2k_inc', 0)
    
    # Chaser/Debris Orbital Features
    features['Chaser_SMA'] = df.get('c_j2k_sma', 0)
    features['Chaser_Eccentricity'] = df.get('c_j2k_ecc', 0)
    features['Chaser_Inclination'] = df.get('c_j2k_inc', 0)
    
    # Uncertainty/Covariance features (very important for collision physics)
    features['Target_Sigma_R'] = df.get('t_sigma_r', 0)
    features['Chaser_Sigma_R'] = df.get('c_sigma_r', 0)
    
    # One-hot encode the chaser object type (Debris, Payload, Rocket Body, Unknown)
    if 'c_object_type' in df.columns:
        # Assuming c_object_type is a string like 'DEBRIS', 'PAYLOAD', etc., or numeric.
        # We will keep it simple and just include it as numeric if it is, or dummy it.
        # In the ESA dataset it's usually a string or categorical. Let's force it to categorical codes if string.
        features['Chaser_Type'] = pd.factorize(df['c_object_type'])[0]
        
    return features

def extract_relative_features(df):
    """
    Extracts geometric and relative features between the two objects.
    """
    print("Extracting Relative Features...")
    features = pd.DataFrame(index=df.index)
    
    features['Relative_Distance'] = df.get('miss_distance', 0)
    features['Relative_Speed'] = df.get('relative_speed', 0)
    features['Time_to_TCA'] = df.get('time_to_tca', 0)
    
    # 3D Relative Position in RTN frame
    features['Rel_Pos_R'] = df.get('relative_position_r', 0)
    features['Rel_Pos_T'] = df.get('relative_position_t', 0)
    features['Rel_Pos_N'] = df.get('relative_position_n', 0)
    
    return features

def extract_environmental_features(df):
    """
    Extracts environmental factors like solar flux (F10.7) which impacts atmospheric drag.
    """
    print("Extracting Environmental Features...")
    features = pd.DataFrame(index=df.index)
    
    features['Solar_Flux_F10'] = df.get('F10', 0)
    features['Solar_Flux_F3M'] = df.get('F3M', 0)
    features['Geomagnetic_AP'] = df.get('AP', 0)
    
    return features

def build_feature_matrix(input_csv="data/clean_sample.csv", output_csv="data/features_ready.csv"):
    """
    Reads the cleaned data, applies exact feature engineering, and saves the final matrix.
    """
    df = pd.read_csv(input_csv)
    
    orb_feat = extract_orbital_features(df)
    rel_feat = extract_relative_features(df)
    env_feat = extract_environmental_features(df)
    
    # Combine features
    X = pd.concat([orb_feat, rel_feat, env_feat], axis=1)
    
    # Target variable: Is it a high risk collision?
    # ESA dataset provides risk as a log-10 probability (e.g., -5.4 means 10^-5.4)
    # The industry standard critical threshold is 10^-6 (log10 = -6)
    if 'risk' in df.columns:
        y = (df['risk'] > -6.0).astype(int)
    else:
        raise ValueError("The 'risk' column is missing from the dataset. Cannot generate target labels.")
        
    X['Target_HighRisk'] = y
    
    # Fill any remaining NaNs with 0
    X = X.fillna(0)
    
    X.to_csv(output_csv, index=False)
    print(f"Feature matrix saved to {output_csv} with shape {X.shape}")
    print(f"Total High Risk events in sample: {y.sum()} out of {len(y)}")
    return X

if __name__ == "__main__":
    build_feature_matrix()
