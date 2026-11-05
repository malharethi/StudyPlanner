# Architecture Decision: Select the Base

Date: 2026-11-05. Status: selected by the student for CIS 285 Lab 7.

The student selected HTML, CSS, native JavaScript modules, localStorage and static hosting.
The [base proposal](architecture-base.md) meets the single-student, same-browser/device scope
with fewer dependencies and simpler setup. It needs no runtime framework, application server,
production bundler or database lifecycle. This best fits the constitution's simplest-sufficient
design rule and the current college-project requirements.

The [React/IndexedDB alternative](architecture-alternative.md) offers component rendering and
record-level transactions, but adds dependencies, a build, asynchronous transaction handling and
schema/connection management. No measured workload or current requirement justifies that extra
complexity. It remains a feasible comparison, not the chosen implementation.

Accepted limitations: explicit DOM/focus management, synchronous whole-snapshot saves, finite
browser quota, one active editor, origin/profile/device-bound data, and no recovery after clearing,
eviction or device loss. Offline startup, accounts, syncing, backups and export/import remain
outside scope. Adequacy at 20 courses/500 assignments is a pending measurement, not a demonstrated
result. A later scope change can prompt a new decision; this decision does not migrate data.

The [review](architecture-review.md) is preserved as written. Its awaiting-choice status is
historical. R1–R5 are resolved in [final architecture](architecture-final.md),
[final design](design-final.md) and the updated Spec Kit documents:

| Finding | Resolution |
| --- | --- |
| R1 | Deployment analysis/instructions required; actual hosting/publication outside exercise |
| R2 | Successful save followed by display failure needs refresh; no rollback or automatic retry |
| R3 | Manual clearing requires reload; missing key then gives empty planner; no concurrent editing |
| R4 | Explicit browser/API requirements; versions and application measurements/tests pending |
| R5 | Temporary constitution report removed, version preserved; checklist history updated |

Only documentation is completed. Original proposals/review remain comparison evidence; the final
architecture/design and updated Spec Kit documents govern the selected design.
