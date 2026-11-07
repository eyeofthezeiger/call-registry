---
id: atlassian.api.jira.search.jql
provider: atlassian
product: jira
surface: api
operation: jira.search.jql
summary: Search Jira issues with JQL (enhanced search, REST v3).
tags: [jira, search, read]
endpoint:
  method: GET
  url: https://your-domain.atlassian.net/rest/api/3/search/jql
params:
  required: [jql]
  optional: [fields, expand, maxResults]
  notes: Method and params are the ones Atlassian's own Jira client (@atlassian-pi/jira-pi-client 3.0.4, used by Atlassian's VS Code extension) sends; fields is a comma-separated list. That client notes the old v2 search endpoint is deprecated (changelog CHANGE-2046). How paging works here isn't confirmed from a page; check the reference before relying on it.
auth:
  methods: [api-token, oauth2]
  header: "Authorization: Basic <base64(email:api_token)>"
  notes: Basic auth is email:api_token, base64 encoded. OAuth scopes aren't confirmed, so none are listed.
config:
  generic: |
    curl -s -u "$ATLASSIAN_EMAIL:$ATLASSIAN_API_TOKEN" -H "Accept: application/json" -G \
      --data-urlencode 'jql=project = PROJ ORDER BY created DESC' \
      --data-urlencode 'fields=summary,status,assignee' --data-urlencode 'maxResults=10' \
      https://your-domain.atlassian.net/rest/api/3/search/jql
errors:
  - code: "400"
    meaning: Since Oct 8, 2026 the endpoint validates JQL again; queries with invalid custom JQL functions return 400 Bad Request, per the Jira changelog.
    fix: Validate the JQL first with /rest/api/3/jql/parse, or fix the custom function call.
    fix_status: unverified
  - code: "429"
    meaning: Rate limit exceeded. RateLimit-Reason says which limit; Retry-After gives the seconds to wait.
    fix: Wait at least Retry-After seconds, then back off with jitter.
    fix_status: unverified
source:
  url: https://www.npmjs.com/package/@atlassian-pi/jira-pi-client
  also:
    - https://github.com/atlassian/atlascode
    - https://developer.atlassian.com/cloud/jira/platform/changelog/
    - https://developer.atlassian.com/cloud/jira/platform/rate-limiting/
  read_on: 2026-11-07
  kind: sdk
  spec_revision: "3.0.4"
  reference_url: https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/
status: unverified
last_checked: 2026-11-07
smoke:
  kind: read
  env: [ATLASSIAN_SITE, ATLASSIAN_BASIC_AUTH, JIRA_TEST_ISSUE]
  request:
    method: GET
    url: https://${ATLASSIAN_SITE}/rest/api/3/search/jql?jql=key%3D${JIRA_TEST_ISSUE}&fields=summary&maxResults=1
    headers:
      Authorization: Basic ${ATLASSIAN_BASIC_AUTH}
      Accept: application/json
  expect:
    status: 200
test:
  status: untested
---
