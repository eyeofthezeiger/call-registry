---
id: github.api.pulls.create
provider: github
surface: api
operation: pulls/create
summary: Open a pull request from a head branch into a base branch.
tags: [pull-requests, write]
endpoint:
  method: POST
  url: https://api.github.com/repos/{owner}/{repo}/pulls
  content_types: [application/json]
params:
  required: [owner, repo, head, base]
  optional: [title, body, draft, maintainer_can_modify, head_repo, issue]
  notes: You need write access to the head branch. In org repos you must be an org member. Drafts depend on plan (see spec description).
auth:
  methods: [personal-access-token, oauth2, app-token]
  header: "Authorization: Bearer <GITHUB_TOKEN>"
  notes: Token permissions are not listed in the OpenAPI spec. Fill fine-grained permissions from the reference page on first test.
config:
  generic: |
    curl -s -X POST -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github+json" \
      https://api.github.com/repos/OWNER/REPO/pulls \
      -d '{"title":"My change","head":"my-branch","base":"main","draft":true}'
rate_limit:
  notes: Triggers notifications. Creating content too fast can hit secondary rate limits.
errors:
  - code: "422"
    meaning: Validation failed, or the endpoint has been spammed.
    fix_status: none
  - code: "403"
    meaning: Forbidden.
    fix_status: none
source:
  url: https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json
  read_on: 2026-11-07
  kind: openapi
  spec_revision: "1.1.4"
  reference_url: https://docs.github.com/rest/pulls/pulls#create-a-pull-request
status: unverified
last_checked: 2026-11-07
smoke:
  kind: write
  notes: Opens a real PR. Use a sandbox repo.
test:
  status: untested
---
