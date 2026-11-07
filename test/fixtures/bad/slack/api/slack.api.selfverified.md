---
id: slack.api.selfverified
provider: slack
surface: api
operation: example.call
summary: Marked verified by a bot.
endpoint:
  method: POST
  url: https://slack.com/api/example.call
auth:
  methods: [bot-token]
source:
  url: https://docs.slack.dev/
  read_on: 2026-11-07
  kind: docs-page
status: verified
verified_by: some-bot
verified_on: 2026-11-07
errors:
  - code: not_in_channel
    meaning: Bot is not in the channel.
    fix: Invite the bot.
    fix_status: verified
last_checked: 2026-11-07
---
Token: xoxb-1234567890-abcdefghij
