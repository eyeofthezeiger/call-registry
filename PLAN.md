# Plan

Nov 7, 2026. Owner: Matt. Status: scaffold built, seed calls unverified.

## Goal

- One place that lists single API and MCP calls that work, with config that pastes straight into any AI setup.
- Generic first. Platform sections only where a client needs its own config.
- Nothing counts as verified until Matt says so.

## Repo layout

- `calls/<provider>/<api|mcp>/<id>.md`: one call per file.
- `schema/call.schema.json`: the format. `scripts/validate.mjs` enforces it.
- `dist/calls.json`: built index that setups consume. CI fails if it's stale.
- `routine/`: update routine design and the list of doc sources.

## Per-call fields

- Identity: id, provider, product, surface, operation, summary, tags.
- Where: endpoint (method, url) for API; tool (name, server, url, transport, toolset, read-only) for MCP.
- Inputs: required and optional params, with notes.
- Auth: methods, header, scopes, any-or-all, least-privilege scope.
- Config: generic snippet plus platform snippets.
- Examples, rate limit.
- Errors: code, meaning, fix, fix status (unverified, verified, none), who verified and when, open question.
- Source: doc URL, date read, kind (openapi, discovery, docs page, readme), spec revision.
- Trust: status (unverified by default), verified_by: matt and verified_on, last_checked.
- Smoke and test: how to check it, and the last result.

## Gates

- Schema check, file placement, duplicate ids, secret patterns, every smoke placeholder declared.
- `verified` only with `verified_by: matt` and a date. Same for fixes.
- On PRs, a check fails if anyone but eyeofthezeiger flips something to verified.
- CODEOWNERS plus branch protection is the real gate. Matt turns on "require review from code owners".

## Seeded (all unverified)

- Google Workspace, 9 API calls: Gmail list, get, draft; Calendar list, insert; Drive list; Docs get; Sheets get, append. From Google's discovery docs.
- Slack, 5 API calls: chat.postMessage, chat.update, conversations.history, conversations.replies, users.lookupByEmail. From docs.slack.dev.
- Slack, 8 MCP tools (search public, search public and private, search channels, read channel, read thread, read user profile, send message, schedule message). Names and some arguments from Slack's official slack-skills-plugin repo.
- GitHub, 5 API calls (pulls create, get; issues create, comment; repo contents) from the official OpenAPI spec, and 4 MCP tools (create_pull_request, pull_request_read, get_file_contents, issue_write) from the github-mcp-server README.
- Figma, 6 API calls (me, file, nodes, images, comments get and post) from Figma's OpenAPI spec, and 4 MCP tools (get_design_context, get_metadata, get_screenshot, get_variable_defs) from the MCP docs.
- Atlassian, 7 Rovo MCP tools (resources, JQL search, get and create issue, comment, Confluence search and get). From Atlassian's supported tools page, with argument names from the call examples in Atlassian's own atlassian-mcp-server skills.
- Atlassian, 2 Jira REST v3 calls (get issue, create issue). Method, path, auth and limits from the Jira rate limiting and basic auth pages. Params and scopes left out.

## Gaps

- Atlassian REST: reference pages are JS-rendered and the OpenAPI files come back cut off, here and through the fetch tool. Jira search/jql (method not stated), add comment and every Confluence v2 page call are still left out. Confirmed so far: Confluence v2 base https://{your-domain}/wiki/api/v2, Basic auth with email:api_token, 429 with Retry-After. Fill from a normal browser.
- Slack MCP: most argument names (query, channel, thread, text) aren't stated. Fill from tools/list.
- Atlassian MCP: argument names come from examples, not a schema. Which are required, and the edit-comment argument, still need tools/list.
- Figma MCP: argument names aren't on the docs pages. Fill from tools/list.
- GitHub REST: token permissions aren't in the spec.

## Known issue to fill

- GitHub create_pull_request in Matt's org: an artifact tries to open, breaks, and needs a config setting. Placeholder error entry, unverified, with open questions. Possible link to the MCP App UI the README lists for that tool. Not confirmed.

## Smoke tests

- One test per call, using Matt's own credentials from env vars. Missing vars skip.
- Read tests run by default. Write tests need `--include-writes` and `SMOKE_SANDBOX=1`. Manual tests never run.
- MCP read tests check tools/list includes the tool.
- Results go to `results/` (gitignored). `--update` writes `test:` into each file for a PR.
- `test` stays separate from `status`. Only Matt verifies.
- Runs on Matt's machine, ideally by his personal chief-of-staff agent. Not in CI. Not against anyone else's account.

## Update routine

See `routine/README.md`. Short version: scheduled scrape of public docs, diff, open a PR with changes marked unverified, triage logged errors, Matt reviews.

## Providers to add next

- Linear: only if the team tracks work there instead of Jira.
- Notion: only if docs live there instead of Confluence.
- Postgres: the fullstack starter uses it. Covers the DB MCP servers agents use most.
- Docker: Matt runs his local Claude in Docker. Engine API and the Docker MCP toolkit.
- AWS: the agent pilot is planned on a new team AWS account (Bedrock, S3, Secrets Manager, Lambda).
- Anthropic API: the agents call it directly or through Bedrock.

## Company version (later starter)

- Non-technical users don't manage this repo. They get skills instead.
- A setup skill installs the registry-backed MCP config for their tools.
- A "ready to push" skill packages their work and opens a PR to the company repo for an engineer to review.
- Same gates: nothing verified without a named owner's review.
- Build it as its own starter once this registry has real verified calls.
