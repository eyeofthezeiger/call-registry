---
id: slack.api.chat.update
provider: slack
surface: api
operation: chat.update
summary: Edit a message the same token posted.
tags: [messaging, write]
endpoint:
  method: POST
  url: https://slack.com/api/chat.update
  content_types: [application/x-www-form-urlencoded, application/json]
params:
  required: [token, channel, ts]
  optional: [text, blocks, attachments, markdown_text, metadata]
  notes: Only messages posted by the same authenticated user or bot can be updated. Ephemeral messages can't be updated.
auth:
  methods: [bot-token, user-token]
  header: "Authorization: Bearer <SLACK_TOKEN>"
  scopes: [chat:write]
  scopes_mode: all
config:
  generic: |
    curl -s -X POST https://slack.com/api/chat.update \
      -H "Authorization: Bearer $SLACK_TOKEN" -H "Content-Type: application/json; charset=utf-8" \
      -d '{"channel":"C0123456789","ts":"1700000000.000100","text":"Edited"}'
rate_limit:
  tier: Tier 3
  notes: 50+ per minute.
errors:
  - code: cant_update_message
    meaning: The authenticated user doesn't have permission to update this message.
    fix: Update with the same token that posted it.
    fix_status: unverified
  - code: message_not_found
    meaning: No message exists with that timestamp.
    fix_status: none
  - code: edit_window_closed
    meaning: The workspace's edit settings don't allow editing this message any more.
    fix_status: none
source:
  url: https://docs.slack.dev/reference/methods/chat.update
  read_on: 2026-11-07
  kind: docs-page
status: unverified
last_checked: 2026-11-07
---
