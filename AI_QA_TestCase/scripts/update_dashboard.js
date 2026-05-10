'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const target = path.join(__dirname, 'util', 'update_dashboard.js');

if (require.main === module) {
  const result = spawnSync(process.execPath, [target, ...process.argv.slice(2)], { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}

module.exports = {};
