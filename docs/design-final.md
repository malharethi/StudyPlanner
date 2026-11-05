# Final Design: StudyPlanner

Date: 2026-11-05. Selected HTML/CSS/native JavaScript/localStorage design for Lab 7.
[Decision](architecture-decision.md) and [final architecture](architecture-final.md) provide rationale
and system context. [Specification](../specs/001-manage-study-work/spec.md) defines requirements;
[data model](../specs/001-manage-study-work/data-model.md) and
[contracts](../specs/001-manage-study-work/contracts/ui-storage.md) define shared invariants.
This is documentation only; implementation and acceptance evidence remain pending.

## Components and interface

One web/index.html contains semantic course and assignment lists, forms, view/course/status
selectors, confirmation and status/error regions. Plain styles.css provides responsive layout.
ui.js reads drafts, renders safe text, wires events and manages focus. app.js owns committed
records, transient filters/drafts and command orchestration. domain.js owns validation, CRUD and
selectors; dates.js isolates calendar rules. storage.js guards load/parse/serialize/setItem.
No React, IndexedDB, server, router, production build or runtime dependency is required.

```mermaid
sequenceDiagram
    participant Student
    participant UI as ui.js
    participant App as app.js
    participant Rules as domain.js / dates.js
    participant Store as storage.js
    Student->>UI: Submit draft / confirm action
    UI->>App: Command with immutable target IDs
    App->>Rules: Validate and construct candidate
    Rules-->>App: Candidate or field/domain errors
    App->>Store: Validate, serialize, setItem candidate
    alt write fails
        Store-->>App: Failure; previous saved state unchanged
        App-->>UI: Keep draft; correction or retry guidance
    else write succeeds
        Store-->>App: Storage success
        App->>App: Commit candidate
        App->>UI: Render derived results
        Note over App,UI: Display failure needs refresh; never repeat creation or claim rollback
    end
```

## Persisted and transient data

The one localStorage key is studyplanner:data. JSON envelope is schemaVersion: 1, courses array,
assignments array. Each course has immutable UUID id and trimmed name (1–100 grapheme clusters).
Each assignment has immutable UUID id, existing courseId, trimmed title (1–200), description
(string, empty default, at most 2,000 graphemes), dueDate (YYYY-MM-DD) and completed (boolean,
false initially). Descriptions retain whitespace. Duplicate names/titles are allowed; display
stable ID suffixes where necessary to distinguish selections. Use crypto.randomUUID for IDs and
Intl.Segmenter for grapheme counts; validate IDs are unique within each entity collection.

Keep filters, drafts, errors and load status in memory only. Default view is all, course filter
all, status all. Persist insertion order in arrays, append new entities, preserve positions during
edits and preserve surviving order during deletion. No timestamps, identity or overdue flags.

## Validation and operations

Both load and save validate envelope version, array shape, field types, normalized required
names/titles, length boundaries, real dates, boolean states, unique IDs and course references.
Browser form constraints supplement authoritative domain validation; never truncate oversized
text. Use textContent for student strings, not HTML interpolation. Invalid input identifies fields,
keeps the draft and makes no persistent change.

Rename a course without changing its ID. Move an assignment by changing courseId to another
existing course. Confirm all deletes and recheck target existence/course emptiness when applying
the command. Block populated-course deletion with move/delete guidance. Cancel and stale/repeated
deletes leave saved state unchanged and never target a different record. Deleting an empty
filtered course resets its filter to all. Every mutation creates a candidate without changing
the committed snapshot.

## Calendar dates, completion and filtering

Validate years 0001–9999, Gregorian leap years and month lengths. Accept past dates. Never parse
stored calendar strings as UTC timestamps; build today from local year/month/day getters.
Canonical strings compare in chronological order. Upcoming is incomplete with date >= today,
without a future horizon; overdue is incomplete with date < today. Recompute when entering or
refreshing a view, changing filters or saving changes; provide refresh for an overnight page.
Timezone changes do not change stored dates.

Completion toggles only the persisted boolean. AND the selected view, course and completion
predicates. Completed status in upcoming/overdue gives an empty message. Clear filters resets
course/status but keeps the view. Sort ascending due date, English Intl.Collator title, then
original array position. Recompute after saved edits so membership reflects current data.

## Storage state and error boundaries

| Stage/result | Behavior |
| --- | --- |
| Missing key on load | Valid empty planner; no startup save needed |
| Valid version-1 envelope | Adopt committed snapshot and render |
| Denied access/read error | Show retry guidance; block mutation; no fabricated empty success |
| Invalid JSON/schema/orphans/unsupported version | Preserve raw data; block mutation; explain load problem |
| Validation/serialization/setItem fails | Old saved and committed state unchanged; preserve draft; allow corrected retry |
| setItem succeeds | Candidate is committed before display; saved changes are authoritative |
| Rendering fails after save | Say data was saved and display needs refresh; block mutations until refresh/reload; never auto-repeat creation or claim rollback |

