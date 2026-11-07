# Update routine

Design only. Nothing here runs yet.

## What it does

- Runs on a schedule (weekly is plenty), on Matt's machine or his agent host.
- Reads each source in `sources.yaml`. Official, public docs only.
- Diffs what it read against the registry entries.
- Opens a PR with changes. Never commits to main.
- Everything it adds or changes is `status: unverified`.
- Matt reviews the PR. His approval is the verification.

## Scraping rules

- Prefer machine-readable sources: OpenAPI specs, Google discovery docs, MCP servers' published tool lists.
- Fall back to docs pages only when there's no spec.
- Respect robots.txt and each site's terms. Low request rate. Identify the client honestly.
- No logged-in pages. No copying whole docs into the repo, just the facts each field needs.

## Diff rules

- Endpoint, params, scopes or rate tier changed: update the entry, reset status to unverified, note what changed in the PR.
- Call gone from the spec: mark `status: deprecated`, don't delete.
- New call worth adding: add it only if it's on the provider's list in `registry.config.json` and someone uses it.
- Spec revision bumped with no field changes: only update `last_checked`.

## Error triage

- AI setups log failures as id, error code, client, date. No tokens, no payloads.
- The routine groups failures by call and code.
- A new code gets an `errors` entry with `fix_status: none`.
- A known fix gets proposed as `fix_status: unverified`.
- Matt marks a fix verified once it works for him.

## Who runs it

- Matt's personal chief-of-staff agent, on his own machine. It holds his credentials; this repo never does.
