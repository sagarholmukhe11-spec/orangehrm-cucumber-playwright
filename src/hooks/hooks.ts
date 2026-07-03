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
// Runs after EACH scenario
// If scenario FAILED → take screenshot → attach to report
// Always close context → clean up memory
After(async function (this: CustomWorld,scenario: ITestCaseHookParameter) {

  // Check if this scenario failed
  if (scenario.result?.status === 'FAILED') {

    // Take full page screenshot
    const screenshot = await this.page.screenshot({
      fullPage: true
    });

    // Attach screenshot to Cucumber HTML report
    // You will see this image inside the report when you open it
    await this.attach(screenshot, 'image/png');

    console.log(`❌ Scenario FAILED: ${scenario.pickle.name}`);
    console.log('📸 Screenshot captured and attached to report');
  }

  // Close context after every scenario
  // This clears cookies, sessions, storage
  await this.context.close();
  console.log('✅ Context closed after scenario');
});

// ── AFTER ALL ────────────────────────────────────────────────
// Runs ONCE after ALL scenarios finish
// Close the browser completely
AfterAll(async () => {
  await browser.close();
  console.log('✅ Browser closed after all scenarios');
});