// src/hooks/hooks.ts
// Hooks = automatic setup and teardown for every scenario
// Cucumber reads this file and runs these automatically
// You never call these manually — Cucumber handles it

import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  setDefaultTimeout,
  ITestCaseHookParameter
} from '@cucumber/cucumber';

import {
  Browser,
  BrowserContext,
  Page,
  chromium
} from '@playwright/test';

import { ENV } from '../utils/env';
import { CustomWorld } from './world';

// ── SET TIMEOUT ──────────────────────────────────────────────
// Maximum time allowed for each step
// If a step takes longer than 30 seconds → it fails
setDefaultTimeout(30 * 1000);

// ── GLOBAL VARIABLES ─────────────────────────────────────────
// These are shared across all hooks
// browser → one instance for all scenarios
let browser: Browser;

// ── BEFORE ALL ───────────────────────────────────────────────
// Runs ONCE before any scenario starts
// We launch browser here — expensive to do per scenario
BeforeAll(async () => {
  browser = await chromium.launch({

    // HEADLESS=true  → browser invisible → used in CI/CD
    // HEADLESS=false → browser visible  → used locally to see what happens
    headless: ENV.HEADLESS,

    // slowMo adds delay between actions — useful for debugging
    // 0 = no delay (normal speed)
    slowMo: 0,
  });
  console.log('✅ Browser launched');
});

// ── BEFORE ───────────────────────────────────────────────────
// Runs before EACH scenario
// Creates fresh context and page for every scenario
// Fresh context = fresh cookies = fresh login session
// So each scenario starts completely clean
Before(async function (this: CustomWorld) {

  // Create new browser context — like new incognito window
  // Each scenario gets its own isolated session
  const context: BrowserContext = await browser.newContext({
    baseURL:           ENV.BASE_URL,
    viewport:          { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,  // ignore SSL errors
  });

  // Create new page — like new tab inside that window
  const page: Page = await context.newPage();

  // Attach page and context to 'this'
  // This makes them available in ALL step definition files
  // In steps you access them as: this.page and this.context
  this.page    = page;
  this.context = context;

  console.log('✅ New page created for scenario');
});

// ── AFTER ────────────────────────────────────────────────────
// Runs AFTER every scenario execution
//
// Responsibilities:
//   ✔ Check whether scenario PASSED or FAILED
//   ✔ If FAILED:
//       • Capture full-page screenshot
//       • Attach screenshot to Cucumber Report
//       • Same screenshot is automatically available
//         inside the Allure Report
//   ✔ Print execution status in terminal
//   ✔ Close browser context
//       • Clears cookies
//       • Clears local/session storage
//       • Prevents memory leaks
//       • Ensures next scenario starts fresh
//
// NOTE:
// Browser is NOT closed here.
// Only BrowserContext is closed.
// Browser closes once in AfterAll().
After(async function (
  this: CustomWorld,
  scenario: ITestCaseHookParameter
) {

  // Check whether current scenario failed
  if (scenario.result?.status === 'FAILED') {

    // Take screenshot ONLY for failed scenarios
    // fullPage:true captures the complete webpage
    // instead of only the visible browser window
    const screenshot = await this.page.screenshot({
      fullPage: true
    });

    // Attach screenshot to Cucumber Report.
    // Since Allure is integrated with Cucumber,
    // the same screenshot automatically appears
    // inside the Allure report.
    //
    // screenshot → Image captured by Playwright
    // image/png → MIME type so reports know
    //             this attachment is an image.
    await this.attach(
      screenshot,
      'image/png'
    );

    console.log("══════════════════════════════");
    console.log("❌ Scenario FAILED");
    console.log(`Scenario : ${scenario.pickle.name}`);
    console.log(`Status   : ${scenario.result.status}`);
    console.log("📸 Screenshot captured");
    console.log("══════════════════════════════");

  } else {

    console.log("══════════════════════════════");
    console.log("✅ Scenario PASSED");
    console.log(`Scenario : ${scenario.pickle.name}`);
    console.log("══════════════════════════════");

  }

  // Close BrowserContext.
  // This removes cookies, cache, storage,
  // authentication sessions and prevents
  // memory leaks between scenarios.
  await this.context.close();

  console.log("🧹 Browser Context Closed");
});

// ── AFTER ALL ────────────────────────────────────────────────
// Runs ONCE after ALL scenarios finish
// Close the browser completely
AfterAll(async () => {
  await browser.close();
  console.log('✅ Browser closed after all scenarios');
});