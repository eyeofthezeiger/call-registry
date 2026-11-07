---
id: slack.mcp.slack_search_public
provider: slack
surface: mcp
operation: slack_search_public
summary: "Search messages and files in public channels."
tags: [search, read]
tool:
  name: slack_search_public
  server: slack
  server_url: https://mcp.slack.com/mcp
  transport: streamable-http
  read_only: true
params:
  optional: [sort, sort_dir, content_types, only_my_channels, limit, cursor]
  notes: "Tool name from Slack's official slack-skills-plugin repo. The name of the query argument isn't stated; read it from tools/list. The query takes natural language or keywords with modifiers like in:, from:, before:, after:. sort is score (default) or timestamp, sort_dir asc or desc, content_types messages (default) or files, limit is capped at 20. Doesn't need user consent."
auth:
  methods: [oauth2]
  notes: "OAuth sign-in to your workspace on first use, as you. A workspace admin must approve MCP integration first. Slack's server doesn't support dynamic client registration, so the client needs a Slack-registered OAuth client ID; Slack's official plugins for Claude Code and Cursor carry one."
config:
  generic: |
    { "mcpServers": { "slack": { "type": "http", "url": "https://mcp.slack.com/mcp" } } }
    # Plus the OAuth client ID your client is registered with Slack under. See auth notes.
  platforms:
    claude-code: |
      /plugin marketplace add slackapi/slack-skills-plugin
      /plugin install slack@slack
    cursor: |
      /add-plugin slack
errors:
  - code: admin-approval-required
    meaning: "Sign-in can't finish until a workspace admin approves MCP integration, per Slack's plugin README."
    fix: Ask a workspace admin to approve the Slack MCP integration, then sign in again.
    fix_status: unverified
source:
  url: https://github.com/slackapi/slack-skills-plugin
  also:
    - https://docs.slack.dev/ai/slack-mcp-server
  read_on: 2026-11-07
  kind: readme
status: unverified
last_checked: 2026-11-07
notes: "Search isn't real time; messages from the last few seconds may not show up. Use slack_read_channel for the newest messages. Slack's docs say the MCP connection works in Claude Code and Cursor; in Codex the plugin installs skills only."
smoke:
  kind: read
  env: [SLACK_MCP_TOKEN]
  mcp_tools_list: true
  notes: "Checks tools/list includes the tool, the way Slack's own eval tests do (Bearer token on a Streamable HTTP session). Needs a user OAuth token from a Slack MCP sign-in."
test:
  status: untested
---
