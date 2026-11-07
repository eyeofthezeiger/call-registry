#!/usr/bin/env node
// Builds dist/calls.json, the file AI setups consume.
// --check exits 1 if the committed index is out of date.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, listCallFiles, readCall } from './lib.mjs';

export function buildIndex() {
  const calls = listCallFiles().map((file) => {
    const { data, body } = readCall(file);
    return { ...data, file: relative(ROOT, file), body: body.trim() };
  });
  calls.sort((a, b) => a.id.localeCompare(b.id));
  const counts = {};
  for (const c of calls) counts[c.status] = (counts[c.status] ?? 0) + 1;
  // No timestamp, so the file only changes when entries change.
  return { schema: 'schema/call.schema.json', count: calls.length, counts, calls };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = join(ROOT, 'dist/calls.json');
  const next = JSON.stringify(buildIndex(), null, 2) + '\n';
  if (process.argv.includes('--check')) {
    const current = existsSync(out) ? readFileSync(out, 'utf8') : '';
    if (current !== next) {
      console.error('dist/calls.json is out of date. Run: npm run build');
      process.exit(1);
    }
    console.log('OK: dist/calls.json is up to date.');
  } else {
    mkdirSync(join(ROOT, 'dist'), { recursive: true });
    writeFileSync(out, next);
    console.log(`Wrote dist/calls.json with ${JSON.parse(next).count} call(s).`);
  }
}
