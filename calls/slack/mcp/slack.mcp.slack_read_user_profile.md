---
id: slack.mcp.slack_read_user_profile
provider: slack
surface: mcp
operation: slack_read_user_profile
summary: "Read a user's profile, or your own when no user is given."
tags: [users, read]
tool:
  name: slack_read_user_profile
  server: slack
  server_url: https://mcp.slack.com/mcp
  transport: streamable-http
  read_only: true
params:
  optional: [user_id]
  notes: "Tool name from Slack's official slack-skills-plugin repo. Called with no user_id it returns the signed-in user's profile, including their user ID and display name."
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
