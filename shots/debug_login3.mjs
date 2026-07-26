import { chromium } from "../agriflow/node_modules/playwright/index.mjs";
const CHROME = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";

async function main() {
  const b = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  const p = await b.newPage();
  await p.goto("http://127.0.0.1:3000/login", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  await p.locator("#email").fill("test_farmer@demo.com");
  await p.locator('input[name="password"]').fill("DemoPass123!");
  await p.locator('button[type="submit"]').click();
  await p.waitForTimeout(3000);
  const err = await p.textContent('[role="alert"]').catch(() => "none");
  console.log("Error displayed:", err);
  console.log("Final URL:", p.url());
  const success = p.url().includes("/dashboard");
  console.log("Login success:", success);
  if (!success) {
    const body = await p.textContent("body").catch(() => "");
    console.log("Body:", body.slice(0, 500));
  }
  await b.close();
}
main();
