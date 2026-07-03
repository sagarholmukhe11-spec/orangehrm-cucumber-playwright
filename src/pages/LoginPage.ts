// src/pages/LoginPage.ts
// Page Object for OrangeHRM Login Page
// Contains all locators and actions for login page ONLY
// Step definitions import this class and call its methods

import { Page, expect } from '@playwright/test';

export class LoginPage {

  constructor(private page: Page) {}

  // ── LOCATORS ─────────────────────────────────────────────
  private usernameInput = () =>
    this.page.locator('[name="username"]');

  private passwordInput = () =>
    this.page.locator('[name="password"]');

  private loginButton = () =>
    this.page.locator('[type="submit"]');

  // Used for INVALID CREDENTIALS errors only
  // (banner-style message near top of the form)
  private errorMessage = () =>
    this.page.locator('.oxd-alert-content-text');


  private pageTitle = () =>
    this.page.locator('.oxd-text--h5');

  private userDropdown = () =>
    this.page.locator('.oxd-userdropdown-tab');

  private logoutOption = () =>
    this.page.getByRole('menuitem', { name: 'Logout' });

  // ── ACTIONS ──────────────────────────────────────────────
  async goto() {
    await this.page.goto('/web/index.php/auth/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async logout() {
    await this.userDropdown().click();
    await this.logoutOption().click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage().innerText();
  }

  // ── ASSERTIONS ───────────────────────────────────────────
  async assertLoginPageVisible() {
    await expect(this.pageTitle())
      .toContainText('Login');
  }

  async assertLoggedIn() {
    await expect(this.page)
      .toHaveURL(/dashboard/, { timeout: 10000 });
  }

  // Used ONLY for "Invalid credentials" scenario
  // Checks the banner-style error message
  async assertLoginError(expectedText: string) {
    await expect(this.errorMessage())
      .toContainText(expectedText, { timeout: 5000 });
  }

}