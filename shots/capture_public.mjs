import { chromium } from "playwright";
import { resolve } from "path";

const __dirname = import.meta.dirname;
const BASE = "http://localhost:8010";

async function shot(page, name, dir) {
  await page.screenshot({
    path: resolve(__dirname, dir, name),
    fullPage: true,
  });
  console.log(`  saved ${name}`);
}

async function goto(page, url) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

console.log("Capturing public pages...");
await goto(page, BASE + "/");
await shot(page, "01-home.png", "mayor4code");

await goto(page, BASE + "/login/");
await shot(page, "02-login.png", "mayor4code");

await goto(page, BASE + "/register/");
await shot(page, "03-signup.png", "mayor4code");

await goto(page, BASE + "/roadmap/");
await shot(page, "04-roadmap.png", "mayor4code");

console.log("Public pages done. Now please log in for the remaining 7.");
await browser.close();
