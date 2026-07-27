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
import random
import ctypes
from collections import defaultdict
from google import genai
from google.genai import types

st.set_page_config(page_title="AI Intrusion Detection System", page_icon="🛡️", layout="wide")

random.seed(42)
cols_parts = []
for i in range(120):
    delay = f"{random.random() * 5:.1f}s"
    count = random.randint(8, 20)
    chars = "".join(
        f'<span class="mchar" style="opacity:{0.2 + random.random() * 0.8:.2f}">{random.choice("01")}</span>'
        for _ in range(count)
    )
    cols_parts.append(f'<div class="mcol" style="--d:{delay}">{chars}</div>')

matrix_cols = "".join(cols_parts)

st.markdown(f"""
<style>
    @keyframes mfall {{
        0% {{ transform: translateY(-100%); opacity: 0; }}
        10% {{ opacity: 1; }}
        90% {{ opacity: 1; }}
        100% {{ transform: translateY(100vh); opacity: 0; }}
    }}
    .mbg {{
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        z-index: -1; background: #0a0f0a; overflow: hidden; pointer-events: none;
        font-family: 'Courier New', monospace;
        display: flex; flex-direction: row; flex-wrap: nowrap;
    }}
    .mcol {{
        flex: 0 0 auto; width: 22px;
        animation: mfall 4s linear infinite;
        animation-delay: var(--d);
    }}
    .mchar {{
        color: #00ff41; font-size: 18px;
        text-shadow: 0 0 5px #00ff41, 0 0 10px #00ff41;
        line-height: 1.2; display: block;
    }}
    footer {{visibility: hidden;}}
    #MainMenu {{visibility: hidden;}}
    .stAppToolbar {{visibility: hidden;}}
    [data-testid="stHeader"] {{ background: transparent !important; border: none !important; }}
    .stApp {{ background: transparent !important; }}
    .main > div {{
        background: rgba(10, 15, 10, 0.82) !important;
        backdrop-filter: blur(4px);
        border-radius: 20px;
        padding: 1.5rem;
        margin: 0.5rem;
        border: 1px solid rgba(0, 255, 65, 0.15);
        box-shadow: 0 0 30px rgba(0, 255, 65, 0.05);
    }}
    .stMarkdown, .stText, .stDataFrame, .stTable,
    h1, h2, h3, h4, p, li, label {{
        color: #c0d8c0 !important;
    }}
    .hero-title {{
        background: linear-gradient(90deg, #00ff41, #00cc33);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 30px rgba(0, 255, 65, 0.2);
    }}
    .hero-badge {{
        border-color: #00ff41; color: #00ff41;
        background: rgba(0, 255, 65, 0.1);
        border-radius: 50px; padding: 0.3rem 1.2rem; display: inline-block;
        font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;
    }}
    .stButton button {{
        background: linear-gradient(90deg, #00cc33, #009926) !important;
        color: #0a0f0a !important; border: none !important;
        border-radius: 50px !important; font-weight: 700 !important;
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
    }}
    .stButton button:hover {{
        box-shadow: 0 0 40px rgba(0, 255, 65, 0.4); transform: scale(1.02);
    }}
    .stTabs [aria-selected="true"] {{
        background: linear-gradient(90deg, #00cc33, #009926) !important;
        color: #0a0f0a !important;
    }}
    .stTabs [data-baseweb="tab"] {{ color: #80a080; }}
    [data-testid="metric-container"] {{
        background: rgba(0, 20, 0, 0.6);
        border: 1px solid rgba(0, 255, 65, 0.15);
        backdrop-filter: blur(5px); border-radius: 16px; padding: 1rem;
    }}
    .stSelectbox label, .stSlider label, .stFileUploader label {{ color: #80a080 !important; }}
    /* Sections */
    .section-title {{
        text-align: center; font-size: 1.8rem;
        color: #00ff41 !important; margin: 2rem 0 1.5rem;
        letter-spacing: 2px;
    }}
    .feature-card {{
        background: rgba(0, 20, 0, 0.5);
        border: 1px solid rgba(0, 255, 65, 0.12);
        border-radius: 16px; padding: 24px;
        text-align: center; height: 100%;
        backdrop-filter: blur(4px);
        transition: all 0.3s;
    }}
    .feature-card:hover {{
        border-color: rgba(0, 255, 65, 0.3);
        box-shadow: 0 0 25px rgba(0, 255, 65, 0.08);
        transform: translateY(-2px);
    }}
    .feature-icon {{
        width: 48px; height: 48px; line-height: 48px;
        background: rgba(0, 255, 65, 0.08);
        border: 1px solid rgba(0, 255, 65, 0.2);
        border-radius: 50%;
        font-size: 1.3rem; margin: 0 auto 12px;
    }}
    .feature-title {{
        font-size: 1.05rem; font-weight: 700;
        color: #c0d8c0 !important; margin-bottom: 8px;
    }}
    .feature-desc {{
        font-size: 0.85rem; color: #709070 !important;
        line-height: 1.5;
    }}
    .attack-card {{
        border-radius: 16px; padding: 20px 12px;
        text-align: center; min-height: 130px;
        display: flex; flex-direction: column; align-items: center;
        justify-content: center;
        border: 1px solid rgba(0, 255, 65, 0.15);
        transition: all 0.3s;
    }}
    .attack-card:hover {{
        transform: translateY(-3px);
        box-shadow: 0 0 30px rgba(0, 255, 65, 0.15);
        border-color: rgba(0, 255, 65, 0.4);
    }}
    .attack-icon {{ font-size: 1.6rem; margin-bottom: 8px; }}
    .attack-name {{ font-size: 1rem; font-weight: 700; color: #c0d8c0; margin-bottom: 4px; }}
    .attack-desc {{ font-size: 0.8rem; color: #709070; }}
</style>
<div class="mbg">{matrix_cols}</div>
""", unsafe_allow_html=True)

