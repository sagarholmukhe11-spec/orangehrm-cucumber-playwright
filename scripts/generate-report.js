// scripts/generate-report.js
// Converts the raw cucumber JSON report into a polished HTML report
// with charts, timelines, and embedded failure screenshots

const report = require('multiple-cucumber-html-reporter');
const os = require('os');

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