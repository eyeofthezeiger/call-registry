---
id: google-workspace.api.gmail.users.drafts.create
provider: google-workspace
product: gmail
surface: api
operation: gmail.users.drafts.create
summary: Create a draft (gets the DRAFT label). Safer default than sending.
tags: [email, write]
endpoint:
  method: POST
  url: https://gmail.googleapis.com/gmail/v1/users/{userId}/drafts
params:
  required: [userId]
  notes: Body is a Draft resource whose message.raw is a base64url-encoded RFC 2822 email.
auth:
  methods: [oauth2]
  header: "Authorization: Bearer <ACCESS_TOKEN>"
  scopes:
    - https://www.googleapis.com/auth/gmail.compose
    - https://www.googleapis.com/auth/gmail.modify
    - https://mail.google.com/
    - https://www.googleapis.com/auth/gmail.addons.current.action.compose
  scopes_mode: any
  least_privilege_scope: https://www.googleapis.com/auth/gmail.compose
config:
  generic: |
    RAW=$(printf 'To: you@example.com\r\nSubject: Test draft\r\n\r\nHello' | base64 | tr '+/' '-_' | tr -d '=\n')
    curl -s -X POST -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" -H "Content-Type: application/json" \
      -d "{\"message\":{\"raw\":\"$RAW\"}}" \
      "https://gmail.googleapis.com/gmail/v1/users/me/drafts"
source:
  url: https://gmail.googleapis.com/$discovery/rest?version=v1
  read_on: 2026-11-07
  kind: discovery
  spec_revision: "20261102"
status: unverified
last_checked: 2026-11-07
smoke:
  kind: write
  notes: Creates a real draft. Run only against a test mailbox.
test:
  status: untested
---
The raw-message format (base64url RFC 2822) comes from the Message schema's raw field in the discovery doc.
