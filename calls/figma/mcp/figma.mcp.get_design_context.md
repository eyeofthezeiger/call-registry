---
id: figma.mcp.get_design_context
provider: figma
surface: mcp
operation: get_design_context
summary: Get design context and code for a layer or selection.
tags: [design, read]
tool:
  name: get_design_context
  server: figma
  server_url: https://mcp.figma.com/mcp
  transport: http
  read_only: true
params:
  required:
    - fileKey
    - nodeId
  optional:
    - clientLanguages
    - clientFrameworks
    - skillNames
  notes: Argument names come from the call examples in Figma's official mcp-server-guide repo (read Nov 7, 2026), not from a published schema. Every example passes fileKey and nodeId, so they're listed as required; the schema may differ. Confirm against tools/list. From a figma.com/design/:fileKey/:fileName?node-id=:nodeId URL, take fileKey and nodeId; on a branch URL use the branchKey as fileKey. Figma's examples pass nodeId both as 1-2 and 1:2, and its SwiftUI skill says to replace - with :. clientLanguages and clientFrameworks frame the code output (e.g. typescript, react; swift, swiftui); examples pass them as comma-separated strings or lists. skillNames is logging only.
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
  - code: nothing-selected
    meaning: Returns "You currently have nothing selected" (or an access or empty error) even with a nodeId. Per Figma's SwiftUI skill, the node-id points at a page or canvas, which codegen can't run on.
    fix: Call get_metadata on that node, find the top-level frame inside it, and retry get_design_context with the frame's id.
    fix_status: unverified
smoke:
  kind: manual
  notes: Remote server needs an interactive Figma sign-in from a catalog client, so the runner can't reach it with an env token. Check by hand in Claude Code with /mcp.
test:
  status: untested
---
The desktop server (http://127.0.0.1:3845/mcp, server name figma-desktop) needs the Figma desktop app and a Dev or Full seat on a paid plan. Add it with: claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
