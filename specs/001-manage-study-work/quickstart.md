# Quickstart and Validation Guide

This is a future implementation/run guide. Application files, package scripts and tests do not
exist yet; the commands below become runnable after implementation. No application was built,
package installed or site published during planning.

## Prerequisites and proposed commands

Use Node.js 24 LTS with npm, a supported browser, and a standard temporary test profile permitting
localStorage. Implementation will pin development dependencies (a simple static server and
Playwright), commit the lockfile, and provide these script contracts:

```powershell
npm ci
npx playwright install chromium
npm run dev
```

`dev` must serve only `web/` at `http://localhost:8080`; keep hostname/port stable. In another
terminal, the planned validation commands are:

```powershell
npm test
npm run test:browser
```

`test` runs Node unit/adapter behavioral checks; `test:browser` runs Playwright with its webServer
configuration starting that same origin. Do not test persistence by opening index.html as file://.
Exact package versions and scripts will be established during implementation, not guessed here.

## End-to-end validation

1. Empty profile: open the app and verify add-course guidance. Add two courses; rename one.
   Confirm invalid/blank names show errors, cancel preserves data, duplicates remain selectable.
2. Add assignments with/without descriptions, due yesterday/today/tomorrow, both states, equal
   dates and titles. Edit every field and move one assignment to the other course. Confirm details
   and relationships match the [data model](data-model.md).
3. Verify all/upcoming/overdue memberships and all course/status combinations using a fixed local
   date fixture. Verify clearing filters, empty results and sort ties. Toggle completion and edit
   dates while a filter is active; the visible list must update correctly.
4. Attempt populated-course deletion: it must be blocked. Move/delete its assignments, then
   confirm course deletion. Verify assignment deletion affects only its selected ID, cancellation
   and repeated deletion never affect other records, and a removed course filter resets.
5. Save a known fixture including edits and deletions. Reload, then close the browser normally
   and reopen using the same persistent temporary profile and origin. Compare every saved field
   and relationship across ten cycles. A fresh browser context is not evidence of persistence.
6. In isolated tests, inject invalid JSON, unsupported schema, orphan references, denied storage,
   full-quota/write failures and invalid forms. Verify no false success or partial change, raw data
   is preserved, drafts remain available, and retry behaves according to the
   [UI/storage contract](contracts/ui-storage.md). Never corrupt a real student's profile.
7. Keyboard-only: traverse every story including confirmation/cancel, validation and retry. Check
   visible focus, associated labels, textual errors/status, 4.5:1 text contrast, and no horizontal
   page scrolling at 320 CSS pixels. Record browser versions and results.
8. Use 20 courses/500 assignments; measure view/filter display time for 20 trials on the documented
   demonstration device: at least 19 within two seconds. Have five unfamiliar students perform
   SC-001: at least four complete each timed stage without assistance.

Record commands, results, device/browser versions and any failures at feature acceptance; resolve
failures before accepting changes. Add regression checks for core-feature fixes. These scenarios
map to Stories 1–4, FR-001–FR-014 and SC-001–SC-006; they are planned checks, not passed results.

## Deployment and troubleshooting

Follow the standalone [base architecture](../../docs/architecture-base.md) deployment procedure:
validate locally, copy only web/ assets to an HTTPS static host, verify relative paths and storage
at the final origin, and retain the origin for subsequent releases. Do not upload test profiles.

For a load error, retry access without modifying the stored value. Corruption/unknown versions
must not auto-reset. If the student deliberately discards their data, developer tools may remove
only `studyplanner:data` followed by reload; this is irreversible and not recovery. Clearing all
browser data is unnecessary. No schema migration exists in v1; future versions need a tested plan.
Normal retention does not cover cleared data, private browsing, eviction, or device/profile loss.
