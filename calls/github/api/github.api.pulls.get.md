---
id: github.api.pulls.get
provider: github
surface: api
operation: pulls/get
summary: Get one pull request, including mergeable state.
tags: [pull-requests, read]
endpoint:
  method: GET
  url: https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}
params:
  required: [owner, repo, pull_number]
  notes: mergeable can be null while GitHub computes it in the background; call again after a short wait.
auth:
  methods: [personal-access-token, oauth2, app-token]
  header: "Authorization: Bearer <GITHUB_TOKEN>"
  notes: Token permissions are not listed in the OpenAPI spec. Fill fine-grained permissions from the reference page on first test.
config:
  generic: |
    curl -s -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github+json" \
      https://api.github.com/repos/OWNER/REPO/pulls/1
source:
  url: https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json
  read_on: 2026-11-07
  kind: openapi
  spec_revision: "1.1.4"
  reference_url: https://docs.github.com/rest/pulls/pulls#get-a-pull-request
status: unverified
last_checked: 2026-11-07
---
