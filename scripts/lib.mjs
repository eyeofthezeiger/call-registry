// Shared helpers: find call files, split front matter, parse YAML.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, basename, sep } from 'node:path';
import { parse } from 'yaml';

export const ROOT = new URL('..', import.meta.url).pathname;
export const CALLS_DIR = join(ROOT, 'calls');

export function listCallFiles(dir = CALLS_DIR) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...listCallFiles(full));
    else if (name.endsWith('.md') && name !== 'README.md') out.push(full);
  }
  return out.sort();
}

// Returns { data, body } or throws with a readable message.
export function readCall(file) {
  const text = readFileSync(file, 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('missing YAML front matter (--- block at the top)');
  const data = parse(m[1], { prettyErrors: true });
  if (!data || typeof data !== 'object') throw new Error('front matter is empty');
  return { data, body: m[2], text };
}

// calls/<provider>/<surface>/<id>.md
export function pathParts(file, root = CALLS_DIR) {
  const rel = relative(root, file).split(sep);
  return { provider: rel[0], surface: rel[1], id: basename(file, '.md'), depth: rel.length };
}

export function loadConfig() {
  return JSON.parse(readFileSync(join(ROOT, 'registry.config.json'), 'utf8'));
}
