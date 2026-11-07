---
id: atlassian.mcp.addOrEditJiraIssueComment
provider: atlassian
product: jira
surface: mcp
operation: addOrEditJiraIssueComment
summary: Add a comment to a Jira work item, or edit one.
tags: [jira, write]
tool:
  name: addOrEditJiraIssueComment
  server: atlassian
  server_url: https://mcp.atlassian.com/v2/mcp
  transport: http
  read_only: false
params:
  notes: Argument names aren't listed on the supported tools page. Every call needs a cloudId from getAccessibleAtlassianResources. Read the rest from tools/list.
auth:
  methods: [oauth2]
  scopes: [write:jira:agent-interface]
  notes: OAuth 2.1 sign-in. API-token auth is optional and set up by an admin. Admins grant tool groups per permission group.
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
  read_on: 2026-11-07
  kind: docs-page
status: unverified
last_checked: 2026-11-07
notes: The page says v1 traffic (https://mcp.atlassian.com/v1/mcp) moves to v2 on March 1, 2027. Use v2.
smoke:
  kind: write
  notes: Posts a real comment and notifies watchers. Test project only.
test:
  status: untested
---
