// scripts/run-tests.js
// Runs cucumber-js, then ALWAYS generates the HTML report afterwards
// (even if tests failed) — then exits with the same pass/fail code
// so CI/CD pipelines still correctly detect failures

const { spawnSync } = require('child_process');

// Optional tag passed in, e.g. node scripts/run-tests.js @smoke
const tag = process.argv[2];

const args = ['cucumber-js'];
if (tag) {
  args.push('--tags', tag);
}

console.log(`\n🚀 Running tests${tag ? ' with tag ' + tag : ''}...\n`);

const result = spawnSync('npx', args, {
  stdio: 'inherit',
  shell: true
});

console.log('\n📊 Generating HTML report...\n');
require('./generate-report.js');

// Exit with cucumber's real exit code (0 = pass, 1 = fail)
// so npm/CI still knows if the run actually failed
process.exit(result.status);