if "api_key" not in st.session_state:
    st.session_state.api_key = ""

if "ai_model" not in st.session_state:
    st.session_state.ai_model = ""

if "messages" not in st.session_state:
    st.session_state.messages = []

@st.cache_resource
def load_artifacts():
    model = joblib.load('models/xgb_baseline.pkl')
    scaler = joblib.load('models/scaler.pkl')
    feature_cols = joblib.load('models/feature_columns.joblib')
    return model, scaler, feature_cols

model, scaler, feature_cols = load_artifacts()

def detect_available_model(api_key):
    try:
        client = genai.Client(api_key=api_key)
        for m in client.models.list():
            name = m.name
            if 'gemini' not in name.lower():
                continue
            if 'flash' in name:
                return name
        return None
    except Exception:
        return None

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

def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin() != 0
    except:
        return False

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
            "Flow Duration": dur, "Total Fwd Packets": fp, "Total Backward Packets": bp,
            "Total Length of Fwd Packets": fb, "Total Length of Bwd Packets": bb,
            "Fwd Packet Length Mean": fb / max(1, fp), "Bwd Packet Length Mean": bb / max(1, bp),
            "Flow Bytes/s": tb / dur, "Flow Packets/s": tp / dur, "Flow IAT Mean": dur / max(1, tp),
            "Fwd IAT Total": dur, "Bwd IAT Total": dur,
            "Fwd PSH Flags": 0, "Bwd PSH Flags": 0, "Fwd URG Flags": 0, "Bwd URG Flags": 0,
            "FWD Header Length": 20, "BWD Header Length": 20,
            "Fwd Packets/s": fp / dur, "Bwd Packets/s": bp / dur,
            "Min Packet Length": 40, "Max Packet Length": 1500,
            "Packet Length Mean": tb / max(1, tp), "Packet Length Std": 100, "Packet Length Variance": 10000,
            "FIN Flag Count": 0, "SYN Flag Count": 0, "RST Flag Count": 0, "PSH Flag Count": 0,
            "ACK Flag Count": 0, "URG Flag Count": 0, "CWE Flag Count": 0, "ECE Flag Count": 0,
            "Down/Up Ratio": 1.0, "Average Packet Size": tb / max(1, tp),
            "Avg FWD Segment Size": fb / max(1, fp), "Avg BWD Segment Size": bb / max(1, bp),
            "Fwd Header Length.1": 20, "Fwd Avg Bytes/Bulk": 0, "Fwd Avg Packets/Bulk": 0,
            "Fwd Avg Bulk Rate": 0, "Bwd Avg Bytes/Bulk": 0, "Bwd Avg Packets/Bulk": 0,
            "Bwd Avg Bulk Rate": 0, "Subflow Fwd Packets": fp, "Subflow Fwd Bytes": fb,
            "Subflow Bwd Packets": bp, "Subflow Bwd Bytes": bb,
            "Init_Win_bytes_forward": 65535, "Init_Win_bytes_backward": 65535,
            "act_data_pkt_fwd": 0, "min_seg_size_forward": 40,
            "Active Mean": dur / 2, "Active Std": dur / 4, "Active Max": dur, "Active Min": 0,
            "Idle Mean": 0.01, "Idle Std": 0.01, "Idle Max": 0.02, "Idle Min": 0.0,
            "Fwd Act Data Pkts": 0, "Fwd Seg Size Min": 40, "Fwd Seg Size Mean": fb / max(1, fp),
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

