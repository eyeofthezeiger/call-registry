---
id: slack.api.conversations.history
provider: slack
surface: api
operation: conversations.history
summary: Read the message history of a channel or DM.
tags: [messaging, read]
endpoint:
  method: GET
  url: https://slack.com/api/conversations.history
  content_types: [application/x-www-form-urlencoded, application/json]
params:
  required: [token, channel]
  optional: [cursor, limit, oldest, latest, inclusive]
  notes: limit default 100, max 999; Slack recommends 200 or fewer. Paginate with response_metadata.next_cursor.
auth:
  methods: [bot-token, user-token]
  header: "Authorization: Bearer <SLACK_TOKEN>"
  scopes: [channels:history, groups:history, im:history, mpim:history]
  scopes_mode: any
  notes: Pick the scope for the conversation type (public, private, DM, group DM). Bot tokens only reach conversations the bot is a member of.
config:
  generic: |
    curl -s -H "Authorization: Bearer $SLACK_TOKEN" \
      "https://slack.com/api/conversations.history?channel=C0123456789&limit=20"
rate_limit:
  tier: Tier 3
  notes: 50+ per minute.
errors:
  - code: not_in_channel
    meaning: The token doesn't have access to the channel. Only user tokens can read public channels they aren't in.
    fix: Invite the bot, or use a user token.
    fix_status: unverified
  - code: channel_not_found
    meaning: Value passed for channel was invalid.
    fix_status: none
  - code: missing_scope
    meaning: The token is not granted the scope this call needs.
    fix: Add the history scope for that conversation type and reinstall.
    fix_status: unverified
  - code: ratelimited
    meaning: The request was rate limited.
    fix: Wait the number of seconds in the Retry-After header, then retry.
    fix_status: unverified
source:
  url: https://docs.slack.dev/reference/methods/conversations.history
  read_on: 2026-11-07
  kind: docs-page
status: unverified
last_checked: 2026-11-07
---
