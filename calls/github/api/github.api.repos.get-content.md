---
id: github.api.repos.get-content
provider: github
surface: api
operation: repos/get-content
summary: Get a file or directory listing from a repo at a ref.
tags: [repos, read]
endpoint:
  method: GET
  url: https://api.github.com/repos/{owner}/{repo}/contents/{path}
params:
  required: [owner, repo, path]
  optional: [ref]
  notes: Directory listings cap at 1,000 files. Files up to 1 MB get every feature; 1 to 100 MB only with the raw or object media types; over 100 MB isn't supported. Accept application/vnd.github.raw+json returns raw file contents.
auth:
  methods: [personal-access-token, oauth2, app-token]
  header: "Authorization: Bearer <GITHUB_TOKEN>"
  notes: Token permissions are not listed in the OpenAPI spec. Fill fine-grained permissions from the reference page on first test.
config:
  generic: |
    curl -s -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github.raw+json" \
      "https://api.github.com/repos/OWNER/REPO/contents/README.md?ref=main"
source:
  url: https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json
  read_on: 2026-11-07
  kind: openapi
  spec_revision: "1.1.4"
  reference_url: https://docs.github.com/rest/repos/contents#get-repository-content
status: unverified
last_checked: 2026-11-07
smoke:
  kind: read
  env: [GITHUB_TOKEN, GITHUB_TEST_OWNER, GITHUB_TEST_REPO]
  request:
    method: GET
    url: https://api.github.com/repos/${GITHUB_TEST_OWNER}/${GITHUB_TEST_REPO}/contents/
    headers:
      Authorization: Bearer ${GITHUB_TOKEN}
      Accept: application/vnd.github+json
  expect:
    status: 200
test:
  status: untested
---
