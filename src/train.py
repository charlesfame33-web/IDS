import pandas as pd
import numpy as np
import joblib
import xgboost as xgb
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import time

PROCESSED_DIR = "data/processed"
MODEL_DIR = "models"


def load_data():
    print("Loading data...")
    X_train = pd.read_parquet(f"{PROCESSED_DIR}/X_train.parquet")
    X_val = pd.read_parquet(f"{PROCESSED_DIR}/X_val.parquet")
    X_test = pd.read_parquet(f"{PROCESSED_DIR}/X_test.parquet")
    y_train = pd.read_parquet(f"{PROCESSED_DIR}/y_train.parquet").values.ravel()
    y_val = pd.read_parquet(f"{PROCESSED_DIR}/y_val.parquet").values.ravel()
    y_test = pd.read_parquet(f"{PROCESSED_DIR}/y_test.parquet").values.ravel()

    print(f"Train: {X_train.shape}, Val: {X_val.shape}, Test: {X_test.shape}")
    return X_train, X_val, X_test, y_train, y_val, y_test


def main():
    X_train, X_val, X_test, y_train, y_val, y_test = load_data()

    sample_size = 100000
    rng = np.random.default_rng(42)
    indices = rng.choice(len(X_train), sample_size, replace=False)
    X_train_sampled = X_train.iloc[indices]
    y_train_sampled = y_train[indices]
    print(f"Training on {sample_size} samples")

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_sampled)
    X_val_scaled = scaler.transform(X_val)
    print("Scaling complete")

    print("\nTraining XGBoost (ultra-fast mode)...")
    start = time.time()
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        tree_method="hist",
        n_jobs=-1,
        random_state=42,
    )
    model.fit(X_train_scaled, y_train_sampled)
    print(f"Trained in {time.time() - start:.2f} seconds")

    print("\nEvaluating on Validation Set...")
    y_pred = model.predict(X_val_scaled)
    y_proba = model.predict_proba(X_val_scaled)[:, 1]

    print("\n" + "=" * 60)
    print("CLASSIFICATION REPORT")
    print("=" * 60)
    print(classification_report(y_val, y_pred, target_names=["BENIGN", "ATTACK"]))

    print("\n" + "=" * 60)
    print("CONFUSION MATRIX")
    print("=" * 60)
    cm = confusion_matrix(y_val, y_pred)
    print(pd.DataFrame(
        cm,
        index=["Actual BENIGN", "Actual ATTACK"],
        columns=["Pred BENIGN", "Pred ATTACK"],
    ))

    auc = roc_auc_score(y_val, y_proba)
    print(f"\nROC-AUC Score: {auc:.4f}")

    import os
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, f"{MODEL_DIR}/xgb_baseline.pkl")
    joblib.dump(scaler, f"{MODEL_DIR}/scaler.pkl")
    print(f"\nModel saved to {MODEL_DIR}/xgb_baseline.pkl")
    print(f"Scaler saved to {MODEL_DIR}/scaler.pkl")


if __name__ == "__main__":
    main()
