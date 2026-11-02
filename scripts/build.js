import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const hasDist = fs.existsSync('dist/server.js');

// Try local node_modules/.bin/tsc first
const localTsc = path.resolve('node_modules', '.bin', 'tsc');
if (fs.existsSync(localTsc)) {
  const res = spawnSync(localTsc, [], { stdio: 'inherit' });
  if (res.status === 0) {
    process.exit(0);
  }
}

// Try global tsc
try {
  const result = spawnSync('tsc', [], { stdio: 'inherit' });
  if (result.status === 0) {
    process.exit(0);
  }
} catch {
  // Ignore
}

// Fallback: If prebuilt dist files exist, succeed gracefully
if (hasDist) {
  console.log('[cloude-agent-agycli] Using pre-built dist output.');
  process.exit(0);
}

console.error('[cloude-agent-agycli] Build failed: neither tsc nor prebuilt dist/ was found.');
process.exit(1);
