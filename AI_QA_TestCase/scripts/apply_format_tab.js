'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const target = path.join(__dirname, 'util', 'apply_format_tab.js');

if (require.main === module) {
  const result = spawnSync(process.execPath, [target, ...process.argv.slice(2)], { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}

module.exports = require('./util/apply_format_tab');
