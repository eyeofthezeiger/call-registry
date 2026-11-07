---
id: slack.mcp.slack_schedule_message
provider: slack
surface: mcp
operation: slack_schedule_message
summary: "Schedule a message to post later."
tags: [messages, write]
tool:
  name: slack_schedule_message
  server: slack
  server_url: https://mcp.slack.com/mcp
  transport: streamable-http
  read_only: false
params:
  optional: [post_at]
  notes: "Tool name from Slack's official slack-skills-plugin repo. post_at is a Unix timestamp at least 2 minutes and at most 120 days ahead. Other argument names aren't stated; read them from tools/list. Body uses standard markdown like slack_send_message."
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
  kind: manual
  notes: Sends a real message. Check by hand in a test channel.
test:
  status: untested
---
