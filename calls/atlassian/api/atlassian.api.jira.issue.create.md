---
id: atlassian.api.jira.issue.create
provider: atlassian
product: jira
surface: api
operation: jira.issue.create
summary: Create a Jira issue (REST v3).
tags: [jira, write]
endpoint:
  method: POST
  url: https://your-domain.atlassian.net/rest/api/3/issue
params:
  notes: Method and path come from the Jira rate limiting page, which prices this call. The request body wasn't readable (reference page JS-rendered, OpenAPI cut off), so its fields are left out rather than guessed. Fill from the reference page or the createmeta endpoint.
auth:
  methods: [api-token, oauth2]
  header: "Authorization: Basic <base64(email:api_token)>"
  notes: Basic auth needs an API token; passwords are deprecated. Build email:api_token, base64 it, send it as Basic. OAuth 2.0 scopes aren't confirmed, so none are listed.
config:
  generic: |
    # Body shape unconfirmed; see notes.
    curl -s -u "$ATLASSIAN_EMAIL:$ATLASSIAN_API_TOKEN" -X POST \
      -H "Accept: application/json" -H "Content-Type: application/json" \
      https://your-domain.atlassian.net/rest/api/3/issue -d @issue.json
rate_limit:
  tier: points
  notes: Costs 1 point against the hourly quota. Writes to one issue are also capped at 20 per 2 seconds and 100 per 30 seconds. Default POST burst limit is 100 requests per second.
  source_url: https://developer.atlassian.com/cloud/jira/platform/rate-limiting/
errors:
  - code: "429"
    meaning: A rate limit was exceeded. RateLimit-Reason says which; Retry-After gives the seconds to wait.
    fix: Atlassian says to retry only idempotent calls. Creating an issue isn't idempotent, so check whether it was created before retrying.
    fix_status: unverified
  - code: AUTHENTICATION_DENIED
    meaning: Sent in the X-Seraph-LoginReason header when CAPTCHA was triggered for the account. Basic auth won't work until it's cleared.
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
smoke:
  kind: write
  notes: No request defined until the body is confirmed. Point it at a test project.
test:
  status: untested
---
