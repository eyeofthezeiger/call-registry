# call-registry

A catalog of single API calls and MCP tool calls that AI setups can pull from, so they only use calls known to work.

- One file per call, with ready-to-paste config, auth and scopes, known errors and fixes.
- Tool-agnostic. Platform notes (Claude Code, VS Code, Cursor, Codex) only where a tool needs its own shape.
- Everything starts **unverified**. Only Matt marks a call or a fix verified.

## Use it

Point your setup at the built index:

```
https://raw.githubusercontent.com/eyeofthezeiger/call-registry/main/dist/calls.json
```

Filter on what you trust:

- `status: verified` for calls Matt confirmed.
- `test.status: passing` for calls the smoke runner hit recently.
- Everything else is a lead, not a guarantee.

## Layout

```
calls/<provider>/<api|mcp>/<id>.md   one call per file (YAML front matter + notes)
schema/call.schema.json              the file format
dist/calls.json                      generated index (npm run build)
scripts/                             validate, build, verify gate, smoke runner
routine/                             update routine design and doc sources
```

Providers so far: google-workspace, slack, github, figma, atlassian.

## A call file

```yaml
id: slack.api.conversations.history     # <provider>.<surface>.<operation>, matches the file name
provider: slack
surface: api                            # api has endpoint:, mcp has tool:
endpoint: { method: GET, url: https://slack.com/api/conversations.history }
auth: { methods: [bot-token], scopes: [channels:history], scopes_mode: any }
config: { generic: "curl ...", platforms: { claude-code: "..." } }
errors:
  - { code: not_in_channel, meaning: "...", fix: "...", fix_status: unverified }
source: { url: https://docs.slack.dev/..., read_on: 2026-11-07, kind: docs-page }
status: unverified                      # verified needs verified_by: matt + verified_on
smoke: { kind: read, env: [SLACK_TOKEN], request: {...}, expect: {...} }
test: { status: untested }              # written by the smoke runner
```

The full format is `schema/call.schema.json`.

## Checks

```
npm ci
npm run validate      # schema, file placement, verifier rules, no secrets
npm test
npm run build         # regenerate dist/calls.json (CI fails if it's stale)
```

CI also blocks any PR that flips a status or fix to verified unless Matt opened it. CODEOWNERS plus branch protection on main ("require review from code owners") is the real gate. Turn that on in repo settings.

## Smoke tests

Each call can carry a `smoke` block. The runner uses your own credentials from env vars.

- `read` tests run by default.
- `write` tests run only with `--include-writes` and `SMOKE_SANDBOX=1`. Point them at test channels, repos and files.
- `manual` tests never run. These are mostly MCP servers that need an interactive sign-in.
- Missing env vars mean skipped, not failing.
- For MCP, a read test checks the server's `tools/list` includes the tool. It doesn't call the tool.

```
cp .env.example .env               # fill in your own tokens, test IDs
set -a; . ./.env; set +a
npm run smoke                      # writes results/smoke-<date>.json
npm run smoke -- --update          # also writes test: {...} into each file, then open a PR
npm run smoke -- --only slack.
```

Run it on your own machine, or have your personal agent run it. Never in CI and never against someone else's account. `test` is separate from `status`: a passing test doesn't make a call verified.

## Contributing

Add or fix a call through a PR. Cite the official doc you read and the date. Don't guess endpoints or scopes. Leave a field out rather than invent it.

## License

MIT. See LICENSE.