def ask_ai_assistant(user_message):
    api_key = st.session_state.get('api_key')
    ai_model = st.session_state.get('ai_model')
    if not api_key:
        return "Enter your Gemini API key in the AI Assistant section above."
    if not ai_model:
        return "No Gemini model available. Check your API key."
    try:
        client = genai.Client(api_key=api_key)
        system_prompt = (
            "You are an AI cybersecurity assistant integrated into an Intrusion Detection System (IDS) dashboard. "
            "You can explain: how the IDS works (XGBoost model trained on CICIDS2017, 99.9% accuracy), "
            "network attack types (DDoS, Brute Force, Botnet, Web Attacks, Infiltration), "
            "how to interpret detection results, PCAP and traffic analysis concepts, "
            "live capture and monitoring techniques, and any cybersecurity topic related to intrusion detection. "
            "Keep responses concise (2-4 sentences) and technically accurate. "
            "If asked something outside cybersecurity, politely redirect to security topics."
        )
        chat = client.chats.create(
            model=ai_model,
            config=types.GenerateContentConfig(system_instruction=system_prompt),
        )
        response = chat.send_message(user_message)
        return response.text
    except Exception as e:
        return f"AI Error: {str(e)}"

st.markdown('<div style="text-align: center; margin-top: 1rem;"><span class="hero-badge">AI-Powered Security</span></div>', unsafe_allow_html=True)
st.markdown('<h1 class="hero-title" style="text-align: center; font-size: 4rem;">Intrusion Detection System</h1>', unsafe_allow_html=True)
st.markdown('<p style="text-align: center; color: #8899bb; font-size: 1.2rem;">XGBoost &middot; 99.9% Accuracy &middot; Live Capture &middot; AI Explanations</p>', unsafe_allow_html=True)
st.markdown("---")

st.markdown('<h2 class="section-title">Key Features</h2>', unsafe_allow_html=True)
cols = st.columns(4)
features = [
    ("🔬", "CSV Analysis", "Upload flow-feature CSV files for instant batch classification with 99.9% accuracy."),
    ("📦", "PCAP Parsing", "Drop Wireshark capture files for automated flow extraction and attack detection."),
    ("📡", "Live Capture", "Monitor network interfaces in real-time and detect threats as they happen."),
    ("🧠", "AI Explanations", "Get plain-English explanations of detected attacks powered by Gemini AI."),
]
for col, (icon, title, desc) in zip(cols, features):
    with col:
        st.markdown(f'''
        <div class="feature-card">
            <div class="feature-icon">{icon}</div>
            <div class="feature-title">{title}</div>
            <div class="feature-desc">{desc}</div>
        </div>
        ''', unsafe_allow_html=True)

st.markdown('<h2 class="section-title">Detectable Attack Types</h2>', unsafe_allow_html=True)
cols5 = st.columns(5)
attacks = [
    ("💥", "DDoS", "Distributed Denial of Service"),
    ("🔑", "Brute Force", "FTP / SSH / HTTP auth"),
    ("🤖", "Botnet", "C&C / ARES / malware"),
    ("🔪", "Web Attacks", "SQLi / XSS / path traversal"),
    ("🕳️", "Infiltration", "Internal port scan / exploits"),
]
attack_colors = ["rgba(0,255,65,0.08)", "rgba(0,200,50,0.12)", "rgba(0,180,60,0.15)", "rgba(0,220,80,0.10)", "rgba(0,190,70,0.18)"]
for col, (icon, name, desc), bg in zip(cols5, attacks, attack_colors):
    with col:
        st.markdown(f'''
        <div class="attack-card" style="background: {bg};">
            <div class="attack-icon">{icon}</div>
            <div class="attack-name">{name}</div>
            <div class="attack-desc">{desc}</div>
        </div>
        ''', unsafe_allow_html=True)

st.markdown("---")

st.markdown("### 🤖 AI Assistant")
st.caption("Ask anything about the IDS system, network security, or attack types.")

with st.expander("⚙️ Configure Gemini API Key", expanded=not st.session_state.api_key):
    st.caption("Get a free key at aistudio.google.com")
    api_key_input = st.text_input("API Key", type="password", value=st.session_state.api_key, label_visibility="collapsed")
    if api_key_input and api_key_input != st.session_state.api_key:
        st.session_state.api_key = api_key_input
        st.session_state.ai_model = ""
        st.session_state.messages = []
        with st.spinner("Detecting available models..."):
            detected = detect_available_model(api_key_input)
            if detected:
                st.session_state.ai_model = detected
                st.success(f"Using {detected.split('/')[-1]}")
            else:
                st.error("No Gemini model available on this key. Check your API key at aistudio.google.com")

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

col_q, col_btn = st.columns([5, 1])
with col_q:
    user_query = st.text_input("Ask the AI assistant", placeholder="Ask about the IDS system...", label_visibility="collapsed")
