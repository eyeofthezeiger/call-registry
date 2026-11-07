---
id: atlassian.api.confluence.page.get
provider: atlassian
product: confluence
surface: api
operation: confluence.page.get
summary: Get one Confluence page by id, with its body (REST v2).
tags: [confluence, read]
endpoint:
  method: GET
  url: https://your-domain.atlassian.net/wiki/api/v2/pages/{id}
params:
  required: [id]
  optional: [body-format]
  notes: Atlassian's Forge docs call it with body-format=atlas_doc_format and body-format=storage. Other values and params aren't confirmed (the v2 reference page is JS-rendered). The v2 spec's server is https://{your-domain}/wiki/api/v2.
auth:
  methods: [api-token, oauth2]
  header: "Authorization: Basic <base64(email:api_token)>"
  scopes: [read:page:confluence]
  notes: Basic auth is email:api_token, base64 encoded; Atlassian recommends it for scripts and manual calls. read:page:confluence is the scope Atlassian's Forge sample declares for this call.
config:
  generic: |
    curl -s -u "$ATLASSIAN_EMAIL:$ATLASSIAN_API_TOKEN" -H "Accept: application/json" \
      "https://your-domain.atlassian.net/wiki/api/v2/pages/12345?body-format=storage"
errors:
  - code: "429"
    meaning: Rate limit exceeded. Retry-After gives the seconds to wait; some 503s carry it too.
    fix: Wait at least Retry-After seconds, then back off with jitter. Retry only idempotent calls.
    fix_status: unverified
source:
  url: https://developer.atlassian.com/platform/forge/macros-in-the-page/
  also:
    - https://developer.atlassian.com/platform/forge/apis-reference/fetch-api-product.requestconfluence/
    - https://developer.atlassian.com/cloud/confluence/openapi-v2.v3.json
    - https://developer.atlassian.com/cloud/confluence/basic-auth-for-rest-apis/
    - https://developer.atlassian.com/cloud/confluence/rate-limiting/
  read_on: 2026-11-07
  kind: docs-page
  reference_url: https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-page/
status: unverified
last_checked: 2026-11-07
smoke:
  kind: read
  env: [ATLASSIAN_SITE, ATLASSIAN_BASIC_AUTH, CONFLUENCE_TEST_PAGE_ID]
  request:
    method: GET
    url: https://${ATLASSIAN_SITE}/wiki/api/v2/pages/${CONFLUENCE_TEST_PAGE_ID}?body-format=storage
    headers:
      Authorization: Basic ${ATLASSIAN_BASIC_AUTH}
      Accept: application/json
  expect:
    status: 200
test:
  status: untested
---
