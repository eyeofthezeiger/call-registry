---
id: slack.api.users.lookupByEmail
provider: slack
surface: api
operation: users.lookupByEmail
summary: Find a workspace user by email address.
tags: [users, read]
endpoint:
  method: GET
  url: https://slack.com/api/users.lookupByEmail
  content_types: [application/x-www-form-urlencoded]
params:
  required: [token, email]
auth:
  methods: [bot-token, user-token]
  header: "Authorization: Bearer <SLACK_TOKEN>"
  scopes: [users:read.email]
  scopes_mode: all
  notes: users:read alone no longer returns the email field. Custom bot users can't use this method.
config:
  generic: |
    curl -s -H "Authorization: Bearer $SLACK_TOKEN" \
      "https://slack.com/api/users.lookupByEmail?email=someone%40example.com"
rate_limit:
  tier: Tier 3
  notes: 50+ per minute.
errors:
  - code: users_not_found
    meaning: No user found for the email. Also returned for deactivated users.
    fix_status: none
  - code: missing_scope
    meaning: The token is not granted the scope this call needs.
    fix: Add users:read.email and reinstall.
    fix_status: unverified
source:
  url: https://docs.slack.dev/reference/methods/users.lookupByEmail
  read_on: 2026-11-07
  kind: docs-page
status: unverified
last_checked: 2026-11-07
---
