#!/usr/bin/env node
// Validates every call file: schema, file placement, verification rules, no secrets.
// Exit code 1 on any problem. Usage: node scripts/validate.mjs [callsDir]
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { ROOT, CALLS_DIR, listCallFiles, readCall, pathParts, loadConfig } from './lib.mjs';

// Patterns that look like live credentials. Placeholders like <TOKEN> pass.
const SECRET_PATTERNS = [
  [/gh[pousr]_[A-Za-z0-9]{30,}/, 'GitHub token'],
  [/github_pat_[A-Za-z0-9_]{40,}/, 'GitHub fine-grained token'],
  [/xox[abposr]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/AIza[0-9A-Za-z_-]{35}/, 'Google API key'],
  [/ya29\.[0-9A-Za-z_-]{20,}/, 'Google OAuth access token'],
  [/figd_[A-Za-z0-9_-]{20,}/, 'Figma token'],
  [/ATATT[A-Za-z0-9_=-]{20,}/, 'Atlassian API token'],
  [/sk-ant-[A-Za-z0-9_-]{20,}/, 'Anthropic key'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
];

export function validateAll(callsDir = CALLS_DIR) {
  const schema = JSON.parse(readFileSync(join(ROOT, 'schema/call.schema.json'), 'utf8'));
  const ajv = new Ajv({ allErrors: true, strict: true, strictRequired: false });
  addFormats(ajv);
  const check = ajv.compile(schema);
  const { verifiers, providers } = loadConfig();
  const allowedVerifiers = new Set(Object.keys(verifiers));

  const problems = [];
  const ids = new Map();
  const files = listCallFiles(callsDir);

  for (const file of files) {
    const rel = relative(ROOT, file);
    const add = (msg) => problems.push(`${rel}: ${msg}`);
    let data, text;
    try {
      ({ data, text } = readCall(file));
    } catch (err) {
      add(err.message);
      continue;
    }

    if (!check(data)) {
      for (const e of check.errors) add(`${e.instancePath || '(root)'} ${e.message}`);
    }

    if (data.surface === 'api' && data.tool) add('api entries use endpoint, not tool');
    if (data.surface === 'mcp' && data.endpoint) add('mcp entries use tool, not endpoint');

    const parts = pathParts(file, callsDir);
    if (parts.depth !== 3) add('must live at calls/<provider>/<surface>/<id>.md');
    if (data.id !== parts.id) add(`id "${data.id}" must match file name "${parts.id}"`);
    if (data.provider !== parts.provider) add(`provider "${data.provider}" must match folder "${parts.provider}"`);
    if (data.surface !== parts.surface) add(`surface "${data.surface}" must match folder "${parts.surface}"`);
    if (typeof data.id === 'string' && !data.id.startsWith(`${data.provider}.${data.surface}.`)) {
      add('id must start with <provider>.<surface>.');
    }
    if (!providers.includes(data.provider)) add(`provider "${data.provider}" is not listed in registry.config.json`);

    if (ids.has(data.id)) add(`duplicate id, also in ${ids.get(data.id)}`);
    ids.set(data.id, rel);

    // Only a named verifier can mark something verified.
    if (data.status === 'verified' && !allowedVerifiers.has(data.verified_by)) {
      add(`status verified needs verified_by set to one of: ${[...allowedVerifiers].join(', ')}`);
    }
    for (const [i, e] of (data.errors ?? []).entries()) {
      if (e.fix_status === 'verified' && !allowedVerifiers.has(e.verified_by)) {
        add(`errors[${i}] fix_status verified needs verified_by set to one of: ${[...allowedVerifiers].join(', ')}`);
      }
    }

    for (const [re, label] of SECRET_PATTERNS) {
      if (re.test(text)) add(`looks like it contains a real ${label}. Use a placeholder like <TOKEN>.`);
    }
  }
  return { files, problems };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = process.argv[2] ? join(process.cwd(), process.argv[2]) : CALLS_DIR;
  const { files, problems } = validateAll(dir);
  if (problems.length) {
    console.error(problems.join('\n'));
    console.error(`\n${problems.length} problem(s) in ${files.length} file(s).`);
    process.exit(1);
  }
  console.log(`OK: ${files.length} call file(s) valid.`);
}
