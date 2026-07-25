# AI Intrusion Detection System

An ML-based Intrusion Detection System (IDS) that classifies encrypted network traffic as benign or malicious using flow-level statistical features. Trained on CICIDS2017 with XGBoost, achieving **99.9% accuracy**.

## Features

- **CSV Upload** — Upload CICFlowMeter-format feature files for instant classification
- **PCAP Upload** — Upload Wireshark captures; tshark extracts flows, AI predicts threats
- **Live Capture** — Sniff network traffic in real-time with live AI threat detection
- **Interactive Dashboard** — KPI cards, pie charts, and sortable results tables

## Tech Stack

| Layer | Technology |
|---|---|
| Machine Learning | XGBoost, scikit-learn, imbalanced-learn |
| Data | pandas, numpy, joblib |
| Packet Capture | tshark (Wireshark CLI) |
| Frontend | Streamlit, Plotly |
| Dataset | CICIDS2017 (UNB) |

## Project Structure

```
ids-project/
├── app/
│   └── streamlit_app.py       # Streamlit dashboard
├── data/
│   ├── raw/                   # CICIDS2017 CSVs (not committed)
│   └── processed/             # Cleaned train/val/test splits
├── models/
│   ├── xgb_baseline.pkl       # Trained XGBoost model
│   └── scaler.pkl             # Fitted StandardScaler
├── notebooks/                 # EDA (optional)
├── reports/
│   ├── classification_report.csv
│   └── figures/
│       ├── confusion_matrix.png
│       └── roc_curve.png
├── src/
│   ├── data_pipeline.py       # Load, clean, label, split
│   ├── train.py               # Train XGBoost model
│   └── evaluate.py            # Test set evaluation + artifacts
├── requirements.txt
├── run.bat                    # Admin launcher (Windows)
└── README.md
```

## Setup

### Prerequisites

- Python 3.10+
- Wireshark / tshark (for PCAP and Live Capture features)
- CICIDS2017 dataset (request from [UNB](https://www.unb.ca/cic/datasets/ids-2017.html))

### Installation

```bash
git clone https://github.com/SenpaiDark/ids-project.git
cd ids-project
pip install -r requirements.txt
```

### Training (from scratch)

```bash
# 1. Place CICIDS2017 CSVs in data/raw/
# 2. Run pipeline
python src/data_pipeline.py

# 3. Train model
python src/train.py

# 4. Evaluate on test set
python src/evaluate.py
```

### Running the Dashboard

```bash
# Normal mode (CSV only)
streamlit run app/streamlit_app.py

# Admin mode (for PCAP & Live Capture features)
# Windows: Run Command Prompt as Administrator, then:
streamlit run app/streamlit_app.py

# Or double-click run.bat (auto-elevates to admin)
```

Open **http://localhost:8502** in your browser.

## Model Performance

| Metric | Value |
|---|---|
| Accuracy | 99.9% |
| ROC-AUC | 0.9999 |
| Precision (Attack) | 1.00 |
| Recall (Attack) | 1.00 |
| F1-Score (Attack) | 1.00 |

Confusion matrix and ROC curve saved in `reports/figures/`.

## Author

**Senpai Dark** — Final Year Project, OAUSTECH

## License

MIT
