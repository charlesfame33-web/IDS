import { chromium } from "../agriflow/node_modules/playwright/index.mjs";
import { writeFileSync } from "fs";

const CHROME = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";

async function main() {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto("http://127.0.0.1:3000/login", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Dump all input elements
  const inputs = await page.evaluate(() => {
    const els = document.querySelectorAll("input");
    return Array.from(els).map((e) => ({
      id: e.id,
      name: e.name,
      type: e.type,
      placeholder: e.placeholder,
      class: e.className?.slice(0, 40),
    }));
  });
  console.log("Inputs found:", JSON.stringify(inputs, null, 2));

  // Try fill by id
  const emailInput = await page.locator("#email").count();
  console.log("email by #id:", emailInput);

  const passwordInput = await page.locator('input[name="password"]').count();
  console.log("password by [name=password]:", passwordInput);

  // Screenshot
  await page.screenshot({ path: "login_debug.png", fullPage: true });
  console.log("Screenshot saved");

  // Now try the actual login
  await page.locator("#email").fill("test_farmer@demo.com");
  await page.locator('input[name="password"]').fill("DemoPass123!");
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);
  console.log("After login URL:", page.url());

  // Check if redirected to dashboard
  const html = await page.content().then(h => h.slice(0, 500));
  console.log("Page content start:", html.slice(0, 200));

  await browser.close();
}

main().catch(console.error);
