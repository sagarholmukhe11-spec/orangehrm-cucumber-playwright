// scripts/generate-report.js
// Converts the raw cucumber JSON report into a polished HTML report
// with charts, timelines, and embedded failure screenshots

const report = require('multiple-cucumber-html-reporter');
const os = require('os');
// Node.js File System module
// Used to copy files automatically
const fs = require('fs');

// Node.js Path module
// Used to build file paths safely across Windows/Linux/macOS
const path = require('path');

report.generate({
  jsonDir: 'reports',                    // reads reports/cucumber-report.json
  reportPath: 'reports/html-report',     // writes final HTML here
  reportName: 'OrangeHRM Automation Report',
  pageTitle: 'OrangeHRM Test Report',
  displayDuration: true,

  metadata: {
    browser: {
      name: 'chromium',
      version: 'latest'
    },
    device: os.hostname(),
    platform: {
      name: os.platform(),
      version: os.release()
    }
  },

  customData: {
    title: 'Run Info',
    data: [
      { label: 'Project', value: 'OrangeHRM Cucumber Playwright' },
      { label: 'Execution Start Time', value: new Date().toString() }
    ]
  }
});

console.log('✅ HTML report generated at reports/html-report/index.html');

// ─────────────────────────────────────────────────────────────
// Copy Allure configuration files into allure-results
//
// Why?
// Allure reads these files ONLY from the allure-results folder.
//
// Files copied:
//   • environment.properties
//   • executor.json
//   • categories.json
//
// This makes the process automatic.
// Developers only run:
//
//      npm test
//
// Everything else happens automatically.
// ─────────────────────────────────────────────────────────────

const allureResults = path.join(__dirname, '..', 'allure-results');

const filesToCopy = [
  'environment.properties',
  'executor.json',
  'categories.json'
];

filesToCopy.forEach(file => {

  const source = path.join(__dirname, '..', file);
  const destination = path.join(allureResults, file);

  if (fs.existsSync(source)) {

    fs.copyFileSync(source, destination);

    console.log(`✅ Copied ${file} → allure-results`);

  } else {

    console.log(`⚠ ${file} not found`);

  }

});