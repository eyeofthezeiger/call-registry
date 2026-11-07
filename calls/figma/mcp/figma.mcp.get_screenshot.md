---
id: figma.mcp.get_screenshot
provider: figma
surface: mcp
operation: get_screenshot
summary: Take a screenshot of a selection.
tags: [design, read]
tool:
  name: get_screenshot
  server: figma
  server_url: https://mcp.figma.com/mcp
  transport: http
  read_only: true
params:
  required:
    - fileKey
    - nodeId
  notes: Argument names come from the call examples in Figma's official mcp-server-guide repo (read Nov 7, 2026), not from a published schema. Every example passes fileKey and nodeId, so they're listed as required; the schema may differ. Confirm against tools/list. From a figma.com/design/:fileKey/:fileName?node-id=:nodeId URL, take fileKey and nodeId; on a branch URL use the branchKey as fileKey. Figma's examples pass nodeId both as 1-2 and 1:2, and its SwiftUI skill says to replace - with :.
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
    - https://github.com/figma/mcp-server-guide
  read_on: 2026-11-07
  kind: docs-page
status: unverified
last_checked: 2026-11-07
notes: Available on remote and desktop servers.
rate_limit:
  tier: Figma MCP
  notes: Read tools are rate limited. Starter plan users, and View or Collab seats on paid plans, get up to 6 tool calls per month. Dev or Full seats on Professional, Organization or Enterprise get per-minute limits that match Tier 1 of the REST API.
  source_url: https://github.com/figma/mcp-server-guide
errors:
  - code: invalid nodeId
    meaning: An empty nodeId returns an invalid nodeId error, per Figma's FigJam skill.
    fix: Pass a real node id from the URL or from get_metadata.
    fix_status: unverified
smoke:
  kind: manual
  notes: Remote server needs an interactive Figma sign-in from a catalog client, so the runner can't reach it with an env token. Check by hand in Claude Code with /mcp.
test:
  status: untested
---
The desktop server (http://127.0.0.1:3845/mcp, server name figma-desktop) needs the Figma desktop app and a Dev or Full seat on a paid plan. Add it with: claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
