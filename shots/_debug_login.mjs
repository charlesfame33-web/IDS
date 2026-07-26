import { chromium } from "../agriflow/node_modules/playwright/index.mjs";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--no-sandbox"],
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();

  // First try going to home page to see if already logged in somehow
  await p.goto("http://127.0.0.1:8010/", { waitUntil: "domcontentloaded", timeout: 15000 });
  console.log("Home URL:", p.url());

  await p.goto("http://127.0.0.1:8010/accounts/login/", { waitUntil: "domcontentloaded", timeout: 15000 });
  await p.waitForTimeout(1500);

  const html = await p.content();
  // Check what's on the page
  if (html.includes("id_username")) console.log("Has field: id_username");
  if (html.includes("id_password")) console.log("Has field: id_password");
  if (html.includes("name=\"username\"")) console.log("Has field: name=username");
  if (html.includes("name=\"password\"")) console.log("Has field: name=password");
  if (html.includes("csrf")) console.log("Has CSRF token");
  if (html.includes("Login")) console.log("Has 'Login' text");
  if (html.includes("Sign in")) console.log("Has 'Sign in' text");
  if (html.includes("Dashboard")) console.log("Already on Dashboard!");

  // Print excerpt
  const idx = html.indexOf("<form");
  const excerpt = idx >= 0 ? html.substring(idx, idx + 800) : "NO FORM FOUND";
  console.log("Form excerpt:", excerpt.substring(0, 500));

  await browser.close();
})();
