import pandas as pd
import numpy as np
import joblib
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc
import matplotlib.pyplot as plt
import seaborn as sns
import os

PROCESSED_DIR = "data/processed"
MODEL_DIR = "models"
REPORT_DIR = "reports"

def main():
    print("Loading test set...")
    X_test = pd.read_parquet(f"{PROCESSED_DIR}/X_test.parquet")
    y_test = pd.read_parquet(f"{PROCESSED_DIR}/y_test.parquet").values.ravel()

    model = joblib.load(f"{MODEL_DIR}/xgb_baseline.pkl")
    scaler = joblib.load(f"{MODEL_DIR}/scaler.pkl")

    print("Predicting on test set...")
    X_test_scaled = scaler.transform(X_test)
    y_pred = model.predict(X_test_scaled)
    y_proba = model.predict_proba(X_test_scaled)[:, 1]

    print("\n" + "=" * 60)
    print("FINAL TEST SET EVALUATION")
    print("=" * 60)
    print(classification_report(y_test, y_pred, target_names=["BENIGN", "ATTACK"]))

    cm = confusion_matrix(y_test, y_pred)
    print("\nConfusion Matrix:")
    print(pd.DataFrame(
        cm,
        index=["Actual BENIGN", "Actual ATTACK"],
        columns=["Pred BENIGN", "Pred ATTACK"],
    ))

    os.makedirs(f"{REPORT_DIR}/figures", exist_ok=True)

    plt.figure(figsize=(8, 6))
    sns.heatmap(
        cm, annot=True, fmt="d", cmap="Blues",
        xticklabels=["BENIGN", "ATTACK"],
        yticklabels=["BENIGN", "ATTACK"],
    )
    plt.title("Confusion Matrix - Test Set")
    plt.tight_layout()
    plt.savefig(f"{REPORT_DIR}/figures/confusion_matrix.png", dpi=300)
    print("\nConfusion matrix saved to reports/figures/confusion_matrix.png")

    fpr, tpr, _ = roc_curve(y_test, y_proba)
    roc_auc = auc(fpr, tpr)

    plt.figure(figsize=(8, 6))
    plt.plot(fpr, tpr, label=f"XGBoost (AUC = {roc_auc:.4f})", linewidth=2)
    plt.plot([0, 1], [0, 1], "k--", label="Random Chance")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve - Test Set")
    plt.legend()
    plt.tight_layout()
    plt.savefig(f"{REPORT_DIR}/figures/roc_curve.png", dpi=300)
    print("ROC curve saved to reports/figures/roc_curve.png")

    report_df = pd.DataFrame(
        classification_report(y_test, y_pred, target_names=["BENIGN", "ATTACK"], output_dict=True)
    ).transpose()
    report_df.to_csv(f"{REPORT_DIR}/classification_report.csv")
    print("Classification report saved to reports/classification_report.csv")

    print("\nAll report artifacts generated in reports/")


if __name__ == "__main__":
    main()
