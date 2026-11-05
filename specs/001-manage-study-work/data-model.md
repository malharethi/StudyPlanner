# Data Model: StudyPlanner

## Persisted envelope

localStorage key: `studyplanner:data`. JSON object:

| Field | Type | Constraint |
| --- | --- | --- |
| schemaVersion | integer | Exactly 1; unsupported versions block load/writes |
| courses | Course array | IDs unique; insertion order retained |
| assignments | Assignment array | IDs unique; insertion order retained |

No filters, derived overdue flags, timestamps, student identity or credentials are persisted.
Do not silently repair invalid envelopes. No migration is needed for initial schema 1; future
versions require a separately designed and tested migration rather than implicit overwriting.

## Course

| Field | Type | Rule |
| --- | --- | --- |
| id | UUID string | Immutable, generated with crypto.randomUUID, unique across courses |
| name | string | Outer whitespace trimmed; 1–100 grapheme clusters |

A course has zero or more assignments. Duplicate names are valid and separately selectable;
UI adds a stable ID suffix where needed. Rename preserves ID and relationships. Confirmed delete
requires zero referencing assignments and must recheck that rule when applying the command.

## Assignment

| Field | Type | Rule |
| --- | --- | --- |
| id | UUID string | Immutable, generated once, unique across assignments |
| courseId | UUID string | Must reference an existing course |
| title | string | Outer whitespace trimmed; 1–200 grapheme clusters |
| description | string | Empty default; at most 2,000 grapheme clusters; preserve entered whitespace |
| dueDate | string | Canonical YYYY-MM-DD, year 0001–9999, real Gregorian date |
| completed | boolean | false for new assignments; no other persisted representation |

Duplicate titles are valid. Dates can be past, today or future. Validate leap years and month
lengths explicitly; never rely on Date auto-normalization. Strings must already meet normalized
name/title rules on load; reject invalid snapshots without silently mutating them.

## Transient state

View is all/upcoming/overdue, default all. Course filter is null (all) or an existing course ID.
Completion filter is all/incomplete/completed, default all. Draft fields, errors, confirmation
selection and storage-load status are memory-only. Course deletion resets its active filter.

## Transitions and invariants

- Course: create -> rename -> confirmed delete only when empty. Cancel changes nothing.
- Assignment: create incomplete -> edit/move -> complete/incomplete repeatedly -> confirmed delete.
- Validate target existence at command time. Repeated/stale deletion yields a no-change message.
- Every accepted mutation passes field and whole-envelope validation, saves once, then publishes.
- Failure preserves prior storage, committed state and drafts; no orphan or partial updates.
- Load accepts only a complete valid envelope; absent key is the sole first-use empty case.
- Upcoming/overdue and filtered lists are computed, not stored. Upcoming is incomplete with date
  >= local today; overdue is incomplete with date < today. AND all predicates.
- Sort date ascending, English collator title ascending, then original assignment array position.
  Editing must not reposition array entries; deleting preserves surviving relative order.

Length counting uses Intl.Segmenter graphemes consistently in UI/rules/storage validation.
Authoritative validation is the domain/save boundary; native form constraints are additional hints.
