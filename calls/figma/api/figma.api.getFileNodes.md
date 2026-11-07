---
id: figma.api.getFileNodes
provider: figma
surface: api
operation: getFileNodes
summary: Get JSON for specific nodes in a file.
tags: [files, read]
endpoint:
  method: GET
  url: https://api.figma.com/v1/files/{file_key}/nodes
params:
  required: [file_key, ids]
  optional: [depth, version, geometry, plugin_data]
  notes: ids is a comma-separated list of node IDs.
auth:
  methods: [personal-access-token, plan-access-token, oauth2]
  header: "X-Figma-Token: <FIGMA_TOKEN>"
  scopes: [file_content:read, files:read]
  scopes_mode: any
  least_privilege_scope: file_content:read
  notes: files:read is deprecated; use file_content:read.
config:
  generic: |
    curl -s -H "X-Figma-Token: $FIGMA_TOKEN" "https://api.figma.com/v1/files/$FILE_KEY/nodes?ids=1:2"
errors:
  - code: "429"
    meaning: Rate limited (leaky bucket).
    fix: Wait the Retry-After seconds, then retry with backoff.
    fix_status: unverified
  - code: "403"
    meaning: Forbidden. Token lacks the scope or access to the file.
    fix_status: none
source:
  url: https://raw.githubusercontent.com/figma/rest-api-spec/main/openapi/openapi.yaml
  also:
    - https://developers.figma.com/docs/rest-api/scopes/
    - https://developers.figma.com/docs/rest-api/rate-limits/
  read_on: 2026-11-07
  kind: openapi
  spec_revision: "0.47.0"
status: unverified
last_checked: 2026-11-07
---
The rate-limit tier for this endpoint isn't named on the rate limits page summary we read, so it's left blank.
