// Runner logic tests. Uses local fake servers only, never a real account.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { substitute, plan, runOne } from '../scripts/smoke.mjs';

let server;
let base;

before(async () => {
  server = createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    if (req.url.startsWith('/ok')) {
      const authed = req.headers.authorization === 'Bearer t0';
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ ok: authed, error: authed ? undefined : 'invalid_auth' }));
    }
    if (req.url === '/mcp') {
      const msg = JSON.parse(body);
      if (!msg.id) {
        res.writeHead(202);
        return res.end();
      }
      const result =
        msg.method === 'initialize'
          ? { protocolVersion: '2025-06-18', capabilities: {}, serverInfo: { name: 'fake', version: '1' } }
          : { tools: [{ name: 'get_file_contents' }] };
      // Answer as SSE to exercise that path.
      res.writeHead(200, { 'content-type': 'text/event-stream', 'mcp-session-id': 's1' });
      return res.end(`event: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', id: msg.id, result })}\n\n`);
    }
    res.writeHead(404);
    res.end();
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const apiCall = (over = {}) => ({
  id: 'slack.api.x',
  surface: 'api',
  smoke: {
    kind: 'read',
    env: ['TOK'],
    request: { method: 'GET', url: `${base}/ok?c=\${CHAN}`, headers: { Authorization: 'Bearer ${TOK}' } },
    expect: { status: 200, json: { ok: true } },
    ...over,
  },
});

test('substitute fills vars and reports missing ones', () => {
  assert.equal(substitute('a ${X} b', { X: '1' }), 'a 1 b');
  assert.equal(substitute('a ${X} b', {}), null);
});

test('plan skips manual, writes and missing env', () => {
  assert.equal(plan({ smoke: { kind: 'manual' } }, {}).action, 'skip');
  assert.match(plan({ smoke: { kind: 'write', request: {} } }, {}, { includeWrites: true }).detail, /SMOKE_SANDBOX/);
  assert.match(plan(apiCall(), {}).detail, /missing env: TOK/);
  assert.equal(plan(apiCall(), { TOK: 'x' }).action, 'http');
});

test('read call passes with the right token and fails with the wrong one', async () => {
  assert.equal((await runOne(apiCall(), { TOK: 't0', CHAN: 'c' })).status, 'passing');
  const bad = await runOne(apiCall(), { TOK: 'nope', CHAN: 'c' });
  assert.equal(bad.status, 'failing');
  assert.match(bad.detail, /invalid_auth/);
});

test('a placeholder with no env value skips instead of failing', async () => {
  assert.equal((await runOne(apiCall(), { TOK: 't0' })).status, 'skipped');
});

test('mcp tools/list check finds the tool over SSE', async () => {
  const call = (name) => ({
    id: 'github.mcp.x',
    surface: 'mcp',
    tool: { name, server: 'fake', server_url: `${base}/mcp` },
    smoke: { kind: 'read', env: ['TOK'], mcp_tools_list: true },
  });
  assert.equal((await runOne(call('get_file_contents'), { TOK: 't0' })).status, 'passing');
  assert.equal((await runOne(call('missing_tool'), { TOK: 't0' })).status, 'failing');
});
