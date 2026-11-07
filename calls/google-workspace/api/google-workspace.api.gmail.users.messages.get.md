---
id: google-workspace.api.gmail.users.messages.get
provider: google-workspace
product: gmail
surface: api
operation: gmail.users.messages.get
summary: Get one message by ID, in minimal, full, raw or metadata format.
tags: [email, read]
endpoint:
  method: GET
  url: https://gmail.googleapis.com/gmail/v1/users/{userId}/messages/{id}
params:
  required: [userId, id]
  optional: [format, metadataHeaders]
  notes: format is one of minimal, full, raw, metadata. metadataHeaders only applies with format=metadata.
auth:
  methods: [oauth2]
  header: "Authorization: Bearer <ACCESS_TOKEN>"
  scopes:
    - https://www.googleapis.com/auth/gmail.metadata
    - https://www.googleapis.com/auth/gmail.readonly
    - https://www.googleapis.com/auth/gmail.modify
    - https://mail.google.com/
    - https://www.googleapis.com/auth/gmail.addons.current.message.action
    - https://www.googleapis.com/auth/gmail.addons.current.message.metadata
    - https://www.googleapis.com/auth/gmail.addons.current.message.readonly
  scopes_mode: any
  least_privilege_scope: https://www.googleapis.com/auth/gmail.readonly
config:
  generic: |
    curl -s -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/$MESSAGE_ID?format=metadata&metadataHeaders=Subject&metadataHeaders=From"
source:
  url: https://gmail.googleapis.com/$discovery/rest?version=v1
  read_on: 2026-11-07
  kind: discovery
  spec_revision: "20261102"
status: unverified
last_checked: 2026-11-07
---
