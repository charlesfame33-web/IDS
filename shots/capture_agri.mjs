import { chromium } from "../agriflow/node_modules/playwright/index.mjs";
import { mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHOTS = __dirname;
const CHROME = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";
const SUPABASE_URL = "https://jptxpkxfyatdiiwxodal.supabase.co";
const ANON_KEY = "sb_publishable_9a0leAErUaI7k_xp5zmZuw_VqEQHIXh";

mkdirSync(resolve(SHOTS, "agriflow"), { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: resolve(SHOTS, "agriflow", `${name}.png`), fullPage: true });
  console.log(`  OK agriflow/${name}.png`);
}

async function loginViaAPI(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "apikey": ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Login failed: ${JSON.stringify(data)}`);
  return data;
}

async function setSessionCookie(page, session) {
  // Set the Supabase auth cookie so the app thinks we're logged in
  const cookieStr = `sb-jptxpkxfyatdiiwxodal-auth-token=${encodeURIComponent(JSON.stringify({
    access_token: session.access_token,
    token_type: session.token_type,
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    refresh_token: session.refresh_token,
    user: session.user,
  }))}; Path=/; Max-Age=3600; SameSite=Lax; Secure`;
  
  await page.context().addCookies([{
    name: "sb-jptxpkxfyatdiiwxodal-auth-token",
    value: JSON.stringify({
      access_token: session.access_token,
      token_type: session.token_type,
      expires_in: session.expires_in,
      expires_at: session.expires_at,
      refresh_token: session.refresh_token,
      user: session.user,
    }),
    domain: "127.0.0.1",
    path: "/",
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
  }]);
}

const ACCOUNTS = [
  { role: "farmer",  email: "test_farmer@demo.com",  pass: "DemoPass123!" },
  { role: "buyer",   email: "test_buyer@demo.com",   pass: "DemoPass123!" },
  { role: "warehouse_manager", email: "test_warehouse@demo.com", pass: "DemoPass123!" },
  { role: "transporter", email: "test_transport@demo.com", pass: "DemoPass123!" },
  { role: "admin",    email: "test_admin@demo.com",   pass: "DemoPass123!" },
];

async function main() {
  console.log("Launching Chrome...");
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox"],
  });

  // Public pages
  console.log("Public pages...");
  const pub = await browser.newPage();
  await pub.setViewportSize({ width: 1280, height: 800 });
  await pub.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await shot(pub, "01-landing");
  await pub.goto("http://127.0.0.1:3000/login", { waitUntil: "networkidle" });
  await shot(pub, "02-login");
  await pub.goto("http://127.0.0.1:3000/signup", { waitUntil: "networkidle" });
  await shot(pub, "03-signup");
  await pub.close();

  // Authenticated dashboards via cookie session injection
  console.log("Dashboards...");
  for (const acct of ACCOUNTS) {
    try {
      const session = await loginViaAPI(acct.email, acct.pass);
      console.log(`  ${acct.role} API login OK`);

      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const p = await ctx.newPage();

      // Set session cookie BEFORE navigating
      await ctx.addCookies([{
        name: "sb-jptxpkxfyatdiiwxodal-auth-token",
        value: JSON.stringify({
          access_token: session.access_token,
          token_type: session.token_type,
          expires_in: session.expires_in,
          expires_at: session.expires_at,
          refresh_token: session.refresh_token,
          user: session.user,
        }),
        domain: "127.0.0.1",
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      }]);

      // Now navigate — the middleware should see the cookie and allow access
      await p.goto(`http://127.0.0.1:3000/dashboard`, { waitUntil: "networkidle", timeout: 15000 }).catch(() => {});
      await p.waitForTimeout(1500);
      console.log(`  ${acct.role} dashboard URL: ${p.url()}`);
      await shot(p, `dash-${acct.role}`);

      // Role-specific extras
      const extras = {
        farmer: ["farmer/crops"],
        buyer: ["buyer/browse"],
        warehouse_manager: ["warehouse/inventory"],
        transporter: ["transport/deliveries"],
        admin: ["admin/users", "forecasting", "assistant"],
      };
      for (const sub of extras[acct.role] || []) {
        await p.goto(`http://127.0.0.1:3000/dashboard/${sub}`, { waitUntil: "networkidle", timeout: 10000 }).catch(() => {});
        await p.waitForTimeout(800);
        const label = sub.replace("/", "-");
        await shot(p, label);
      }

      await ctx.close();
    } catch (e) {
      console.log(`  FAIL ${acct.role}: ${e.message}`);
    }
  }

  await browser.close();
  console.log("\nDone.");
}

main().catch((e) => { console.error(e); process.exit(1); });
