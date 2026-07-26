from playwright.sync_api import sync_playwright
import time, os, shutil

BASE = "http://localhost:8502"
OUT = r"C:\Users\ALEXIS\Desktop\SENPAI\shots\ids"
os.makedirs(OUT, exist_ok=True)

def snap_full(page, name, wait=3):
    time.sleep(wait)
    page.screenshot(path=os.path.join(OUT, f"{name}.png"), full_page=True)
    print(f"  [OK] {name}.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1920, "height": 1080})

    print("Capturing IDS dashboard screenshots...")
    
    page.goto(BASE, wait_until="networkidle")
    snap_full(page, "01-full-dashboard")
    
    page.goto(BASE, wait_until="networkidle")
    page.click("text=PCAP Upload")
    snap_full(page, "02-pcap-tab")
    
    page.goto(BASE, wait_until="networkidle")
    page.click("text=Live Capture")
    snap_full(page, "03-live-tab")
    
    page.goto(BASE, wait_until="networkidle")
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    snap_full(page, "04-bottom-chat", 2)
    
    browser.close()

figs_src = r"C:\Users\ALEXIS\Desktop\SENPAI\ids-project\reports\figures"
for f in ["confusion_matrix.png", "roc_curve.png"]:
    src = os.path.join(figs_src, f)
    dst = os.path.join(OUT, f)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"  [OK] copied {f}")
    else:
        print(f"  [MISS] {f}")

print("Done!")
