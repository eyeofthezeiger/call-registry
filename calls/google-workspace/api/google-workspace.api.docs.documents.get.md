---
id: google-workspace.api.docs.documents.get
provider: google-workspace
product: docs
surface: api
operation: docs.documents.get
summary: Get the latest version of a Google Doc as structured JSON.
tags: [docs, read]
endpoint:
  method: GET
  url: https://docs.googleapis.com/v1/documents/{documentId}
params:
  required: [documentId]
  optional: [includeTabsContent, suggestionsViewMode, commentsViewMode]
  notes: With includeTabsContent=true, content comes back in Document.tabs instead of body. Docs with tabs need this to see every tab.
auth:
  methods: [oauth2]
  header: "Authorization: Bearer <ACCESS_TOKEN>"
  scopes:
    - https://www.googleapis.com/auth/documents.readonly
    - https://www.googleapis.com/auth/documents
    - https://www.googleapis.com/auth/drive.readonly
    - https://www.googleapis.com/auth/drive.file
    - https://www.googleapis.com/auth/drive
  scopes_mode: any
  least_privilege_scope: https://www.googleapis.com/auth/documents.readonly
config:
  generic: |
    curl -s -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
      "https://docs.googleapis.com/v1/documents/$DOC_ID?includeTabsContent=true"
source:
  url: https://docs.googleapis.com/$discovery/rest?version=v1
  read_on: 2026-11-07
  kind: discovery
  spec_revision: "20261106"
status: unverified
last_checked: 2026-11-07
---
