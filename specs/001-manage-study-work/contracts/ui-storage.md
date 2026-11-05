# UI and Storage Contracts

## Interface presented to the student

| Action | Input | Success | Failure/no change |
| --- | --- | --- | --- |
| Add/edit course | name; ID for edit | Saved course rendered, references renamed | Field error or missing-ID message |
| Delete course | selected ID, confirmation | Empty course removed; filter reset if needed | Populated course blocked with move/delete guidance |
| Add/edit assignment | course, title, description, date; ID for edit | Details saved; new state incomplete | Invalid fields/reference; preserve draft |
| Change completion | assignment ID, boolean target | Saved text status and result membership update | Missing ID/storage error |
| Delete assignment | selected ID, confirmation | Only selected assignment removed | Cancel or missing ID leaves others intact |
| Change view/filters | allowed view/course/status values | Derived list or explicit empty result | No records are modified |
| Retry load/save | retry action | Valid state loaded or candidate saved | Error remains; no automatic reset |

All record-specific controls identify records by immutable ID, never array index or name. Duplicate
courses must be distinguishable. Confirmation identifies the target; cancellation returns focus.
Success is announced only after persistence succeeds. Use textContent for all user-entered text.
Forms retain drafts on failure, associate error text with fields and focus the first invalid input.

## Logical module boundaries

These contracts guide implementation; they are not HTTP endpoints or generated source code.

- UI dispatches a command and displays a result; it never calls localStorage directly.
- Domain command receives committed snapshot plus input and returns a validated candidate or
  field/domain errors without mutating the committed snapshot.
- Selectors receive snapshot, view/filter selection and injected local today, returning sorted
  records without writes. All predicates intersect; clearing filters preserves the current view.
- Storage load returns one of missing, valid(snapshot), inaccessible(error), corrupt(error), or
  unsupportedVersion(version). Missing maps to empty memory state; error states block mutation.
- Storage save validates the full envelope, serializes and replaces `studyplanner:data` once;
  it returns success or failure. app.js publishes only success and retains drafts on failure.
- Storage access, parsing, serialization and writes are guarded. Never call localStorage.clear().

## Persisted format example

```json
{
  "schemaVersion": 1,
  "courses": [
    {"id": "550e8400-e29b-41d4-a716-446655440000", "name": "CIS 285"}
  ],
  "assignments": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "courseId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Architecture review",
      "description": "",
      "dueDate": "2026-11-12",
      "completed": false
    }
  ]
}
```

The [data model](../data-model.md) is authoritative for field types and invariants. There is no
network data API. The deployment interface is static HTTP(S) assets with relative module paths;
planner records stay on the browser's origin. API authentication is not part of this contract.
