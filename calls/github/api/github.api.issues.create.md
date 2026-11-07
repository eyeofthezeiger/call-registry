---
id: github.api.issues.create
provider: github
surface: api
operation: issues/create
summary: Create an issue. Anyone with pull access can.
tags: [issues, write]
endpoint:
  method: POST
  url: https://api.github.com/repos/{owner}/{repo}/issues
params:
  required: [owner, repo, title]
  optional: [body, assignees, labels, milestone, type, parent_issue_id]
  notes: The spec marks removal of the singular assignee field as a breaking change in API version 2026-03-10; use assignees. Returns 410 if issues are disabled.
auth:
  methods: [personal-access-token, oauth2, app-token]
  header: "Authorization: Bearer <GITHUB_TOKEN>"
  notes: Token permissions are not listed in the OpenAPI spec. Fill fine-grained permissions from the reference page on first test.
config:
  generic: |
    curl -s -X POST -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github+json" \
      https://api.github.com/repos/OWNER/REPO/issues -d '{"title":"Bug","body":"Details","labels":["bug"]}'
rate_limit:
  notes: Triggers notifications. Creating content too fast can hit secondary rate limits.
errors:
  - code: "410"
    meaning: Issues are disabled in the repository.
    fix: Enable issues in repo settings, or file elsewhere.
    fix_status: unverified
source:
  url: https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json
  read_on: 2026-11-07
  kind: openapi
  spec_revision: "1.1.4"
  reference_url: https://docs.github.com/rest/issues/issues#create-an-issue
status: unverified
last_checked: 2026-11-07
smoke:
  kind: write
  notes: Creates a real issue. Use a sandbox repo.
test:
  status: untested
---
