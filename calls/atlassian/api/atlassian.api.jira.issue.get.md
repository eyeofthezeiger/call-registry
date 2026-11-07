---
id: atlassian.api.jira.issue.get
provider: atlassian
product: jira
surface: api
operation: jira.issue.get
summary: Get one Jira issue by id or key (REST v3).
tags: [jira, read]
endpoint:
  method: GET
  url: https://your-domain.atlassian.net/rest/api/3/issue/{issueIdOrKey}
params:
  required: [issueIdOrKey]
  notes: Method and path come from the Jira rate limiting page, which prices this call. The reference page didn't render, so optional query params (fields, expand and so on) aren't confirmed and are left out.
auth:
  methods: [api-token, oauth2]
  header: "Authorization: Basic <base64(email:api_token)>"
  notes: Basic auth needs an API token; passwords are deprecated. Build email:api_token, base64 it, send it as Basic. Atlassian recommends basic auth for scripts and manual calls only. OAuth 2.0 scopes aren't confirmed (reference page didn't render), so none are listed.
config:
  generic: |
    curl -s -u "$ATLASSIAN_EMAIL:$ATLASSIAN_API_TOKEN" -H "Accept: application/json" \
      https://your-domain.atlassian.net/rest/api/3/issue/PROJ-1
rate_limit:
  tier: points
  notes: Costs 2 points against the hourly quota (65,000 points per hour, global pool, resets at the top of each UTC hour). Burst limit for this endpoint is 150 requests per second. The page says API token traffic stays on the existing burst limits.
  source_url: https://developer.atlassian.com/cloud/jira/platform/rate-limiting/
errors:
  - code: "429"
    meaning: A rate limit was exceeded. RateLimit-Reason says which (jira-quota-global-based, jira-quota-tenant-based, jira-burst-based, jira-per-issue-on-write). Retry-After gives the seconds to wait.
    fix: Wait at least Retry-After seconds, then back off exponentially with jitter. Atlassian says to retry only idempotent calls that came back with Retry-After.
    fix_status: unverified
  - code: AUTHENTICATION_DENIED
    meaning: Sent in the X-Seraph-LoginReason header when CAPTCHA was triggered for the account. Basic auth to the REST API won't work until it's cleared.
    fix: Sign in to Jira in a browser and complete the CAPTCHA, then retry.
    fix_status: unverified
source:
  url: https://developer.atlassian.com/cloud/jira/platform/rate-limiting/
  also:
    - https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/
  read_on: 2026-11-07
  kind: docs-page
  reference_url: https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/
status: unverified
last_checked: 2026-11-07
notes: The v3 reference pages are JS-rendered and the OpenAPI file came back without paths, so only the method, path, auth and limits here are from a page. Fill params and scopes from a normal browser.
smoke:
  kind: read
  env: [JIRA_SITE, JIRA_BASIC_AUTH, JIRA_TEST_ISSUE]
  request:
    method: GET
    url: https://${JIRA_SITE}/rest/api/3/issue/${JIRA_TEST_ISSUE}
    headers:
      Authorization: Basic ${JIRA_BASIC_AUTH}
      Accept: application/json
  expect:
    status: 200
test:
  status: untested
---
