// src/steps/common.steps.ts
// Step definitions shared across MULTIPLE feature files
// (login.feature AND employee.feature both use "required field" validation)
// Keeping this here avoids duplicate/ambiguous step definitions

import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../hooks/world';

// Used by BOTH login.feature (empty username/password)
// AND employee.feature (empty first/last name)
// Checks the inline red "Required" text under any empty field
Then(
  'I should see required field error',
  async function (this: CustomWorld) {
    const requiredError = this.page
      .locator('.oxd-input-field-error-message')
      .first();

    await expect(requiredError)
      .toContainText('Required', { timeout: 5000 });
  }
);