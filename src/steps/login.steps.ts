// src/steps/login.steps.ts
// Step definitions for login.feature
// Each function here matches one Given/When/Then line in the feature file

import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../pages/LoginPage';
import { CustomWorld } from '../hooks/world';

// ── GIVEN ────────────────────────────────────────────────────
Given(
  'I am on the OrangeHRM login page',
  async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.assertLoginPageVisible();
  }
);

// ── WHEN ─────────────────────────────────────────────────────
When(
  'I enter username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.login(username, password);
  }
);

When(
  'I click logout',
  async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page);
    await loginPage.logout();
  }
);

// ── THEN ─────────────────────────────────────────────────────
Then(
  'I should be redirected to the dashboard',
  async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page);
    await loginPage.assertLoggedIn();
  }
);

Then(
  'I should be on the login page',
  async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page);
    await loginPage.assertLoginPageVisible();
  }
);

// Used ONLY for "Invalid credentials" scenario
// Matches feature line: Then I should see login error "Invalid credentials"
Then(
  'I should see login error {string}',
  async function (this: CustomWorld, expectedText: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.assertLoginError(expectedText);
  }
);

