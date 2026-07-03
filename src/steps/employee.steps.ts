// src/steps/employee.steps.ts
// Step definitions for employee.feature
// Matches every Given/When/Then line about the PIM/Employee module

import { When, Then } from '@cucumber/cucumber';
import { EmployeePage } from '../pages/EmployeePage';
import { CustomWorld } from '../hooks/world';

// ── WHEN ─────────────────────────────────────────────────────
When(
  'I navigate to the PIM module',
  async function (this: CustomWorld) {
    const employeePage = new EmployeePage(this.page);
    await employeePage.goToPIM();
  }
);

When(
  'I click Add Employee',
  async function (this: CustomWorld) {
    const employeePage = new EmployeePage(this.page);
    await employeePage.clickAddEmployee();
  }
);

When(
  'I fill in first name {string} and last name {string}',
  async function (this: CustomWorld, firstName: string, lastName: string) {
    const employeePage = new EmployeePage(this.page);
    await employeePage.fillEmployeeDetails(firstName, lastName);
  }
);

When(
  'I save the employee',
  async function (this: CustomWorld) {
    const employeePage = new EmployeePage(this.page);
    await employeePage.saveEmployee();
  }
);

When(
  'I search for employee {string}',
  async function (this: CustomWorld, name: string) {
    const employeePage = new EmployeePage(this.page);
    await employeePage.searchEmployee(name);
  }
);

// ── THEN ─────────────────────────────────────────────────────
Then(
  'I should see a success message',
  async function (this: CustomWorld) {
    const employeePage = new EmployeePage(this.page);
    await employeePage.assertEmployeeSaved();
  }
);

Then(
  'I should see {string} in the employee list',
  async function (this: CustomWorld, name: string) {
    const employeePage = new EmployeePage(this.page);
    await employeePage.assertEmployeeInList(name);
  }
);

Then(
  'I should see no records found',
  async function (this: CustomWorld) {
    const employeePage = new EmployeePage(this.page);
    await employeePage.assertNoRecordsFound();
  }
);

