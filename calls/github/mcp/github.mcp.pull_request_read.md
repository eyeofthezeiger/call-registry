---
id: github.mcp.pull_request_read
provider: github
surface: mcp
operation: pull_request_read
summary: "Read a PR: details, diff, files, commits, reviews, comments, status or check runs."
tags: [pull-requests, read]
tool:
  name: pull_request_read
  server: github
  server_url: https://api.githubcopilot.com/mcp/
  transport: http
  toolset: pull_requests
  read_only: true
params:
  required: [method, owner, repo, pullNumber]
  optional: [page, perPage, after]
  notes: method is one of get, get_diff, get_status, get_files, get_commits, get_review_comments, get_reviews, get_comments, get_check_runs.
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

source:
  url: https://raw.githubusercontent.com/github/github-mcp-server/main/README.md
  also:
    - https://raw.githubusercontent.com/github/github-mcp-server/main/docs/remote-server.md
    - https://raw.githubusercontent.com/github/github-mcp-server/main/docs/installation-guides/install-claude.md
  read_on: 2026-11-07
  kind: readme
status: unverified
last_checked: 2026-11-07
smoke:
  kind: read
  env: [GITHUB_PAT]
  mcp_tools_list: true
  notes: Checks the server lists this tool. Does not call it.
test:
  status: untested
---
