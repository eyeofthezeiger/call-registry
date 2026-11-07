---
id: github.mcp.create_pull_request
provider: github
surface: mcp
operation: create_pull_request
summary: Open a new pull request.
tags: [pull-requests, write]
tool:
  name: create_pull_request
  server: github
  server_url: https://api.githubcopilot.com/mcp/
  transport: http
  toolset: pull_requests
  read_only: false
params:
  required: [owner, repo, title, head, base]
  optional: [body, draft, maintainer_can_modify, reviewers]
  notes: The README lists an MCP App UI for this tool, ui://github-mcp-server/pr-write.
auth:
  methods: [oauth2, personal-access-token]
  header: "Authorization: Bearer <GITHUB_PAT>"
  scopes: [repo]
  notes: The README lists repo as the OAuth challenge scope. OAuth works only in hosts that registered a GitHub or OAuth app; PAT works in any host with remote MCP support.
config:
  generic: |
    {
      "servers": {
        "github": {
          "type": "http",
          "url": "https://api.githubcopilot.com/mcp/",
          "headers": { "Authorization": "Bearer ${GITHUB_PAT}" }
        }
      }
    }
  platforms:
    claude-code: |
      claude mcp add --transport http github https://api.githubcopilot.com/mcp -H "Authorization: Bearer $GITHUB_PAT"
    vscode: |
      {
        "servers": {
          "github": {
            "type": "http",
            "url": "https://api.githubcopilot.com/mcp/",
            "headers": { "Authorization": "Bearer ${input:github_mcp_pat}" }
          }
        },
        "inputs": [
          { "type": "promptString", "id": "github_mcp_pat", "description": "GitHub Personal Access Token", "password": true }
        ]
      }
    docker: |
      claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_GITHUB_PAT -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
errors:
  - code: artifact-open-fails
    meaning: In Matt's work org, an artifact tries to open after the call, then breaks. A config setting fixes it.
    fix: Unknown. Placeholder until Matt gives the setting.
    fix_status: unverified
    seen_in: Matt's work org
    needs_info: Which client shows it (Claude Code, Claude Desktop, VS Code, claude.ai)? What is the config setting and where does it go? Is the artifact the MCP App UI (ui://github-mcp-server/pr-write) the README lists for this tool? That link is a guess, not confirmed.
source:
  url: https://raw.githubusercontent.com/github/github-mcp-server/main/README.md
  also:
    - https://raw.githubusercontent.com/github/github-mcp-server/main/docs/remote-server.md
    - https://raw.githubusercontent.com/github/github-mcp-server/main/docs/installation-guides/install-claude.md
  read_on: 2026-11-07
  kind: readme
status: unverified
last_checked: 2026-11-07
---
