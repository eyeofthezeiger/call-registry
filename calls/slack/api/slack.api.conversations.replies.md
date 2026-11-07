---
id: slack.api.conversations.replies
provider: slack
surface: api
operation: conversations.replies
summary: Read the replies in one thread.
tags: [messaging, read]
endpoint:
  method: GET
  url: https://slack.com/api/conversations.replies
  content_types: [application/x-www-form-urlencoded]
params:
  required: [token, channel, ts]
  optional: [cursor, limit, oldest, latest, inclusive]
  notes: ts is the parent message timestamp. limit default 1000; Slack recommends 200 or fewer. reply_users can hold bot IDs, not only user IDs.
auth:
  methods: [bot-token, user-token]
  header: "Authorization: Bearer <SLACK_TOKEN>"
  scopes: [channels:history, groups:history, im:history, mpim:history]
  scopes_mode: any
config:
  generic: |
    curl -s -H "Authorization: Bearer $SLACK_TOKEN" \
      "https://slack.com/api/conversations.replies?channel=C0123456789&ts=1700000000.000100"
rate_limit:
  tier: Tier 3
  notes: 50+ per minute.
errors:
  - code: thread_not_found
    meaning: Value for ts was missing or invalid.
    fix: Pass the parent message's ts, not a reply's.
    fix_status: unverified
  - code: channel_not_found
    meaning: Value for channel was missing or invalid.
    fix_status: none
  - code: ratelimited
    meaning: The request was rate limited.
    fix: Wait the number of seconds in the Retry-After header, then retry.
    fix_status: unverified
source:
  url: https://docs.slack.dev/reference/methods/conversations.replies
  read_on: 2026-11-07
  kind: docs-page
status: unverified
last_checked: 2026-11-07
---
The docs list form-encoded only for this method, so the example sends query parameters, not JSON.
