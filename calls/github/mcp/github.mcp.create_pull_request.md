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
  notes: The README lists an MCP App UI for this tool, ui://github-mcp-server/pr-write. MCP Apps is on by default; the server sends the UI only to clients that advertise the io.modelcontextprotocol/ui capability.
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
    meaning: In Claude, after the GitHub MCP create_pull_request call, an artifact (the PR form) tries to open, then breaks. Seen on the MCP call, not the REST API.
    fix: "Matt's words: a \"show UI\" config setting. The exact name is unconfirmed. Closest documented setting: the server's mcp_apps_disable_form_deferral feature flag, which keeps MCP App result views but makes write tools run directly instead of first opening an interactive form. Remote server: add header X-MCP-Features: mcp_apps_disable_form_deferral (or ?features=mcp_apps_disable_form_deferral on the URL). Local server: pass it to --features."
    fix_status: unverified
    seen_in: Claude, Matt's work org, GitHub MCP server
    needs_info: Is the setting Matt uses on the Claude side (a show-UI toggle) or this server flag? Confirm the exact name, then mark verified.
source:
  url: https://raw.githubusercontent.com/github/github-mcp-server/main/README.md
  also:
    - https://raw.githubusercontent.com/github/github-mcp-server/main/docs/remote-server.md
    - https://raw.githubusercontent.com/github/github-mcp-server/main/docs/installation-guides/install-claude.md
    - https://raw.githubusercontent.com/github/github-mcp-server/main/docs/server-configuration.md
  read_on: 2026-11-07
  kind: readme
status: unverified
last_checked: 2026-11-07
smoke:
  kind: write
  notes: Opens a real PR. Sandbox repo only.
test:
  status: untested
---
