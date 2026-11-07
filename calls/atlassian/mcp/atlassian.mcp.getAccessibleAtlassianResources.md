---
id: atlassian.mcp.getAccessibleAtlassianResources
provider: atlassian
product: platform
surface: mcp
operation: getAccessibleAtlassianResources
summary: List the Atlassian sites you can reach and their cloudId. Required first call.
tags: [platform, read]
tool:
  name: getAccessibleAtlassianResources
  server: atlassian
  server_url: https://mcp.atlassian.com/v2/mcp
  transport: http
  read_only: true
params:
  notes: Atlassian's examples call it with no arguments. It returns the cloudIds the signed-in user can reach. You can skip it by passing the site URL as cloudId to the other tools, per the server README.
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
