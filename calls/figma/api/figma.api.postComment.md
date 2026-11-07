---
id: figma.api.postComment
provider: figma
surface: api
operation: postComment
summary: Add a comment (or a reply) to a file.
tags: [comments, write]
endpoint:
  method: POST
  url: https://api.figma.com/v1/files/{file_key}/comments
  content_types: [application/json]
params:
  required: [file_key, message]
  optional: [comment_id, client_meta]
  notes: comment_id makes it a reply. client_meta pins it to a position or node.
auth:
  methods: [personal-access-token, oauth2]
  header: "X-Figma-Token: <FIGMA_TOKEN>"
  scopes: [file_comments:write]
  scopes_mode: all
  notes: Plan access tokens are not listed for this endpoint in the spec.
config:
  generic: |
    curl -s -X POST -H "X-Figma-Token: $FIGMA_TOKEN" -H "Content-Type: application/json" \
      -d '{"message":"Looks good"}' "https://api.figma.com/v1/files/$FILE_KEY/comments"
rate_limit:
  tier: Tier 2
  notes: Per-minute limits depend on seat (View/Collab vs Dev/Full) and plan. On 429, wait Retry-After seconds. Headers X-Figma-Plan-Tier and X-Figma-Rate-Limit-Type say which limit you hit.
  source_url: https://developers.figma.com/docs/rest-api/rate-limits/
errors:
  - code: "429"
    meaning: Rate limited (leaky bucket).
    fix: Wait the Retry-After seconds, then retry with backoff.
    fix_status: unverified
  - code: "403"
    meaning: Forbidden. Token lacks the scope or access to the file.
    fix_status: none
source:
  url: https://raw.githubusercontent.com/figma/rest-api-spec/main/openapi/openapi.yaml
  also:
    - https://developers.figma.com/docs/rest-api/scopes/
    - https://developers.figma.com/docs/rest-api/rate-limits/
  read_on: 2026-11-07
  kind: openapi
  spec_revision: "0.47.0"
status: unverified
last_checked: 2026-11-07
smoke:
  kind: write
  notes: Posts a real comment people can see. Test file only.
test:
  status: untested
---
