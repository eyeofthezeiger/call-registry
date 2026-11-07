---
id: google-workspace.api.calendar.events.list
provider: google-workspace
product: calendar
surface: api
operation: calendar.events.list
summary: List events on a calendar, optionally in a time window.
tags: [calendar, read]
endpoint:
  method: GET
  url: https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
params:
  required: [calendarId]
  optional: [timeMin, timeMax, singleEvents, orderBy, maxResults, pageToken, q, timeZone, syncToken, showDeleted, eventTypes]
  notes: calendarId "primary" is the signed-in user's main calendar. Use singleEvents=true to expand recurring events (needed for orderBy=startTime).
auth:
  methods: [oauth2]
  header: "Authorization: Bearer <ACCESS_TOKEN>"
  scopes:
    - https://www.googleapis.com/auth/calendar.events.readonly
    - https://www.googleapis.com/auth/calendar.readonly
    - https://www.googleapis.com/auth/calendar.events
    - https://www.googleapis.com/auth/calendar
    - https://www.googleapis.com/auth/calendar.events.owned.readonly
    - https://www.googleapis.com/auth/calendar.events.owned
    - https://www.googleapis.com/auth/calendar.events.public.readonly
    - https://www.googleapis.com/auth/calendar.events.freebusy
    - https://www.googleapis.com/auth/calendar.app.created
  scopes_mode: any
  least_privilege_scope: https://www.googleapis.com/auth/calendar.events.readonly
config:
  generic: |
    curl -s -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&timeMin=2026-11-07T00:00:00Z&maxResults=10"
source:
  url: https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest
  read_on: 2026-11-07
  kind: discovery
  spec_revision: "20261102"
status: unverified
last_checked: 2026-11-07
smoke:
  kind: read
  env: [GOOGLE_ACCESS_TOKEN]
  request:
    method: GET
    url: https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=1
    headers:
      Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}
  expect:
    status: 200
test:
  status: untested
---
orderBy=startTime only works with singleEvents=true, per the orderBy enum description in the discovery doc.
