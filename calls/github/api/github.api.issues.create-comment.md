---
id: github.api.issues.create-comment
provider: github
surface: api
operation: issues/create-comment
summary: Comment on an issue or a pull request (every PR is an issue).
tags: [issues, pull-requests, write]
endpoint:
  method: POST
  url: https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}/comments
params:
  required: [owner, repo, issue_number, body]
auth:
  methods: [personal-access-token, oauth2, app-token]
  header: "Authorization: Bearer <GITHUB_TOKEN>"
  notes: Token permissions are not listed in the OpenAPI spec. Fill fine-grained permissions from the reference page on first test.
config:
  generic: |
    curl -s -X POST -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github+json" \
      https://api.github.com/repos/OWNER/REPO/issues/1/comments -d '{"body":"Looks good"}'
rate_limit:
  notes: Triggers notifications. Creating content too fast can hit secondary rate limits.
source:
  url: https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json
  read_on: 2026-11-07
  kind: openapi
  spec_revision: "1.1.4"
  reference_url: https://docs.github.com/rest/issues/comments#create-an-issue-comment
status: unverified
last_checked: 2026-11-07
smoke:
  kind: write
  notes: Posts a real comment and notifies people. Sandbox repo only.
test:
  status: untested
---
