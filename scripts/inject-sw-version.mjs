import fs from 'node:fs';
import { execSync } from 'node:child_process';

const sha = (() => {
  try { return execSync('git rev-parse --short HEAD').toString().trim(); }
  catch { return Date.now().toString(36); }
})();

const swPath = 'dist/sw.js';
if (!fs.existsSync(swPath)) {
  console.error(`SW file missing: ${swPath}`);
  process.exit(1);
}

const cacheName = `hadaling-${sha}`;
const original = fs.readFileSync(swPath, 'utf-8');
const updated = original.replace(/__CACHE_VERSION__/g, cacheName);

if (original === updated) {
  console.warn('SW placeholder __CACHE_VERSION__ not found — skipping.');
} else {
  fs.writeFileSync(swPath, updated);
  console.log(`SW cache name set to: ${cacheName}`);
}
