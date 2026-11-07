---
id: slack.api.chat.postMessage
provider: slack
surface: api
operation: chat.postMessage
summary: Post a message to a channel, DM or thread.
tags: [messaging, write]
endpoint:
  method: POST
  url: https://slack.com/api/chat.postMessage
  content_types: [application/x-www-form-urlencoded, application/json]
params:
  required: [token, channel]
  optional: [text, blocks, thread_ts, reply_broadcast, markdown_text]
  notes: Pass the token as a Bearer header. markdown_text max 12,000 chars; keep text under 4,000. Use thread_ts to reply in a thread.
auth:
  methods: [bot-token, user-token]
  header: "Authorization: Bearer <SLACK_TOKEN>"
  scopes: [chat:write]
  scopes_mode: all
  notes: Same scope for bot and user tokens. Bots need chat:write.public to post in public channels they haven't joined. Bots can't post into a DM between two users.
config:
  generic: |
    curl -s -X POST https://slack.com/api/chat.postMessage \
      -H "Authorization: Bearer $SLACK_TOKEN" -H "Content-Type: application/json; charset=utf-8" \
      -d '{"channel":"C0123456789","text":"Hello from the registry"}'
rate_limit:
  tier: Special
  notes: Generally about 1 message per second per channel.
errors:
  - code: not_in_channel
    meaning: Cannot post user messages to a channel they are not in.
    fix: Invite the bot to the channel, or add chat:write.public for public channels.
    fix_status: unverified
  - code: channel_not_found
    meaning: Value passed for channel was invalid.
    fix: Use the channel ID (C..., G..., D...), not the name.
    fix_status: unverified
  - code: missing_scope
    meaning: The token is not granted the scope this call needs.
    fix: Add chat:write to the app and reinstall it to the workspace.
    fix_status: unverified
source:
  url: https://docs.slack.dev/reference/methods/chat.postMessage
  read_on: 2026-11-07
  kind: docs-page
status: unverified
last_checked: 2026-11-07
---
