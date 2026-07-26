# AI Intrusion Detection System

Detect network attacks in encrypted traffic using XGBoost (99.9% accuracy) on CICIDS2017.  
Supports CSV upload, PCAP analysis, and real-time live capture.

## 🚀 Quick Start (CSV & PCAP only — no admin needed)

1. Install **Python 3.10+**
2. Open terminal and run:
   ```bash
   git clone https://github.com/SenpaiDark/IDS.git
   cd IDS
   pip install -r requirements.txt
   streamlit run app/streamlit_app.py
   ```

## 🛡️ Full Package (with Live Capture)

Live Capture requires **Wireshark / tshark** + **Administrator** privileges.

1. Install **Wireshark** from [wireshark.org](https://wireshark.org) (tshark is bundled)
2. Open terminal **as Administrator** and run:
   ```bash
   git clone https://github.com/SenpaiDark/IDS.git
   cd IDS
   pip install -r requirements.txt
   python -m streamlit run app/streamlit_app.py --server.headless true --server.port 8502
   ```
   Or just double-click **`run.bat`** (auto-elevates to admin).

## 🤖 AI Assistant
- Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com)
- Paste it in the **Configure Gemini API Key** expander inside the app

## Docker
```bash
docker compose build
docker compose up
```
Requires `network_mode: "host"` and `privileged: true` for live capture support.  
Without live capture (CSV/PCAP only):
```bash
docker build -t ids-app .
docker run -p 8501:8501 ids-app
```

## Features
- **CSV Upload** – Classify pre-extracted flow features.
- **PCAP Upload** – Upload Wireshark captures for instant analysis.
- **Live Capture** – Monitor your network interface in real-time.
- **AI Explanations** – Get plain-English explanations for detected attacks (Gemini API optional).
- **Matrix Theme** – Full-screen animated falling code background with neon green styling.

## Tech Stack
- Python 3.10+
- XGBoost, Scikit-learn
- Streamlit, Plotly
- tshark (Wireshark) for packet capture
- Google Gemini (optional for explanations)

## Dataset
Trained on CICIDS2017 (3.37M flows, 71 features, all attack types).

## Results
- Accuracy: 99.9%
- ROC-AUC: 0.9999
- Confusion matrix: reports/figures/

## Project Structure
```
ids-project/
├── app/
│   └── streamlit_app.py       # Streamlit dashboard
├── src/
│   ├── data_pipeline.py       # Load, clean, label, split
│   ├── train.py               # Train XGBoost model
│   └── evaluate.py            # Test set evaluation + artifacts
├── data/
│   ├── raw/                   # CICIDS2017 CSVs (not committed)
│   └── processed/             # Cleaned train/val/test splits
├── models/
│   ├── xgb_baseline.pkl       # Trained XGBoost model
│   └── scaler.pkl             # Fitted StandardScaler
├── reports/
│   ├── classification_report.csv
│   └── figures/
│       ├── confusion_matrix.png
│       └── roc_curve.png
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── run.bat
└── README.md
```

## Contributors
- **Segun Oyeduntan** – Owner
- **Senpai Dark** – Developer

## License
MIT – for educational use.
