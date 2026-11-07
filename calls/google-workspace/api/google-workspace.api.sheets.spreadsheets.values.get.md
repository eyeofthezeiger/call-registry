---
id: google-workspace.api.sheets.spreadsheets.values.get
provider: google-workspace
product: sheets
surface: api
operation: sheets.spreadsheets.values.get
summary: Read a range of cell values (A1 or R1C1 notation).
tags: [sheets, read]
endpoint:
  method: GET
  url: https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}
params:
  required: [spreadsheetId, range]
  optional: [majorDimension, valueRenderOption, dateTimeRenderOption]
  notes: URL-encode the range, e.g. Sheet1!A1:D10 becomes Sheet1%21A1%3AD10.
auth:
  methods: [oauth2]
  header: "Authorization: Bearer <ACCESS_TOKEN>"
  scopes:
    - https://www.googleapis.com/auth/spreadsheets.readonly
    - https://www.googleapis.com/auth/spreadsheets
    - https://www.googleapis.com/auth/drive.readonly
    - https://www.googleapis.com/auth/drive.file
    - https://www.googleapis.com/auth/drive
  scopes_mode: any
  least_privilege_scope: https://www.googleapis.com/auth/spreadsheets.readonly
config:
  generic: |
    curl -s -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
      "https://sheets.googleapis.com/v4/spreadsheets/$SHEET_ID/values/Sheet1%21A1%3AD10"
source:
  url: https://sheets.googleapis.com/$discovery/rest?version=v4
  read_on: 2026-11-07
  kind: discovery
  spec_revision: "20261106"
status: unverified
last_checked: 2026-11-07
smoke:
  kind: read
  env: [GOOGLE_ACCESS_TOKEN, GSHEETS_TEST_SHEET_ID]
  request:
    method: GET
    url: https://sheets.googleapis.com/v4/spreadsheets/${GSHEETS_TEST_SHEET_ID}/values/A1%3AA1
    headers:
      Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}
  expect:
    status: 200
test:
  status: untested
---
