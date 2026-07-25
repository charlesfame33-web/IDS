@echo off
title IDS Dashboard
cd /d "%~dp0"

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

echo Running IDS Dashboard as Administrator...
python -m streamlit run app/streamlit_app.py --server.headless true --server.port 8502
pause
