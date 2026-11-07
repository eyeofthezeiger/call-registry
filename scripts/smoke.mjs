#!/usr/bin/env node
// Smoke runner. Checks each call with the owner's own credentials from env vars.
//
// Meant to run on Matt's machine (for example by his chief-of-staff agent),
// never in CI and never against someone else's account.
//
//   node scripts/smoke.mjs                      read-only tests, results to results/
//   node scripts/smoke.mjs --only slack.        only ids starting with "slack."
//   node scripts/smoke.mjs --update             also write test: {...} back into each call file
//   SMOKE_SANDBOX=1 node scripts/smoke.mjs --include-writes
//                                               also run write tests that define a request
//
// Missing env vars mean "skipped", never "failing". Manual tests are always skipped.
// The runner never prints tokens or response bodies.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { hostname } from 'node:os';
import { parseDocument } from 'yaml';
import { ROOT, listCallFiles, readCall } from './lib.mjs';

const TIMEOUT_MS = 15_000;

// Replace ${VAR} with env values. Returns null if any var is missing.
export function substitute(text, env) {
  let missing = false;
  const out = text.replace(/\$\{([A-Z][A-Z0-9_]*)\}/g, (_, name) => {
    if (env[name] === undefined || env[name] === '') {
      missing = true;
      return '';
    }
    return env[name];
  });
  return missing ? null : out;
}

// Decide what to do with one call, before any network.
export function plan(call, env, opts = {}) {
  const s = call.smoke;
  if (!s) return { action: 'skip', detail: 'no smoke block' };
  if (s.kind === 'manual') return { action: 'skip', detail: 'manual only' };
  if (s.kind === 'write') {
    if (!opts.includeWrites || env.SMOKE_SANDBOX !== '1') {
      return { action: 'skip', detail: 'write test; needs --include-writes and SMOKE_SANDBOX=1' };
    }
    if (!s.request) return { action: 'skip', detail: 'write test has no request defined' };
  }
  const missing = (s.env ?? []).filter((v) => !env[v]);
  if (missing.length) return { action: 'skip', detail: `missing env: ${missing.join(', ')}` };
  if (call.surface === 'mcp' && s.mcp_tools_list) return { action: 'mcp-tools-list' };
  if (s.request) return { action: 'http' };
  return { action: 'skip', detail: 'nothing to run' };
}

async function timedFetch(url, init) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function runHttp(call, env) {
  const r = call.smoke.request;
  const url = substitute(r.url, env);
  const headers = {};
  for (const [k, v] of Object.entries(r.headers ?? {})) headers[k] = substitute(v, env);
  const body = r.body ? substitute(r.body, env) : undefined;
  if (url === null || Object.values(headers).includes(null) || body === null) {
    return { status: 'skipped', detail: 'a placeholder had no env value' };
  }
  if (body) headers['Content-Type'] ??= 'application/json';
  const res = await timedFetch(url, { method: r.method, headers, body });
  const expect = call.smoke.expect ?? {};
  const want = expect.status ?? 200;
  if (res.status !== want) return { status: 'failing', detail: `HTTP ${res.status}, expected ${want}` };
  if (expect.json) {
    let json;
    try {
      json = await res.json();
    } catch {
      return { status: 'failing', detail: 'response was not JSON' };
    }
    for (const [k, v] of Object.entries(expect.json)) {
      if (json?.[k] !== v) {
        // Slack-style error codes are safe to show; nothing else from the body is.
        const hint = typeof json?.error === 'string' ? ` (error: ${json.error})` : '';
        return { status: 'failing', detail: `expected ${k}=${JSON.stringify(v)}${hint}` };
      }
    }
  }
  return { status: 'passing', detail: `HTTP ${res.status}` };
}

// Read a JSON-RPC result from a JSON or SSE (text/event-stream) response.
async function rpcResult(res, id) {
  const type = res.headers.get('content-type') ?? '';
  const text = await res.text();
  const messages = type.includes('text/event-stream')
    ? text
        .split('\n')
        .filter((l) => l.startsWith('data:'))
        .map((l) => JSON.parse(l.slice(5).trim()))
    : [JSON.parse(text)];
  const msg = messages.find((m) => m.id === id);
  if (!msg) throw new Error('no JSON-RPC reply');
  if (msg.error) throw new Error(`JSON-RPC error ${msg.error.code}`);
  return msg.result;
}

