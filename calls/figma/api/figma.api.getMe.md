---
id: figma.api.getMe
provider: figma
surface: api
operation: getMe
summary: Get the user the token belongs to. Cheapest auth check.
tags: [users, read]
endpoint:
  method: GET
  url: https://api.figma.com/v1/me
auth:
  methods: [personal-access-token, oauth2]
  header: "X-Figma-Token: <FIGMA_TOKEN>"
  scopes: [current_user:read, files:read]
  scopes_mode: any
  least_privilege_scope: current_user:read
config:
  generic: |
    curl -s -H "X-Figma-Token: $FIGMA_TOKEN" https://api.figma.com/v1/me
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
  env: [FIGMA_TOKEN]
  request:
    method: GET
    url: https://api.figma.com/v1/me
    headers:
      X-Figma-Token: ${FIGMA_TOKEN}
  expect:
    status: 200
test:
  status: untested
---
