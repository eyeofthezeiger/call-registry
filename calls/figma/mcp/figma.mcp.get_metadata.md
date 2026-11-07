---
id: figma.mcp.get_metadata
provider: figma
surface: mcp
operation: get_metadata
summary: Get a lightweight XML outline of a selection.
tags: [design, read]
tool:
  name: get_metadata
  server: figma
  server_url: https://mcp.figma.com/mcp
  transport: http
  read_only: true
params:
  notes: Argument names aren't listed on the tools page. Read them from the server's tools/list, then fill this in.
auth:
  methods: [oauth2]
  notes: Sign in with Figma on first connect and click Allow access. The MCP server runs its own OAuth; no REST scopes to set. Only clients in the Figma MCP catalog can connect to the remote server.
config:
  generic: |
    {
      "mcpServers": {
        "figma": { "url": "https://mcp.figma.com/mcp" }
      }
    }
  platforms:
    claude-code: |
      claude mcp add --transport http figma https://mcp.figma.com/mcp
    vscode: |
      {
        "inputs": [],
        "servers": {
          "figma": { "url": "https://mcp.figma.com/mcp", "type": "http" }
        }
      }
    cursor: |
      { "mcpServers": { "figma": { "url": "https://mcp.figma.com/mcp" } } }
    codex: |
      codex mcp add figma --url https://mcp.figma.com/mcp
source:
  url: https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/
  also:
    - https://developers.figma.com/docs/figma-mcp-server/
    - https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/
    - https://developers.figma.com/docs/figma-mcp-server/local-server-installation/
  read_on: 2026-11-07
  kind: docs-page
status: unverified
last_checked: 2026-11-07
notes: Available on remote and desktop servers.
smoke:
  kind: manual
  notes: Remote server needs an interactive Figma sign-in from a catalog client, so the runner can't reach it with an env token. Check by hand in Claude Code with /mcp.
test:
  status: untested
---
The desktop server (http://127.0.0.1:3845/mcp, server name figma-desktop) needs the Figma desktop app and a Dev or Full seat on a paid plan. Add it with: claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
