// src/pages/EmployeePage.ts
// Page Object for OrangeHRM PIM (Employee Management) module
// Covers: Add Employee, Search Employee, View Employee List

import { Page, expect } from '@playwright/test';

export class EmployeePage {

  // page comes from hooks.ts via this.page in step definitions
  constructor(private page: Page) {}

  // ── LOCATORS ─────────────────────────────────────────────
  // Private — only this class uses these

  // Left side navigation menu → PIM link
  private pimMenuLink = () =>
    this.page.getByRole('link', { name: 'PIM' });

  // Add button on employee list page
  private addButton = () =>
    this.page.getByRole('button', { name: 'Add' });

  // First name input on Add Employee form
  private firstNameInput = () =>
    this.page.locator('input[name="firstName"]');

  // Last name input on Add Employee form
  private lastNameInput = () =>
    this.page.locator('input[name="lastName"]');

  // Save button on Add Employee form
  private saveButton = () =>
    this.page.getByRole('button', { name: 'Save' });

  // Search input on Employee List page
  private employeeNameSearch = () =>
    this.page.locator(
      '.oxd-input-group:has(.oxd-label:text("Employee Name")) input'
    );

  // Search button on Employee List page
  private searchButton = () =>
    this.page.getByRole('button', { name: 'Search' });

  // Success toast message after saving
  private successToast = () =>
    this.page.locator('.oxd-toast--success');

  // All rows in employee results table
  private tableRows = () =>
    this.page.locator('.oxd-table-row--with-border');

  // No records found text
  private noRecordsText = () =>
    this.page.locator('.oxd-table-cell span:text("No Records Found")');

  // ── ACTIONS ──────────────────────────────────────────────
  // Public — step definitions call these

  // Click PIM in left navigation menu
  async goToPIM() {
    await this.pimMenuLink().click();
    // Wait until URL changes to employee list page
    await this.page.waitForURL(/pim\/viewEmployeeList/, {
      timeout: 10000
    });
    console.log('✅ Navigated to PIM module');
  }

  // Click Add button to go to Add Employee form
  async clickAddEmployee() {
    await this.addButton().click();
    // Wait until URL changes to add employee page
    await this.page.waitForURL(/pim\/addEmployee/, {
      timeout: 10000
    });
    console.log('✅ Navigated to Add Employee page');
  }

  // Fill in employee first name and last name
  async fillEmployeeDetails(
    firstName: string,
    lastName: string
  ) {
    // Clear field first then fill
    await this.firstNameInput().clear();
    await this.firstNameInput().fill(firstName);

    await this.lastNameInput().clear();
    await this.lastNameInput().fill(lastName);

    console.log(`✅ Filled employee: ${firstName} ${lastName}`);
  }

  // Click Save button to save employee
  async saveEmployee() {
    await this.saveButton().click();
    console.log('✅ Save button clicked');
  }

  // Type name in search box and click Search
  async searchEmployee(name: string) {
    await this.employeeNameSearch().fill(name);
    await this.searchButton().click();
    // Wait for results to load
    await this.page.waitForLoadState('networkidle');
    console.log(`✅ Searched for employee: ${name}`);
  }

  // Get count of rows in results table
  async getEmployeeCount(): Promise<number> {
    return await this.tableRows().count();
  }

  // ── ASSERTIONS ───────────────────────────────────────────
  // Verify things on the page

  // Verify success toast is visible after saving
  async assertEmployeeSaved() {
    await expect(this.successToast())
      .toBeVisible({ timeout: 10000 });
    console.log('✅ Success toast visible');
  }

  // Verify employee name appears in results table
async assertEmployeeInList(name: string) {
  // Split "Sagar Khatvkar" into ["Sagar", "Khatvkar"]
  // because OrangeHRM shows first/last name in SEPARATE table columns
  const parts = name.split(' ').filter(Boolean);

  // Start with all table rows, then narrow down to the row
  // that contains EVERY part of the name (first AND last)
  let rowLocator = this.page.locator('.oxd-table-row--with-border');
  for (const part of parts) {
    rowLocator = rowLocator.filter({ hasText: part });
  }

  await expect(rowLocator.first()).toBeVisible({ timeout: 10000 });
  console.log(`✅ Employee "${name}" found in list`);
}

  // Verify no records found message appears
  async assertNoRecordsFound() {
    await expect(this.page.locator('.oxd-table-card'))
      .not.toBeVisible({ timeout: 10000 });
    console.log('✅ No records found confirmed');
  }
}