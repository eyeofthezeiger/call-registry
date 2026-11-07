---
id: figma.api.getImages
provider: figma
surface: api
operation: getImages
summary: Render nodes as images and get download URLs.
tags: [files, images, read]
endpoint:
  method: GET
  url: https://api.figma.com/v1/images/{file_key}
params:
  required: [file_key, ids]
  optional: [scale, format, version, svg_outline_text, svg_include_id, svg_include_node_id, svg_simplify_stroke, contents_only, use_absolute_bounds]
auth:
  methods: [personal-access-token, plan-access-token, oauth2]
  header: "X-Figma-Token: <FIGMA_TOKEN>"
  scopes: [file_content:read, files:read]
  scopes_mode: any
  least_privilege_scope: file_content:read
  notes: files:read is deprecated; use file_content:read.
config:
  generic: |
    curl -s -H "X-Figma-Token: $FIGMA_TOKEN" "https://api.figma.com/v1/images/$FILE_KEY?ids=1:2&format=png&scale=2"
rate_limit:
  tier: Tier 1
  notes: Per-minute limits depend on seat (View/Collab vs Dev/Full) and plan. On 429, wait Retry-After seconds. Headers X-Figma-Plan-Tier and X-Figma-Rate-Limit-Type say which limit you hit.
  source_url: https://developers.figma.com/docs/rest-api/rate-limits/
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
smoke:
  kind: read
  env: [FIGMA_TOKEN, FIGMA_TEST_FILE_KEY, FIGMA_TEST_NODE_ID]
  request:
    method: GET
    url: https://api.figma.com/v1/images/${FIGMA_TEST_FILE_KEY}?ids=${FIGMA_TEST_NODE_ID}&format=png
    headers:
      X-Figma-Token: ${FIGMA_TOKEN}
  expect:
    status: 200
  notes: Tier 1, same caution as getFile.
test:
  status: untested
---
