---
id: google-workspace.api.sheets.spreadsheets.values.append
provider: google-workspace
product: sheets
surface: api
operation: sheets.spreadsheets.values.append
summary: Append rows after the last row of the table found in a range.
tags: [sheets, write]
endpoint:
  method: POST
  url: https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}:append
params:
  required: [spreadsheetId, range, valueInputOption]
  optional: [insertDataOption, includeValuesInResponse, responseValueRenderOption, responseDateTimeRenderOption]
  notes: valueInputOption is RAW or USER_ENTERED. The method description says the caller must give spreadsheet ID, range and valueInputOption, though the parameter itself isn't flagged required.
auth:
  methods: [oauth2]
  header: "Authorization: Bearer <ACCESS_TOKEN>"
  scopes:
    - https://www.googleapis.com/auth/spreadsheets
    - https://www.googleapis.com/auth/drive.file
    - https://www.googleapis.com/auth/drive
  scopes_mode: any
  least_privilege_scope: https://www.googleapis.com/auth/spreadsheets
config:
  generic: |
    curl -s -X POST -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" -H "Content-Type: application/json" \
      -d '{"values":[["2026-11-07","hello"]]}' \
      "https://sheets.googleapis.com/v4/spreadsheets/$SHEET_ID/values/Sheet1%21A1:append?valueInputOption=USER_ENTERED"
source:
  url: https://sheets.googleapis.com/$discovery/rest?version=v4
  read_on: 2026-11-07
  kind: discovery
  spec_revision: "20261106"
status: unverified
last_checked: 2026-11-07
smoke:
  kind: write
  notes: Writes real rows. Use a scratch spreadsheet.
test:
  status: untested
---
