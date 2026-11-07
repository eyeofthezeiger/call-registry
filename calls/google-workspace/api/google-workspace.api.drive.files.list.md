---
id: google-workspace.api.drive.files.list
provider: google-workspace
product: drive
surface: api
operation: drive.files.list
summary: List or search the user's Drive files.
tags: [files, read]
endpoint:
  method: GET
  url: https://www.googleapis.com/drive/v3/files
params:
  optional: [q, pageSize, pageToken, orderBy, corpora, driveId, includeItemsFromAllDrives, supportsAllDrives, spaces, fields]
  notes: pageSize max 1000. For shared drives set supportsAllDrives=true and includeItemsFromAllDrives=true. fields is a standard Google query parameter for partial responses.
auth:
  methods: [oauth2]
  header: "Authorization: Bearer <ACCESS_TOKEN>"
  scopes:
    - https://www.googleapis.com/auth/drive.metadata.readonly
    - https://www.googleapis.com/auth/drive.readonly
    - https://www.googleapis.com/auth/drive.file
    - https://www.googleapis.com/auth/drive.metadata
    - https://www.googleapis.com/auth/drive
    - https://www.googleapis.com/auth/drive.appdata
    - https://www.googleapis.com/auth/drive.meet.readonly
    - https://www.googleapis.com/auth/drive.photos.readonly
  scopes_mode: any
  least_privilege_scope: https://www.googleapis.com/auth/drive.metadata.readonly
  notes: drive.file only sees files the app created or the user opened with it.
config:
  generic: |
    curl -s -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
      "https://www.googleapis.com/drive/v3/files?pageSize=10&q=name%20contains%20'plan'&fields=files(id,name,mimeType,modifiedTime)"
source:
  url: https://www.googleapis.com/discovery/v1/apis/drive/v3/rest
  read_on: 2026-11-07
  kind: discovery
  spec_revision: "20261106"
status: unverified
last_checked: 2026-11-07
smoke:
  kind: read
  env: [GOOGLE_ACCESS_TOKEN]
  request:
    method: GET
    url: https://www.googleapis.com/drive/v3/files?pageSize=1
    headers:
      Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}
  expect:
    status: 200
test:
  status: untested
---