with col_btn:
    st.write("")
    send = st.button("Enter", type="primary", use_container_width=True)

if send and user_query:
    st.session_state.messages.append({"role": "user", "content": user_query})
    with st.chat_message("user"):
        st.markdown(user_query)
    with st.chat_message("assistant"):
        with st.spinner("Analyzing..."):
            response = ask_ai_assistant(user_query)
        st.markdown(response)
    st.session_state.messages.append({"role": "assistant", "content": response})
    st.rerun()

tab1, tab2, tab3 = st.tabs(["CSV Upload", "PCAP Upload", "Live Capture"])

def normalize_columns(cols):
    return [c.strip().replace(' ', '') for c in cols]

with tab1:
    uploaded = st.file_uploader("Upload CSV", type=["csv"])
    if uploaded:
        df = pd.read_csv(uploaded)
        df.columns = df.columns.str.strip()
        missing = [c for c in feature_cols if c not in df.columns]
        if not missing:
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
                selected_idx = st.selectbox("Select an ATTACK flow to explain", attack_rows.index, format_func=lambda i: f"Flow {i} (Conf: {attack_rows.loc[i, 'Confidence']:.2f})")
                if st.button("Explain This Attack"):
                    flow_data = attack_rows.loc[selected_idx]
                    top_feats = {k: v for k, v in flow_data[feature_cols].items() if list(feature_cols).index(k) < 10}
                    q = f"This flow was classified as ATTACK with {flow_data['Confidence']*100:.1f}% confidence. Key features: {top_feats}. Why is this an attack?"
                    st.session_state.messages.append({"role": "user", "content": q})
                    reply = ask_ai_assistant(q)
                    st.session_state.messages.append({"role": "assistant", "content": reply})
                    st.success("Answer added in the AI Assistant below.")
            else:
                st.success("No attacks found.")
            st.download_button("Download CSV", df.to_csv(index=False), "results.csv")
        else:
            extra = [c for c in df.columns if c not in feature_cols]
            msg = f"Missing {len(missing)} column(s): {', '.join(missing[:5])}"
            if len(missing) > 5:
                msg += f" and {len(missing) - 5} more"
            if extra:
                msg += f"\n\nExtra column(s) in your CSV: {', '.join(extra[:3])}"
                if len(extra) > 3:
                    msg += f" and {len(extra) - 3} more"
            msg += "\n\nExpected format: CICFlowMeter CSV with 71 flow features."
            st.error(msg)

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
                        selected_idx = st.selectbox("Select an ATTACK flow to explain", attack_rows.index, format_func=lambda i: f"Flow {i} (Conf: {attack_rows.loc[i, 'Confidence']:.2f})")
                        if st.button("Explain This Attack"):
                            flow_data = attack_rows.loc[selected_idx]
                            top_feats = {k: v for k, v in flow_data[feature_cols].items() if list(feature_cols).index(k) < 10}
                            q = f"This flow was classified as ATTACK with {flow_data['Confidence']*100:.1f}% confidence. Key features: {top_feats}. Why is this an attack?"
                            st.session_state.messages.append({"role": "user", "content": q})
                            reply = ask_ai_assistant(q)
                            st.session_state.messages.append({"role": "assistant", "content": reply})
                            st.success("Answer added in the AI Assistant below.")
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
        if not is_admin():
            st.warning("⚠️ Run as Administrator to enable live capture. Right-click your terminal/script → Run as Administrator.")
        interfaces = get_interfaces()
        if not interfaces:
            st.warning("No network interfaces detected. Make sure Wireshark/tshark is installed and run as Administrator.")
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
                                selected_idx = st.selectbox("Select an ATTACK flow to explain", attack_rows.index, format_func=lambda i: f"Flow {i} (Conf: {attack_rows.loc[i, 'Confidence']:.2f})")
                                if st.button("Explain This Attack"):
                                    flow_data = attack_rows.loc[selected_idx]
                                    top_feats = {k: v for k, v in flow_data[feature_cols].items() if list(feature_cols).index(k) < 10}
                                    q = f"This flow was classified as ATTACK with {flow_data['Confidence']*100:.1f}% confidence. Key features: {top_feats}. Why is this an attack?"
                                    st.session_state.messages.append({"role": "user", "content": q})
                                    reply = ask_ai_assistant(q)
                                    st.session_state.messages.append({"role": "assistant", "content": reply})
                                    st.success("Answer added in the AI Assistant below.")
                            else:
                                st.success("No attacks found.")
                            st.download_button("Download CSV", df.to_csv(index=False), "live.csv")
                        else:
                            st.warning("No flows extracted.")
                    else:
                        st.error("Capture file empty.")
