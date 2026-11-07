---
id: atlassian.api.confluence.content.search-cql
provider: atlassian
product: confluence
surface: api
operation: confluence.content.search-cql
summary: Search Confluence content with CQL (REST v1, searchContentByCQL).
tags: [confluence, search, read]
endpoint:
  method: GET
  url: https://your-domain.atlassian.net/wiki/rest/api/content/search
params:
  required: [cql]
  optional: [cqlcontext, expand, cursor, limit]
  notes: limit defaults to 25. Page with cursor, taken from the next or prev URL of the previous response. cqlcontext sets the space, content and status to search against. Not marked deprecated in the spec.
auth:
  methods: [api-token, oauth2]
  header: "Authorization: Basic <base64(email:api_token)>"
  scopes: [search:confluence, read:content-details:confluence]
  scopes_mode: any
  least_privilege_scope: search:confluence
  notes: search:confluence is the current classic scope; read:content-details:confluence is listed as the granular (Beta) one. Connect scope READ.
config:
  generic: |
    curl -s -u "$ATLASSIAN_EMAIL:$ATLASSIAN_API_TOKEN" -H "Accept: application/json" -G \
      --data-urlencode 'cql=type=page AND title ~ "roadmap"' --data-urlencode 'limit=10' \
      https://your-domain.atlassian.net/wiki/rest/api/content/search
errors:
  - code: "400"
    meaning: The CQL is invalid or missing.
    fix: Check the CQL syntax and quote values with spaces.
    fix_status: unverified
  - code: "401"
    meaning: Credentials are wrong or missing.
    fix: Send Basic base64(email:api_token) with a current API token.
    fix_status: unverified
  - code: "429"
    meaning: Rate limit exceeded. Retry-After gives the seconds to wait.
    fix: Wait at least Retry-After seconds, then back off with jitter.
    fix_status: unverified
source:
  url: https://developer.atlassian.com/cloud/confluence/swagger.v3.json
  also:
    - https://www.atlassian.com/blog/development/generating-a-java-rest-client-for-confluence-cloud
    - https://developer.atlassian.com/platform/forge/apis-reference/fetch-api-product.requestconfluence/
    - https://developer.atlassian.com/cloud/confluence/rate-limiting/
  read_on: 2026-11-07
  kind: openapi
  spec_revision: "1.0.0"
  reference_url: https://developer.atlassian.com/cloud/confluence/rest/v1/api-group-search/
status: unverified
last_checked: 2026-11-07
smoke:
  kind: read
  env: [ATLASSIAN_SITE, ATLASSIAN_BASIC_AUTH]
  request:
    method: GET
    url: https://${ATLASSIAN_SITE}/wiki/rest/api/content/search?cql=type%3Dpage&limit=1
    headers:
      Authorization: Basic ${ATLASSIAN_BASIC_AUTH}
      Accept: application/json
  expect:
    status: 200
test:
  status: untested
---
