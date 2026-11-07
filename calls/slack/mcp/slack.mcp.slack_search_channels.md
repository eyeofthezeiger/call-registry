---
id: slack.mcp.slack_search_channels
provider: slack
surface: mcp
operation: slack_search_channels
summary: "Find channels by name or description."
tags: [search, read]
tool:
  name: slack_search_channels
  server: slack
  server_url: https://mcp.slack.com/mcp
  transport: streamable-http
  read_only: true
params:
  notes: "Tool name from Slack's official slack-skills-plugin repo. Argument names aren't stated; read them from tools/list. Slack's commands use it to turn a channel name into a channel ID; strip a leading # first."
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
notes: "Slack's docs say the MCP connection works in Claude Code and Cursor; in Codex the plugin installs skills only."
smoke:
  kind: read
  env: [SLACK_MCP_TOKEN]
  mcp_tools_list: true
  notes: "Checks tools/list includes the tool, the way Slack's own eval tests do (Bearer token on a Streamable HTTP session). Needs a user OAuth token from a Slack MCP sign-in."
test:
  status: untested
---