// Streamable HTTP MCP: initialize, then tools/list until the tool shows up.
async function runMcpToolsList(call, env) {
  const url = call.tool.server_url;
  const token = env[call.smoke.env?.[0]];
  const base = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const post = (headers, body) => timedFetch(url, { method: 'POST', headers, body: JSON.stringify(body) });

  const init = await post(base, {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'call-registry-smoke', version: '0.1.0' } },
  });
  if (!init.ok) return { status: 'failing', detail: `initialize HTTP ${init.status}` };
  const result = await rpcResult(init, 1);
  const session = init.headers.get('mcp-session-id');
  const headers = { ...base, ...(session ? { 'Mcp-Session-Id': session } : {}) };
  if (result?.protocolVersion) headers['MCP-Protocol-Version'] = result.protocolVersion;
  await post(headers, { jsonrpc: '2.0', method: 'notifications/initialized' });

  let cursor;
  for (let page = 0, id = 2; page < 20; page++, id++) {
    const res = await post(headers, { jsonrpc: '2.0', id, method: 'tools/list', params: cursor ? { cursor } : {} });
    if (!res.ok) return { status: 'failing', detail: `tools/list HTTP ${res.status}` };
    const r = await rpcResult(res, id);
    if ((r.tools ?? []).some((t) => t.name === call.tool.name)) {
      return { status: 'passing', detail: 'tool listed by server' };
    }
    cursor = r.nextCursor;
    if (!cursor) break;
  }
  return { status: 'failing', detail: 'tool not in tools/list' };
}

export async function runOne(call, env, opts = {}) {
  const p = plan(call, env, opts);
  if (p.action === 'skip') return { status: 'skipped', detail: p.detail };
  try {
    return p.action === 'http' ? await runHttp(call, env) : await runMcpToolsList(call, env);
  } catch (err) {
    return { status: 'failing', detail: err.name === 'AbortError' ? 'timed out' : String(err.message).slice(0, 120) };
  }
}

// Rewrite only the test: block in a call file's front matter.
export function writeTestBlock(file, test) {
  const text = readFileSync(file, 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n?[\s\S]*)$/);
  const doc = parseDocument(m[1]);
  doc.set('test', test);
  writeFileSync(file, `---\n${doc.toString({ lineWidth: 0, flowCollectionPadding: false }).trimEnd()}\n---${m[2]}`);
}

async function main() {
  const args = process.argv.slice(2);
  const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : '';
  const opts = { includeWrites: args.includes('--include-writes') };
  const update = args.includes('--update');
  const runner = process.env.SMOKE_RUNNER || `smoke@${hostname()}`;
  const today = new Date().toISOString().slice(0, 10);

  const results = [];
  for (const file of listCallFiles()) {
    const { data } = readCall(file);
    if (only && !data.id.startsWith(only)) continue;
    const r = await runOne(data, process.env, opts);
    results.push({ id: data.id, ...r });
    console.log(`${r.status.padEnd(8)} ${data.id}  ${r.detail ?? ''}`);
    // Skips don't overwrite an earlier pass or fail.
    if (update && r.status !== 'skipped') {
      writeTestBlock(file, { status: r.status, ran_on: today, runner, detail: r.detail });
    }
  }

  const counts = {};
  for (const r of results) counts[r.status] = (counts[r.status] ?? 0) + 1;
  mkdirSync(join(ROOT, 'results'), { recursive: true });
  const out = join(ROOT, 'results', `smoke-${today}.json`);
  writeFileSync(out, JSON.stringify({ ran_on: today, runner, counts, results }, null, 2) + '\n');
  console.log(`\n${JSON.stringify(counts)}  ->  ${relative(ROOT, out)}`);
  if (update) console.log('Updated test blocks. Run npm run build, then open a PR for review.');
  process.exit(counts.failing ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
