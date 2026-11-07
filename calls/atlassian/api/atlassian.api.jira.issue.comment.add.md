---
id: atlassian.api.jira.issue.comment.add
provider: atlassian
product: jira
surface: api
operation: jira.issue.comment.add
summary: Add a comment to a Jira issue (REST v3).
tags: [jira, write]
endpoint:
  method: POST
  url: https://your-domain.atlassian.net/rest/api/3/issue/{issueIdOrKey}/comment
params:
  required: [issueIdOrKey, body]
  optional: [expand]
  notes: "Method, path and the JSON body {\"body\": ...} are what Atlassian's own Jira client (@atlassian-pi/jira-pi-client 3.0.4) sends; it adds ?expand=renderedBody. The format the v3 body field needs (plain text or Atlassian Document Format) isn't confirmed from a page. Editing is PUT .../comment/{commentId} in the same client."
auth:
  methods: [api-token, oauth2]
  header: "Authorization: Basic <base64(email:api_token)>"
  notes: Basic auth is email:api_token, base64 encoded. OAuth scopes aren't confirmed, so none are listed.
config:
  generic: |
    # Body format unconfirmed; see notes.
    curl -s -u "$ATLASSIAN_EMAIL:$ATLASSIAN_API_TOKEN" -X POST \
      -H "Accept: application/json" -H "Content-Type: application/json" \
      "https://your-domain.atlassian.net/rest/api/3/issue/PROJ-1/comment?expand=renderedBody" -d @comment.json
rate_limit:
  tier: points
  notes: Writes to one issue are capped at 20 per 2 seconds and 100 per 30 seconds.
  source_url: https://developer.atlassian.com/cloud/jira/platform/rate-limiting/
errors:
  - code: "429"
    meaning: Rate limit exceeded. Retry-After gives the seconds to wait.
    fix: Adding a comment isn't idempotent; check whether it posted before retrying.
    fix_status: unverified
source:
  url: https://www.npmjs.com/package/@atlassian-pi/jira-pi-client
  also:
    - https://github.com/atlassian/atlascode
    - https://developer.atlassian.com/cloud/jira/platform/rate-limiting/
  read_on: 2026-11-07
  kind: sdk
  spec_revision: "3.0.4"
  reference_url: https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/
status: unverified
last_checked: 2026-11-07
smoke:
  kind: write
  notes: No request defined until the body format is confirmed. Test project only.
test:
  status: untested
---
