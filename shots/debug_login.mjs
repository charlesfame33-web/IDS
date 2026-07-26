import { chromium } from "../agriflow/node_modules/playwright/index.mjs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROME = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";

async function debugLogin() {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:3000/login", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  
  // Get page info
  const url = page.url();
  const title = await page.title();
  const html = await page.content();
  console.log("URL:", url);
  console.log("Title:", title);
  console.log("Has email input:", html.includes('type="email"'));
  console.log("Has password input:", html.includes('type="password"'));
  console.log("Has submit button:", html.includes('type="submit"') || html.includes('button[type=submit]'));
  
  // Screenshot for reference
  await page.screenshot({ path: resolve(__dirname, "agriflow_debug_login.png"), fullPage: true });
  console.log("Debug screenshot saved");
  
  await browser.close();
}

debugLogin().catch(console.error);
