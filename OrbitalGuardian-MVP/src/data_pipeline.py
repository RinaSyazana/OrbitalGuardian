import os
import pandas as pd
import requests

def download_celestrak_data(output_path="data/celestrak_active.txt"):
    """
    Downloads the active satellites TLE from CelesTrak.
    """
    url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle"
    print(f"Downloading CelesTrak data from {url}...")
    response = requests.get(url)
    if response.status_code == 200:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(response.content)
        print("CelesTrak data successfully downloaded.")
    else:
        print(f"Failed to download CelesTrak data. Status code: {response.status_code}")

def load_collision_data(train_path="data/collision-avoidance-challenge/train_data.csv", nrows=None):
    """
    Loads the Kaggle Collision Avoidance Challenge training data.
    Due to its size, nrows can be specified for testing/MVP purposes.
    """
    print(f"Loading collision avoidance data from {train_path}...")
    if not os.path.exists(train_path):
        raise FileNotFoundError(f"Dataset not found at {train_path}")
    df = pd.read_csv(train_path, nrows=nrows)
    print(f"Loaded {len(df)} rows.")
    return df

def load_space_debris_data(path="data/space-debris-&-satellite-orbits-2026/space_debris_dataset.csv"):
    """
    Loads the Space Debris Orbits 2026 dataset for visualization and extra features.
    """
    print(f"Loading space debris data from {path}...")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset not found at {path}")
    df = pd.read_csv(path)
    print(f"Loaded {len(df)} space debris objects.")
    return df

def clean_data(df):
    """
    Basic data cleaning: drop missing target rows, fill numeric NA, etc.
    """
    print("Cleaning data...")
    # Example generic cleaning
    df = df.dropna(subset=['risk'] if 'risk' in df.columns else df.columns[0:1])
    df = df.fillna(0)
    print("Data cleaning complete.")
    return df

if __name__ == "__main__":
    download_celestrak_data()
    # For MVP, we can load a subset to avoid memory issues during testing
    df_train = load_collision_data(nrows=50000)
    df_clean = clean_data(df_train)
    # Save a small subset for feature engineering testing
    df_clean.to_csv("data/clean_sample.csv", index=False)
    print("Data pipeline executed successfully.")
