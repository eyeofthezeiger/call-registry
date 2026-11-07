#!/usr/bin/env node
// PR gate: fails when a change flips any status or fix_status to "verified"
// and the PR author is not a listed verifier. Bots and agents can propose
// entries; only Matt can verify them.
// Env: BASE_REF (e.g. origin/main), PR_AUTHOR (GitHub login).
import { execFileSync } from 'node:child_process';
import { parse } from 'yaml';
import { loadConfig } from './lib.mjs';

const base = process.env.BASE_REF || 'origin/main';
const author = process.env.PR_AUTHOR || '';
const logins = new Set(Object.values(loadConfig().verifiers));

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
const front = (text) => {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? parse(m[1]) ?? {} : {};
};
const verifiedKeys = (d) => {
  const keys = new Set();
  if (d.status === 'verified') keys.add('status');
  for (const e of d.errors ?? []) if (e.fix_status === 'verified') keys.add(`error:${e.code}`);
  return keys;
};

const changed = git('diff', '--name-only', '--diff-filter=AM', `${base}...HEAD`, '--', 'calls/')
  .split('\n')
  .filter((f) => f.endsWith('.md'));

const flips = [];
for (const file of changed) {
  let before = new Set();
  try {
    before = verifiedKeys(front(git('show', `${base}:${file}`)));
  } catch {
    // new file
  }
  const after = verifiedKeys(front(git('show', `HEAD:${file}`)));
  for (const k of after) if (!before.has(k)) flips.push(`${file} (${k})`);
}

if (flips.length && !logins.has(author)) {
  console.error(`Only ${[...logins].join(', ')} can mark entries verified. PR author: "${author || 'unknown'}".`);
  console.error(flips.map((f) => `  ${f}`).join('\n'));
  process.exit(1);
}
console.log(flips.length ? `OK: ${flips.length} verification(s) by ${author}.` : 'OK: no new verifications.');
