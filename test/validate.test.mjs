import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { validateAll } from '../scripts/validate.mjs';
import { buildIndex } from '../scripts/build-index.mjs';

const fixtures = join(import.meta.dirname, 'fixtures');

test('a well-formed unverified entry passes', () => {
  const { files, problems } = validateAll(join(fixtures, 'good'));
  assert.equal(files.length, 1);
  assert.deepEqual(problems, []);
});

test('bad entries are caught', () => {
  const { problems } = validateAll(join(fixtures, 'bad'));
  const all = problems.join('\n');
  assert.match(all, /status verified needs verified_by/);
  assert.match(all, /fix_status verified needs verified_by/);
  assert.match(all, /verified_on|must have required property 'verified_on'/);
  assert.match(all, /Slack token/);
  assert.match(all, /must match file name/);
  assert.match(all, /must NOT be valid|must have required property 'tool'/);
});

test('the real registry is valid', () => {
  const { problems } = validateAll();
  assert.deepEqual(problems, []);
});

test('index has every call and nothing verified by anyone but matt', () => {
  const index = buildIndex();
  assert.equal(index.count, index.calls.length);
  for (const c of index.calls) {
    if (c.status === 'verified') assert.equal(c.verified_by, 'matt');
  }
});