Guard obtaining localStorage as well as its calls. Use one setItem replacement for both entity
arrays; do not split related records across keys. A write retry is allowed only for a failed
write, after revalidation. Keep write and render try/catch paths distinct. A successful stored
snapshot must not be overwritten with old memory after a display error. The fallback error region
should remain usable; a page reload reloads the committed value. No disk-loss guarantee is claimed.

On initial load error, show no fabricated records. If a later reload/read fails, label any last
known snapshot stale/read-only. Retrying reads does not delete or rewrite anything. Do not
silently repair, downgrade, salvage or reset. No version-1 migration exists; future migrations
need a separate tested design. No automatic retry creates duplicate records.

Manual data clearing requires app reload: deliberately remove only studyplanner:data through
browser developer tools, then reload. This discards data; missing key at reload means empty planner.
Never call localStorage.clear(). An open page may hold old memory; concurrent editing and
developer-tools storage changes during use are outside normal use. No cross-tab sync is added.

## Accessibility and privacy

Use meaningful headings, associated labels, semantic buttons/controls and visible keyboard focus.
Associate field errors, focus the first invalid input, announce results/errors with text and a
suitable live region, and restore logical focus after confirmation/cancel/delete. All workflows
must work by keyboard. At 320 CSS pixels preserve content/actions without horizontal page scrolling;
wrap long text and meet 4.5:1 normal-text contrast. Status/errors never depend only on color.

Explain browser/profile/device retention and clearing risks in the app. Records never need to
leave the browser. HTTPS and avoiding third-party scripts limit exposure but are not encryption
of stored records. Origin scripts and people using the same browser profile can access data.

## Testing and environment

Use Node's built-in test runner for pure domain/date/adapter behavior and Playwright for browser
stories. Inject denied/full storage, invalid JSON/schema, orphan references, unsupported versions
and write failures. Verify old snapshots and drafts survive failed writes. Separately inject a
render failure after successful setItem: verify refresh guidance, no rollback, no automatic create
retry, and exactly one saved record after reload. Deliberate clearing followed by reload must
show an empty planner. Use temporary profiles; do not modify real student information.

Cover all CRUD/relationship/confirmation cases, grapheme boundaries, leap dates, both states,
all view/filter intersections and stable ties. Ten normal browser-restart cycles must retain all
committed values/deletions in the same persistent profile. Measure 20 courses/500 assignments:
19/20 view/filter trials within two seconds. Five-student usability target: four complete each
SC-001 timed stage without help. Manually check keyboard, focus, labels, text cues, contrast and
320px layout. Add regression checks for core-feature fixes. SC-001–SC-006 are all pending.

Runtime needs ES modules, DOM, JSON, localStorage, Intl.Segmenter, Intl.Collator and
crypto.randomUUID, JavaScript/storage enabled and HTTPS or localhost. Chrome/Edge/Firefox/Safari
are intended targets, not verified compatibility claims. Node 24 with npm is development-only.
The exact demonstration device/OS/browser, Node/npm, Playwright/static-server versions and all
actual results are pending in [quickstart](../specs/001-manage-study-work/quickstart.md).

## Deployment analysis and instructions

Deployment analysis/instructions are required; actual hosting/publication is outside this
exercise. After future implementation, serve web/ over HTTP at a stable localhost port, run
planned checks, and copy only its HTML/CSS/JS contents to an HTTPS static document root. Use
relative assets/modules and no client routes needing rewrites; ensure JavaScript MIME types.
No production build, Node server, credentials or database service is needed. A dedicated static
publish branch is an optional host mechanism; no hosting configuration is created now.

At the final URL verify assets, console, CRUD, date/filter behavior, keyboard and close/reopen
retention. Record revision, URL and results then. Exclude tests/docs/profiles from the public
artifact. Update assets coherently and retain schema compatibility; rollback only compatible
assets, never clear storage as part of deployment. Stable scheme/host/port is necessary for
accessing the same data; moving from localhost or changing origin does not transfer records.

Finite quota, synchronous whole-snapshot work, private browsing, clearing/eviction and device
loss limit retention. No account recovery, syncing, backup or guaranteed offline startup exists.
The static host may log asset requests but is not a planner-data server. See
[final architecture](architecture-final.md) and [quickstart](../specs/001-manage-study-work/quickstart.md)
for system context and proposed validation commands.
