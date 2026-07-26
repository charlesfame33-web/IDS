const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE = "http://localhost:8010";
const DIR = path.resolve(__dirname, "mayor4code");
fs.mkdirSync(DIR, { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: path.join(DIR, name), fullPage: true });
  console.log("  saved " + name);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log("Capturing public pages...");
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 20000 });
  await shot(page, "01-home.png");

  await page.goto(BASE + "/login/", { waitUntil: "networkidle", timeout: 20000 });
  await shot(page, "02-login.png");

  await page.goto(BASE + "/register/", { waitUntil: "networkidle", timeout: 20000 });
  await shot(page, "03-signup.png");

  await page.goto(BASE + "/roadmap/", { waitUntil: "networkidle", timeout: 20000 });
  await shot(page, "04-roadmap.png");

  console.log("Public pages done! Now please log in for the remaining 7.");
  await browser.close();
}

main().catch(console.error);
