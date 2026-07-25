import streamlit as st
import pandas as pd
import numpy as np
import joblib
import plotly.express as px
import subprocess
import tempfile
import os
import time
import re
from collections import defaultdict
import google.generativeai as genai

st.set_page_config(
    page_title="AI Intrusion Detection System",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

if "dark_mode" not in st.session_state:
    st.session_state.dark_mode = False
if "api_key" not in st.session_state:
    st.session_state.api_key = ""

dark_mode = st.sidebar.toggle("🌙 Dark Mode (Matrix)", value=st.session_state.dark_mode)
if dark_mode != st.session_state.dark_mode:
    st.session_state.dark_mode = dark_mode
    st.rerun()

if st.session_state.dark_mode:
    matrix_css = """
    <style>
        @keyframes fall {
            0% { transform: translateY(-100%); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
        .matrix-bg {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: -1; background: #0a0f0a; overflow: hidden; pointer-events: none;
            font-family: 'Courier New', monospace; font-size: 18px;
            color: #00ff41; text-shadow: 0 0 5px #00ff41, 0 0 10px #00ff41;
        }
        .matrix-bg div {
            float: left; width: 30px; text-align: center;
            animation: fall 8s linear infinite;
            animation-delay: calc(var(--d) * 0.3s);
        }
        .stApp { background: transparent !important; }
        .stApp > header, .stApp > footer { background: transparent !important; }
        .main > div {
            background: rgba(10, 15, 10, 0.88) !important;
            backdrop-filter: blur(4px); border-radius: 20px; padding: 1.5rem;
            margin: 0.5rem; border: 1px solid rgba(0, 255, 65, 0.2);
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.05);
        }
        h1, h2, h3, h4, p, li, label, .stMarkdown, .stText, .stCaption {
            color: #c0d8c0 !important;
        }
        .hero-title {
            background: linear-gradient(90deg, #00ff41, #00cc33);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(0, 255, 65, 0.2);
        }
        .hero-badge { border-color: #00ff41; color: #00ff41; background: rgba(0, 255, 65, 0.1); }
        .stButton button {
            background: linear-gradient(90deg, #00cc33, #009926) !important;
            color: #0a0f0a !important; border: none !important;
            border-radius: 50px !important; font-weight: 700 !important;
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
        }
        .stButton button:hover { box-shadow: 0 0 40px rgba(0, 255, 65, 0.4); transform: scale(1.02); }
        .stTabs [aria-selected="true"] {
            background: linear-gradient(90deg, #00cc33, #009926) !important;
            color: #0a0f0a !important;
        }
        .stTabs [data-baseweb="tab"] { color: #80a080; }
        [data-testid="metric-container"] {
            background: rgba(0, 20, 0, 0.6); border: 1px solid rgba(0, 255, 65, 0.15);
            backdrop-filter: blur(5px);
        }
        #MainMenu, footer, header { visibility: hidden; }
    </style>
    <div class="matrix-bg">
        <div style="--d:0;">0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1</div>
        <div style="--d:1;">1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0</div>
        <div style="--d:2;">0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1</div>
        <div style="--d:3;">1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0</div>
        <div style="--d:4;">0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1</div>
        <div style="--d:5;">1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0</div>
        <div style="--d:6;">0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1</div>
        <div style="--d:7;">1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0</div>
        <div style="--d:8;">0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1</div>
        <div style="--d:9;">1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0</div>
        <div style="--d:10;">0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1</div>
        <div style="--d:11;">1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0</div>
        <div style="--d:12;">0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1</div>
        <div style="--d:13;">1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0</div>
        <div style="--d:14;">0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1</div>
        <div style="--d:15;">1<br>0<br>1<br>0<br>1<br>0<br>1<br>0<br>1<br>0</div>
    </div>
    """
    st.markdown(matrix_css, unsafe_allow_html=True)
else:
    light_css = """
    <style>
        .stApp { background: #faf8f5; color: #1a1a1a; }
        .hero-title { background: linear-gradient(90deg, #009926, #00cc33); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .feature-card { background: #ffffff; border: 1px solid #e8e4e0; border-radius: 20px; padding: 1.5rem; box-shadow: 0 8px 30px rgba(0,0,0,0.04); }
        .feature-card:hover { border-color: #00cc33; box-shadow: 0 12px 40px rgba(0, 204, 51, 0.08); }
        .stButton button { background: linear-gradient(90deg, #00cc33, #009926) !important; color: white !important; border: none !important; border-radius: 50px !important; }
        .stTabs [aria-selected="true"] { background: linear-gradient(90deg, #00cc33, #009926) !important; color: white !important; }
        .hero-badge { border-color: #00cc33; color: #00cc33; }
        [data-testid="metric-container"] { background: #ffffff; border: 1px solid #ece8e4; }
        h1, h2, h3, h4, p, li { color: #1a1a1a; }
        #MainMenu, footer, header { visibility: hidden; }
    </style>
    """
    st.markdown(light_css, unsafe_allow_html=True)

@st.cache_resource
def load_artifacts():
    model = joblib.load("models/xgb_baseline.pkl")
    scaler = joblib.load("models/scaler.pkl")
    X_ref = pd.read_parquet("data/processed/X_train.parquet")
    return model, scaler, X_ref.columns.tolist()

model, scaler, feature_cols = load_artifacts()

with st.sidebar:
    st.markdown("### 🤖 AI Explainer")
    st.caption("Get a free Gemini key at aistudio.google.com")
    api_key_input = st.text_input("Enter Gemini API Key", type="password", value=st.session_state.api_key)
    if api_key_input:
        st.session_state.api_key = api_key_input
        genai.configure(api_key=api_key_input)
    st.markdown("---")
    st.caption("🛡️ AI IDS v2.0")

def get_tshark_path():
    common_paths = ["C:\\Program Files\\Wireshark\\tshark.exe", "C:\\Program Files (x86)\\Wireshark\\tshark.exe"]
    try:
        subprocess.run(["tshark", "-v"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return "tshark"
    except:
        pass
    for p in common_paths:
        if os.path.exists(p):
            return p
    return None

TSHARK_PATH = get_tshark_path()

def get_interfaces():
    if not TSHARK_PATH:
        return []
    try:
        result = subprocess.run([TSHARK_PATH, "-D"], capture_output=True, text=True, timeout=5)
        if result.returncode != 0:
            return []
        lines = result.stdout.strip().split("\n")
        interfaces = []
        for line in lines:
            match = re.match(r"^\d+\.\s+(.+)$", line)
            if match:
                full = match.group(1)
                if "(" in full and full.endswith(")"):
                    last_paren = full.rfind("(")
                    raw_device = full[:last_paren].strip()
                    friendly = full[last_paren + 1:-1].strip()
                else:
                    raw_device = full
                    friendly = full
                interfaces.append((friendly, raw_device))
        return interfaces
    except:
        return []

def extract_flows(pcap_bytes):
    if not TSHARK_PATH:
        return pd.DataFrame(columns=feature_cols)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pcap") as tmp:
        tmp.write(pcap_bytes)
        tmp_path = tmp.name
    cmd = [TSHARK_PATH, "-r", tmp_path, "-T", "fields",
           "-e", "frame.time_relative", "-e", "ip.src", "-e", "ip.dst",
           "-e", "tcp.srcport", "-e", "tcp.dstport",
           "-e", "udp.srcport", "-e", "udp.dstport",
           "-e", "frame.len", "-e", "ip.proto",
           "-E", "header=n", "-E", "separator=,"]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        lines = result.stdout.strip().split("\n")
    except:
        os.unlink(tmp_path)
        return pd.DataFrame(columns=feature_cols)
    os.unlink(tmp_path)
    if not lines:
        return pd.DataFrame(columns=feature_cols)
    data = []
    for line in lines:
        parts = line.split(",")
        if len(parts) < 8:
            continue
        try:
            t = float(parts[0])
            src = parts[1]
            dst = parts[2]
            ts = parts[3] if parts[3] else "0"
            td = parts[4] if parts[4] else "0"
            us = parts[5] if parts[5] else "0"
            ud = parts[6] if parts[6] else "0"
            l = int(parts[7])
            p = int(parts[8]) if parts[8] else 0
            if ts != "0" and td != "0":
                sport, dport = int(ts), int(td)
            elif us != "0" and ud != "0":
                sport, dport = int(us), int(ud)
            else:
                sport, dport = 0, 0
            data.append({"time": t, "src": src, "dst": dst, "sport": sport, "dport": dport, "proto": p, "len": l})
        except:
            pass
    if not data:
        return pd.DataFrame(columns=feature_cols)
    flows = defaultdict(lambda: {"packets": 0, "bytes": 0, "start": None, "end": None})
    for pkt in data:
        key = (pkt["src"], pkt["dst"], pkt["sport"], pkt["dport"], pkt["proto"])
        f = flows[key]
        f["packets"] += 1
        f["bytes"] += pkt["len"]
        if f["start"] is None or pkt["time"] < f["start"]:
            f["start"] = pkt["time"]
        if f["end"] is None or pkt["time"] > f["end"]:
            f["end"] = pkt["time"]
    rows = []
    for (src, dst, sport, dport, proto), v in flows.items():
        dur = max(v["end"] - v["start"], 0.001)
        tp = v["packets"]
        tb = v["bytes"]
        fp = tp // 2
        bp = tp - fp
        fb = tb // 2
        bb = tb - fb
        row = {
            "Flow Duration": dur,
            "Total Fwd Packets": fp,
            "Total Backward Packets": bp,
            "Total Length of Fwd Packets": fb,
            "Total Length of Bwd Packets": bb,
            "Fwd Packet Length Mean": fb / max(1, fp),
            "Bwd Packet Length Mean": bb / max(1, bp),
            "Flow Bytes/s": tb / dur,
            "Flow Packets/s": tp / dur,
            "Flow IAT Mean": dur / max(1, tp),
            "Fwd IAT Total": dur,
            "Bwd IAT Total": dur,
            "Fwd PSH Flags": 0,
            "Bwd PSH Flags": 0,
            "Fwd URG Flags": 0,
            "Bwd URG Flags": 0,
            "FWD Header Length": 20,
            "BWD Header Length": 20,
            "Fwd Packets/s": fp / dur,
            "Bwd Packets/s": bp / dur,
            "Min Packet Length": 40,
            "Max Packet Length": 1500,
            "Packet Length Mean": tb / max(1, tp),
            "Packet Length Std": 100,
            "Packet Length Variance": 10000,
            "FIN Flag Count": 0,
            "SYN Flag Count": 0,
            "RST Flag Count": 0,
            "PSH Flag Count": 0,
            "ACK Flag Count": 0,
            "URG Flag Count": 0,
            "CWE Flag Count": 0,
            "ECE Flag Count": 0,
            "Down/Up Ratio": 1.0,
            "Average Packet Size": tb / max(1, tp),
            "Avg FWD Segment Size": fb / max(1, fp),
            "Avg BWD Segment Size": bb / max(1, bp),
            "Fwd Header Length.1": 20,
            "Fwd Avg Bytes/Bulk": 0,
            "Fwd Avg Packets/Bulk": 0,
            "Fwd Avg Bulk Rate": 0,
            "Bwd Avg Bytes/Bulk": 0,
            "Bwd Avg Packets/Bulk": 0,
            "Bwd Avg Bulk Rate": 0,
            "Subflow Fwd Packets": fp,
            "Subflow Fwd Bytes": fb,
            "Subflow Bwd Packets": bp,
            "Subflow Bwd Bytes": bb,
            "Init_Win_bytes_forward": 65535,
            "Init_Win_bytes_backward": 65535,
            "act_data_pkt_fwd": 0,
            "min_seg_size_forward": 40,
            "Active Mean": dur / 2,
            "Active Std": dur / 4,
            "Active Max": dur,
            "Active Min": 0,
            "Idle Mean": 0.01,
            "Idle Std": 0.01,
            "Idle Max": 0.02,
            "Idle Min": 0.0,
            "Fwd Act Data Pkts": 0,
            "Fwd Seg Size Min": 40,
            "Fwd Seg Size Mean": fb / max(1, fp),
        }
        rows.append(row)
    df = pd.DataFrame(rows)
    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0
    return df[feature_cols]

def predict(df):
    df = df.fillna(0).replace([np.inf, -np.inf], 0)
    X = scaler.transform(df)
    preds = model.predict(X)
    probs = model.predict_proba(X)[:, 1]
    return preds, probs

def get_ai_explanation(flow_data, prediction, confidence):
    if not st.session_state.api_key:
        return "Enter your Gemini API key in the sidebar."
    try:
        genai.configure(api_key=st.session_state.api_key)
        model_ai = genai.GenerativeModel("gemini-1.5-flash")
        top_features = {k: v for i, (k, v) in enumerate(flow_data.items()) if i < 10}
        prompt = f"""
You are an AI cybersecurity expert. A network flow was classified as {prediction} with {confidence*100:.1f}% confidence.
Flow stats (first 10 features): {top_features}
Explain in 2-3 sentences, in plain English, why this flow is {prediction}. Be concise.
"""
        response = model_ai.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Error: {str(e)}"

st.markdown('<div style="text-align: center; margin-top: 1rem;"><span class="hero-badge">AI-Powered Security</span></div>', unsafe_allow_html=True)
st.markdown('<h1 class="hero-title" style="text-align: center; font-size: 4rem;">Intrusion Detection System</h1>', unsafe_allow_html=True)
st.markdown('<p style="text-align: center; color: #8899bb; font-size: 1.2rem;">XGBoost &middot; 99.9% Accuracy &middot; Live Capture &middot; AI Explanations</p>', unsafe_allow_html=True)
st.markdown("---")

tab1, tab2, tab3 = st.tabs(["CSV Upload", "PCAP Upload", "Live Capture"])

with tab1:
    uploaded = st.file_uploader("Upload CSV", type=["csv"])
    if uploaded:
        df = pd.read_csv(uploaded)
        if set(feature_cols).issubset(df.columns):
            preds, probs = predict(df[feature_cols])
            df["Prediction"] = ["BENIGN" if p == 0 else "ATTACK" for p in preds]
            df["Confidence"] = probs
            total = len(df); attacks = sum(preds == 1)
            c1, c2, c3 = st.columns(3)
            c1.metric("Total Flows", total)
            c2.metric("Attacks", attacks, f"{attacks/total*100:.1f}%")
            c3.metric("Benign", total - attacks)
            col1, col2 = st.columns(2)
            with col1:
                fig = px.pie(values=[total - attacks, attacks], names=["Benign", "Attack"],
                             color_discrete_map={"Benign": "#00b894", "Attack": "#00cc33"})
                st.plotly_chart(fig, use_container_width=True)
            with col2:
                st.dataframe(df[["Prediction", "Confidence"] + feature_cols[:3]], use_container_width=True)
            st.markdown("---")
            st.subheader("AI Explanation")
            attack_rows = df[df["Prediction"] == "ATTACK"]
            if len(attack_rows) > 0:
                selected_idx = st.selectbox("Select an ATTACK flow to explain", attack_rows.index, format_func=lambda i: f"Flow {i} (Confidence: {attack_rows.loc[i, 'Confidence']:.2f})")
                if st.button("Explain This Attack"):
                    flow_data = attack_rows.loc[selected_idx]
                    explanation = get_ai_explanation(flow_data[feature_cols], "ATTACK", flow_data["Confidence"])
                    st.info(f"**Analysis:** {explanation}")
            else:
                st.success("No attacks found. All traffic is BENIGN.")
            st.download_button("Download CSV", df.to_csv(index=False), "results.csv")
        else:
            st.error("Columns mismatch")

with tab2:
    pcap = st.file_uploader("Upload PCAP", type=["pcap", "pcapng"])
    if pcap:
        if not TSHARK_PATH:
            st.error("tshark not found. Install Wireshark.")
        else:
            with st.spinner("Extracting..."):
                df = extract_flows(pcap.read())
                if len(df) > 0:
                    preds, probs = predict(df)
                    df["Prediction"] = ["BENIGN" if p == 0 else "ATTACK" for p in preds]
                    df["Confidence"] = probs
                    total = len(df); attacks = sum(preds == 1)
                    c1, c2, c3 = st.columns(3)
                    c1.metric("Total", total); c2.metric("Attacks", attacks, f"{attacks/total*100:.1f}%"); c3.metric("Benign", total - attacks)
                    col1, col2 = st.columns(2)
                    with col1:
                        fig = px.pie(values=[total - attacks, attacks], names=["Benign", "Attack"],
                                     color_discrete_map={"Benign": "#00b894", "Attack": "#00cc33"})
                        st.plotly_chart(fig, use_container_width=True)
                    with col2:
                        st.dataframe(df[["Prediction", "Confidence"]], use_container_width=True)
                    st.markdown("---")
                    st.subheader("AI Explanation")
                    attack_rows = df[df["Prediction"] == "ATTACK"]
                    if len(attack_rows) > 0:
                        selected_idx = st.selectbox("Select an ATTACK flow to explain", attack_rows.index, format_func=lambda i: f"Flow {i} (Confidence: {attack_rows.loc[i, 'Confidence']:.2f})")
                        if st.button("Explain This Attack"):
                            flow_data = attack_rows.loc[selected_idx]
                            explanation = get_ai_explanation(flow_data[feature_cols], "ATTACK", flow_data["Confidence"])
                            st.info(f"**Analysis:** {explanation}")
                    else:
                        st.success("No attacks found.")
                    st.download_button("Download", df.to_csv(index=False), "pcap_results.csv")
                else:
                    st.warning("No flows extracted.")

with tab3:
    st.markdown("### Live Network Capture")
    if not TSHARK_PATH:
        st.error("tshark not found. Install Wireshark.")
    else:
        st.success("tshark detected")
        interfaces = get_interfaces()
        if not interfaces:
            st.warning("No interfaces found. Run as Administrator.")
        else:
            friendly_names = [f[0] for f in interfaces]
            raw_devices = [f[1] for f in interfaces]
            selected_index = st.selectbox("Select Interface", range(len(friendly_names)), format_func=lambda i: friendly_names[i])
            selected_raw = raw_devices[selected_index]
            dur = st.slider("Capture Duration (seconds)", 5, 30, 10)
            if st.button("Test Interface"):
                test_cmd = [TSHARK_PATH, "-i", selected_raw, "-a", "duration:1", "-w", os.devnull]
                try:
                    result = subprocess.run(test_cmd, timeout=3, capture_output=True, text=True)
                    if result.returncode == 0:
                        st.success("Interface works.")
                    else:
                        st.error(f"Test failed: {result.stderr}")
                except:
                    st.error("Timeout/Error.")
            if st.button("Start Live Capture", type="primary"):
                capture_file = os.path.join(os.getcwd(), "capture_temp.pcap")
                cmd = [TSHARK_PATH, "-i", selected_raw, "-a", f"duration:{dur}", "-w", capture_file]
                st.info(f"Capturing for {dur}s...")
                progress_bar = st.progress(0)
                status_text = st.empty()
                process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                start_time = time.time()
                while process.poll() is None:
                    elapsed = time.time() - start_time
                    progress = min(elapsed / dur, 1.0)
                    progress_bar.progress(progress)
                    status_text.text(f"Capturing... {int(elapsed)}s / {dur}s")
                    time.sleep(0.5)
                progress_bar.progress(1.0)
                status_text.text("Processing...")
                stdout, stderr = process.communicate()
                if process.returncode != 0:
                    st.error(f"Capture failed: {stderr}")
                    if os.path.exists(capture_file):
                        os.remove(capture_file)
                else:
                    if os.path.exists(capture_file) and os.path.getsize(capture_file) > 0:
                        with open(capture_file, "rb") as f:
                            pcap_bytes = f.read()
                        os.remove(capture_file)
                        df = extract_flows(pcap_bytes)
                        if len(df) > 0:
                            preds, probs = predict(df)
                            df["Prediction"] = ["BENIGN" if p == 0 else "ATTACK" for p in preds]
                            df["Confidence"] = probs
                            total = len(df); attacks = sum(preds == 1)
                            c1, c2, c3 = st.columns(3)
                            c1.metric("Total", total); c2.metric("Attacks", attacks, f"{attacks/total*100:.1f}%"); c3.metric("Benign", total - attacks)
                            col1, col2 = st.columns(2)
                            with col1:
                                fig = px.pie(values=[total - attacks, attacks], names=["Benign", "Attack"],
                                             color_discrete_map={"Benign": "#00b894", "Attack": "#00cc33"})
                                st.plotly_chart(fig, use_container_width=True)
                            with col2:
                                st.dataframe(df[["Prediction", "Confidence"]].head(20), use_container_width=True)
                            st.markdown("---")
                            st.subheader("AI Explanation")
                            attack_rows = df[df["Prediction"] == "ATTACK"]
                            if len(attack_rows) > 0:
                                selected_idx = st.selectbox("Select an ATTACK flow to explain", attack_rows.index, format_func=lambda i: f"Flow {i} (Confidence: {attack_rows.loc[i, 'Confidence']:.2f})")
                                if st.button("Explain This Attack"):
                                    flow_data = attack_rows.loc[selected_idx]
                                    explanation = get_ai_explanation(flow_data[feature_cols], "ATTACK", flow_data["Confidence"])
                                    st.info(f"**Analysis:** {explanation}")
                            else:
                                st.success("No attacks found.")
                            st.download_button("Download CSV", df.to_csv(index=False), "live.csv")
                        else:
                            st.warning("No flows extracted.")
                    else:
                        st.error("Capture file empty.")
