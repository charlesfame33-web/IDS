import { chromium } from "../agriflow/node_modules/playwright/index.mjs";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    headless: false,
    args: ["--no-sandbox"],
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();

  // Log console errors
  p.on("console", msg => { if (msg.type() === "error") console.log("CONSOLE:", msg.text()); });
  p.on("pageerror", err => console.log("PAGE ERROR:", err.message));

  // Go to login
  await p.goto("http://127.0.0.1:3000/login", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  console.log("Login page:", p.url());

  // Wait 15 seconds for user to look
  console.log("Waiting 15s for you to see the login page...");
  await p.waitForTimeout(15000);

  await browser.close();
})();
