---
id: google-workspace.api.calendar.events.insert
provider: google-workspace
product: calendar
surface: api
operation: calendar.events.insert
summary: Create an event on a calendar.
tags: [calendar, write]
endpoint:
  method: POST
  url: https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
params:
  required: [calendarId]
  optional: [sendUpdates, conferenceDataVersion, supportsAttachments, maxAttendees]
  notes: Body is an Event resource. sendUpdates is all, externalOnly or none. Use none for tests so guests aren't emailed.
auth:
  methods: [oauth2]
  header: "Authorization: Bearer <ACCESS_TOKEN>"
  scopes:
    - https://www.googleapis.com/auth/calendar.events
    - https://www.googleapis.com/auth/calendar
    - https://www.googleapis.com/auth/calendar.events.owned
    - https://www.googleapis.com/auth/calendar.app.created
  scopes_mode: any
  least_privilege_scope: https://www.googleapis.com/auth/calendar.events.owned
config:
  generic: |
    curl -s -X POST -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" -H "Content-Type: application/json" \
      -d '{"summary":"Test","start":{"dateTime":"2026-11-10T15:00:00-05:00"},"end":{"dateTime":"2026-11-10T15:30:00-05:00"}}' \
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=none"
source:
  url: https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest
  read_on: 2026-11-07
  kind: discovery
  spec_revision: "20261102"
status: unverified
last_checked: 2026-11-07
---
