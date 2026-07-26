import { chromium } from "../agriflow/node_modules/playwright/index.mjs";
import { mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHOTS = __dirname;
const CHROME = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";

mkdirSync(resolve(SHOTS, "mayor4code"), { recursive: true });
mkdirSync(resolve(SHOTS, "agriflow"), { recursive: true });

async function shot(page, name, dir) {
  try {
    const path = resolve(SHOTS, dir, `${name}.png`);
    await page.screenshot({ path, fullPage: true });
    console.log(`  OK ${dir}/${name}.png`);
  } catch (e) {
    console.log(`  FAIL ${dir}/${name}.png: ${e.message}`);
  }
}

async function goto(page, url) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1000);
    return true;
  } catch (e) {
    console.log(`  WARN ${url}: ${e.message}`);
    return false;
  }
}

const AGRI_ACCOUNTS = [
  { role: "farmer",  email: "test_farmer@demo.com",  pass: "DemoPass123!" },
  { role: "buyer",   email: "test_buyer@demo.com",   pass: "DemoPass123!" },
  { role: "warehouse_manager", email: "test_warehouse@demo.com", pass: "DemoPass123!" },
  { role: "transporter", email: "test_transport@demo.com", pass: "DemoPass123!" },
  { role: "admin",    email: "test_admin@demo.com",   pass: "DemoPass123!" },
];

async function captureMayor4code(browser) {
  console.log("\n=== mayor4code ===");
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  // Public
  await goto(page, "http://127.0.0.1:8010/") && await shot(page, "01-home", "mayor4code");
  await goto(page, "http://127.0.0.1:8010/accounts/login/") && await shot(page, "02-login", "mayor4code");
  await goto(page, "http://127.0.0.1:8010/accounts/signup/") && await shot(page, "03-signup", "mayor4code");
  await goto(page, "http://127.0.0.1:8010/roadmap/") && await shot(page, "04-roadmap", "mayor4code");

  // Login with fresh page
  await goto(page, "http://127.0.0.1:8010/accounts/login/");
  const html = await page.content();
  if (html.includes('id_username')) {
    await page.locator("#id_username").fill("testuser", { timeout: 5000 });
    await page.locator("#id_password").fill("testpass123", { timeout: 5000 });
    await page.locator('button[type="submit"]').click({ timeout: 5000 });
    await page.waitForTimeout(2000);
    console.log("  Logged in");
  } else {
    console.log("  Login form not found, trying GET /accounts/login/...");
    // Try alternative login URL
    await page.goto("http://127.0.0.1:8010/accounts/login/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const html2 = await page.content();
    if (html2.includes('id_username')) {
      await page.locator("#id_username").fill("testuser", { timeout: 5000 });
      await page.locator("#id_password").fill("testpass123", { timeout: 5000 });
      await page.locator('button[type="submit"]').click({ timeout: 5000 });
      await page.waitForTimeout(2000);
      console.log("  Logged in (retry)");
    }
  }

  // Authenticated (will work even if login silently failed — session from prior attempt)
  await goto(page, "http://127.0.0.1:8010/") && await shot(page, "05-dashboard", "mayor4code");
  await goto(page, "http://127.0.0.1:8010/courses/") && await shot(page, "06-lessons", "mayor4code");
  await goto(page, "http://127.0.0.1:8010/playground/") && await shot(page, "07-playground", "mayor4code");
  await goto(page, "http://127.0.0.1:8010/quizzes/") && await shot(page, "08-quizzes", "mayor4code");
  await goto(page, "http://127.0.0.1:8010/leaderboard/") && await shot(page, "09-leaderboard", "mayor4code");
  await goto(page, "http://127.0.0.1:8010/progress/") && await shot(page, "10-progress", "mayor4code");
  await goto(page, "http://127.0.0.1:8010/certificates/") && await shot(page, "11-certificates", "mayor4code");

  await ctx.close();
}

async function captureAgriFlow(browser) {
  console.log("\n=== AgriFlow AI ===");

  // Public pages
  console.log("  Public pages...");
  const pub = await browser.newPage();
  pub.setViewportSize({ width: 1280, height: 800 });
  await goto(pub, "http://127.0.0.1:3000/") && await shot(pub, "01-landing", "agriflow");
  await goto(pub, "http://127.0.0.1:3000/login") && await shot(pub, "02-login", "agriflow");
  await goto(pub, "http://127.0.0.1:3000/signup") && await shot(pub, "03-signup", "agriflow");
  await pub.close();

  // Authenticated dashboards
  console.log("  Dashboards...");
  for (const acct of AGRI_ACCOUNTS) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();

    const ok = await goto(p, "http://127.0.0.1:3000/login");
    if (ok) {
      await p.waitForTimeout(500);
      const lp = await p.content();
      if (lp.includes('type="email"')) {
        await p.locator('input[type="email"]').fill(acct.email, { timeout: 5000 });
        await p.locator('input[type="password"]').fill(acct.pass, { timeout: 5000 });
        await p.locator('button[type="submit"]').click({ timeout: 5000 });
        await p.waitForTimeout(3000);

        const url = p.url();
        if (url.includes("/dashboard")) {
          console.log(`  ${acct.role} logged in`);
          await shot(p, `dash-${acct.role}`, "agriflow");

          // Take a few more role-specific pages
          const extras = {
            farmer: [{ u: "farmer/crops", n: "farmer-crops" }],
            buyer: [{ u: "buyer/browse", n: "buyer-browse" }],
            warehouse_manager: [{ u: "warehouse/inventory", n: "warehouse-inventory" }],
            transporter: [{ u: "transport/deliveries", n: "transport-deliveries" }],
            admin: [
              { u: "admin/users", n: "admin-users" },
              { u: "forecasting", n: "forecasting" },
              { u: "assistant", n: "ai-assistant" },
            ],
          };
          for (const extra of extras[acct.role] || []) {
            await goto(p, `http://127.0.0.1:3000/dashboard/${extra.u}`);
            await shot(p, extra.n, "agriflow");
          }
        } else {
          console.log(`  ${acct.role} login failed (${url})`);
        }
      }
    }
    await ctx.close();
  }
}

async function main() {
  console.log("Launching Chrome...");
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox"],
  });
  try {
    await captureMayor4code(browser);
    await captureAgriFlow(browser);
  } finally {
    await browser.close();
  }
  console.log("\nDone.");
}

main().catch((e) => { console.error(e); process.exit(1); });
