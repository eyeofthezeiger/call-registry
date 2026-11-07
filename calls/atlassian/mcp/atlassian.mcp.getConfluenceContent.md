---
id: atlassian.mcp.getConfluenceContent
provider: atlassian
product: confluence
surface: mcp
operation: getConfluenceContent
summary: Get Confluence content.
tags: [confluence, read]
tool:
  name: getConfluenceContent
  server: atlassian
  server_url: https://mcp.atlassian.com/v2/mcp
  transport: http
  read_only: true
params:
  required:
    - cloudId
    - content_id
  optional:
    - content_format
    - detail
    - include_metadata
  notes: Argument names come from the call examples in Atlassian's own skills (atlassian-mcp-server repo, read Nov 7, 2026), not from a published schema. Which ones are required isn't stated; the required list holds the ones the call can't work without. Confirm against tools/list. cloudId can be the site URL (https://yoursite.atlassian.net) instead of an id from getAccessibleAtlassianResources, per the server README. content_id is the numeric page id from the page URL. Examples use content_format="markdown" and detail="full"; other values aren't listed.
auth:
  methods:
    - oauth2
    - api-token
  scopes: [read:confluence:agent-interface]
  notes: "OAuth 2.1 sign-in by default. Headless setups can use an API token once an org admin enables it (Atlassian Administration > Rovo > Rovo MCP server > Authentication): personal token as Authorization: Basic <base64(email:api_token)>, or a service account key as Authorization: Bearer <api_key>. Admins grant tools per permission group."
config:
  generic: |
    { "mcpServers": { "atlassian": { "url": "https://mcp.atlassian.com/v2/mcp" } } }
  platforms:
    claude-code: |
      claude mcp add --transport http atlassian https://mcp.atlassian.com/v2/mcp
      # then run /mcp in Claude Code to sign in
    claude-desktop: |
      { "mcpServers": { "atlassian": { "url": "https://mcp.atlassian.com/v2/mcp" } } }
    codex: |
      codex mcp add atlassian --url https://mcp.atlassian.com/v2/mcp
    windsurf: |
      { "mcpServers": { "atlassian": { "serverUrl": "https://mcp.atlassian.com/v2/mcp/" } } }
source:
  url: https://support.atlassian.com/atlassian-rovo-mcp-server/docs/supported-tools/
  also:
    - https://support.atlassian.com/atlassian-rovo-mcp-server/docs/getting-started-with-the-atlassian-remote-mcp-server/
    - https://github.com/atlassian/atlassian-mcp-server
    - https://github.com/atlassian/atlassian-mcp-server/tree/main/skills
  read_on: 2026-11-07
  kind: docs-page
status: unverified
last_checked: 2026-11-07
notes: The page says v1 traffic (https://mcp.atlassian.com/v1/mcp) moves to v2 on March 1, 2027. Use v2.
errors:
  - code: unknown-argument-ignored
    meaning: Per Atlassian's skills, the server drops argument names it doesn't recognize instead of returning an error. The call succeeds and the value is silently ignored.
    fix: Use the exact argument names from the live tools/list schema.
    fix_status: unverified
  - code: "403"
    meaning: "Per the server README, sign-in can succeed while tool calls return 403. Causes it lists: IP allowlisting on the site, missing scopes, app permissions or another access policy."
    fix: Find the denial reason first. Check the token or OAuth scopes and the site's IP allowlist before changing either.
    fix_status: unverified
smoke:
  kind: manual
  notes: Needs an interactive OAuth sign-in. Check by hand.
test:
  status: untested
---
