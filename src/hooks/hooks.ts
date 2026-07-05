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
import fs from 'fs';

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

  // Create traces folder if it doesn't exist.
// This prevents Playwright from failing
// when saving trace ZIP files.

const tracesDir = 'traces';

if (!fs.existsSync(tracesDir)) {
    fs.mkdirSync(tracesDir, { recursive: true });
}
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
    baseURL: ENV.BASE_URL,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,  // ignore SSL errors
  });
  // ─────────────────────────────────────────────────────────────
  // START PLAYWRIGHT TRACE
  //
  // Trace Viewer records EVERYTHING happening inside this scenario.
  //
  // It captures:
  //
  // ✅ Every click
  // ✅ Every keyboard action
  // ✅ Every navigation
  // ✅ DOM snapshots
  // ✅ Network requests
  // ✅ Console logs
  // ✅ Screenshots during execution
  //
  // Think of it as a "CCTV recording" of the complete test.
  //
  // IMPORTANT:
  //
  // We start tracing AFTER creating BrowserContext
  // because each scenario should have its own independent trace.
  //
  // If we started tracing in BeforeAll(),
  // one gigantic trace would contain all scenarios,
  // making debugging nearly impossible.
  // ─────────────────────────────────────────────────────────────
try {
  await context.tracing.start({

    // Capture screenshots after every action
    screenshots: true,

    // Capture DOM snapshots
    snapshots: true,

    // Capture source code and action details
    sources: true

  });
  console.log("✅ Trace started");

} catch (error) {
  console.error("❌ Trace start failed");
  console.error(error);
}

  // Create new page — like new tab inside that window
  const page: Page = await context.newPage();

  // Attach page and context to 'this'
  // This makes them available in ALL step definition files
  // In steps you access them as: this.page and this.context
  this.page = page;
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

  console.log("👉 Entered After Hook");

  // Check whether current scenario failed
  if (scenario.result?.status === 'FAILED') {
    // ─────────────────────────────────────────────────────────────
    // SAVE TRACE
    //
    // We save the trace ONLY for failed scenarios.
    //
    // Why?
    //
    // Trace files are much larger than screenshots.
    // In enterprise projects,
    // storing traces for every successful test
    // wastes disk space and CI storage.
    //
    // Example:
    //
    // 5000 Tests
    //
    // 4950 Passed
    // 50 Failed
    //
    // Saving traces only for failures dramatically
    // reduces storage usage.
    //
    // The generated trace (.zip) can later be opened
    // using:
    //
    // npx playwright show-trace trace.zip
    //
    // Think of this file as the complete CCTV recording
    // of the failed scenario.
    // ─────────────────────────────────────────────────────────────

    // Create a safe filename.
    //
    // Scenario names contain spaces like:
    //
    // "Valid admin login navigates to dashboard"
    //
    // Windows/Linux allow spaces, but enterprise frameworks
    // usually replace spaces with "_" so filenames are cleaner.

    const traceFileName = scenario.pickle.name.replace(/\s+/g, '_');

// Capture screenshot first
const screenshot = await this.page.screenshot({
    fullPage: true
});

// Attach to report
 this.attach(
    screenshot,
    'image/png'
);

// Now stop tracing and save the trace
try{
  await this.context.tracing.stop({
    path: `traces/${traceFileName}.zip`
});

console.log(`📂 Trace saved: traces/${traceFileName}.zip`);
} catch (error) {
  console.error("❌ Trace stop failed");
  console.error(error);
}
 

    console.log("══════════════════════════════");
    console.log("❌ Scenario FAILED");
    console.log(`Scenario : ${scenario.pickle.name}`);
    console.log(`Status   : ${scenario.result.status}`);
    console.log("📸 Screenshot captured");
    console.log("══════════════════════════════");

  } else {
    // Stop tracing.
    //
    // Since this scenario passed,
    // we don't need to save a trace file.
    //
    // Passing tests execute thousands of times
    // in CI pipelines, so saving traces would
    // waste storage.
    //
    // Calling stop() without a path simply
    // discards the recording.

   // await this.context.tracing.stop();

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