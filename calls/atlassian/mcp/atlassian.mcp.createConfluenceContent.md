---
id: atlassian.mcp.createConfluenceContent
provider: atlassian
product: confluence
surface: mcp
operation: createConfluenceContent
summary: Create a Confluence page (or other content) in a space.
tags: [confluence, write]
tool:
  name: createConfluenceContent
  server: atlassian
  server_url: https://mcp.atlassian.com/v2/mcp
  transport: http
  read_only: false
params:
  required: [cloudId, parent, contentType, title, body]
  notes: "Argument names come from the call examples in Atlassian's own skills (atlassian-mcp-server repo, read Nov 7, 2026), not from a published schema. Confirm against tools/list. cloudId can be the site URL. Atlassian's skills call it directly; if it isn't in your tool list, reach it through discover and execute. Before writing the body, Atlassian's skills load the non-primary getContentFormatGuide and the space's instructions (getConfluenceSpace). parent is an object with spaceId (numeric) and, to nest the page, parentContentId. contentType is page in the examples. body is {format, value}; examples use format markdown. Replaces the old createConfluencePage tool."
auth:
  methods:
    - oauth2
    - api-token
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
  url: https://github.com/atlassian/atlassian-mcp-server/tree/main/skills
  also:
    - https://github.com/atlassian/atlassian-mcp-server
  read_on: 2026-11-07
  kind: readme
status: unverified
last_checked: 2026-11-07
notes: Needs the write_confluence permission group, granted by the org admin.
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
  kind: write
  notes: Writes a real page. Test space only.
test:
  status: untested
---
