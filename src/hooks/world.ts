// src/hooks/world.ts
// Custom World — tells TypeScript what "this" contains in steps/hooks
// Cucumber creates a new instance of this for every scenario

import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Page, BrowserContext } from '@playwright/test';

export class CustomWorld extends World {
  page!: Page;
  context!: BrowserContext;
}

setWorldConstructor(CustomWorld);