---
id: github.mcp.get_file_contents
provider: github
surface: mcp
operation: get_file_contents
summary: Get a file or directory listing from a repo.
tags: [repos, read]
tool:
  name: get_file_contents
  server: github
  server_url: https://api.githubcopilot.com/mcp/
  transport: http
  toolset: repos
  read_only: true
params:
  required: [owner, repo]
  optional: [path, ref, sha, fields]
  notes: ref accepts refs/heads/<branch>, refs/tags/<tag> or refs/pull/<n>/head. sha wins over ref when both are set.
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
---
