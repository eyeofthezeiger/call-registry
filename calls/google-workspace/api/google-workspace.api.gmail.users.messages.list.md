---
id: google-workspace.api.gmail.users.messages.list
provider: google-workspace
product: gmail
surface: api
operation: gmail.users.messages.list
summary: List message IDs in the user's mailbox, optionally filtered by a Gmail search query.
tags: [email, read]
endpoint:
  method: GET
  url: https://gmail.googleapis.com/gmail/v1/users/{userId}/messages
params:
  required: [userId]
  optional: [q, maxResults, pageToken, labelIds, includeSpamTrash]
  notes: userId accepts "me" for the authenticated user. maxResults defaults to 100, max 500. q uses Gmail search box syntax. Returns IDs only; call messages.get for content.
auth:
  methods: [oauth2]
  header: "Authorization: Bearer <ACCESS_TOKEN>"
  scopes:
    - https://www.googleapis.com/auth/gmail.metadata
    - https://www.googleapis.com/auth/gmail.readonly
    - https://www.googleapis.com/auth/gmail.modify
    - https://mail.google.com/
  scopes_mode: any
  least_privilege_scope: https://www.googleapis.com/auth/gmail.readonly
  notes: The discovery doc lists gmail.metadata, but per the q description the q parameter can't be used with the metadata scope. Use gmail.readonly if you search.
config:
  generic: |
    curl -s -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=is:unread"
examples:
  response: |
    { "messages": [ { "id": "<id>", "threadId": "<threadId>" } ], "nextPageToken": "<token>", "resultSizeEstimate": 1 }
source:
  url: https://gmail.googleapis.com/$discovery/rest?version=v1
  read_on: 2026-11-07
  kind: discovery
  spec_revision: "20261102"
status: unverified
last_checked: 2026-11-07
---
Response shape (ListMessagesResponse) is from the discovery doc. Field names in the example are from that schema; values are placeholders.
