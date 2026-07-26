import { chromium } from "../agriflow/node_modules/playwright/index.mjs";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    headless: false,
    args: ["--no-sandbox"],
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();

  p.on("console", msg => console.log("CONSOLE:", msg.type(), msg.text()));
  p.on("pageerror", err => console.log("PAGE ERROR:", err.message));
  p.on("response", resp => console.log("RESPONSE:", resp.status(), resp.url()));

  await p.goto("http://localhost:8010/login/", { waitUntil: "networkidle" });
  console.log("Login page loaded");
  await p.waitForTimeout(30000);
  await browser.close();
})();
