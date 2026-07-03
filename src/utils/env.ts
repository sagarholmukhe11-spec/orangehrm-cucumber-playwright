// src/utils/env.ts
// This file reads the .env file and exports all values
// Every other file in the framework imports from HERE
// Never read process.env directly in any other file

import * as dotenv from 'dotenv';

// This line loads .env file into process.env
dotenv.config();

// Export all values as one object called ENV
export const ENV = {

  // Application URL — where OrangeHRM is hosted
  BASE_URL: process.env.BASE_URL
    || 'https://opensource-demo.orangehrmlive.com',

  // Login credentials for admin user
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'Admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',

  // Database connection details
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASS: process.env.DB_PASS || '',
  DB_NAME: process.env.DB_NAME || 'orangehrm_test',

  // Environment name — staging, prod etc
  ENV: process.env.ENV || 'staging',

  // HEADLESS=true  → browser runs invisible (CI/CD)
  // HEADLESS=false → browser visible (local debugging)
  HEADLESS: process.env.HEADLESS !== 'false',

};