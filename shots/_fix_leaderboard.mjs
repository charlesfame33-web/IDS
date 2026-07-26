import { chromium } from "../agriflow/node_modules/playwright/index.mjs";
import { resolve } from "path";
import { statSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--no-sandbox"],
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();

  // Login
  await p.goto("http://127.0.0.1:8010/login/", { waitUntil: "networkidle", timeout: 15000 });
  await p.waitForTimeout(1000);
  console.log("Login page URL:", p.url());
  const html = await p.content();
  if (html.includes("id_username")) {
    await p.locator("#id_username").fill("testuser", { timeout: 5000 });
    await p.locator("#id_password").fill("testpass123", { timeout: 5000 });
    await p.locator('button[type="submit"]').click({ timeout: 5000 });
    await p.waitForTimeout(3000);
    console.log("Post-login URL:", p.url());
  }

  // Leaderboard
  await p.goto("http://127.0.0.1:8010/leaderboard/", { waitUntil: "domcontentloaded", timeout: 15000 });
  await p.waitForTimeout(1500);
  console.log("URL:", p.url());

  await p.screenshot({
    path: resolve(__dirname, "mayor4code", "09-leaderboard.png"),
    fullPage: true,
  });
  console.log("Saved 09-leaderboard.png");

  // Verify it's different from playground
  const lbSize = statSync(resolve(__dirname, "mayor4code", "09-leaderboard.png")).size;
  const pgSize = statSync(resolve(__dirname, "mayor4code", "07-playground.png")).size;
  console.log("leaderboard size:", lbSize, "| playground size:", pgSize);
  console.log("Different:", lbSize !== pgSize ? "YES" : "NO - still duplicate!");

  await ctx.close();
  await browser.close();
})();
