# ChatGPT Architecture Review

Date: 2026-11-05  
Lab task: 5  
Decision status: Recommendation awaiting the student's architecture choice.

## Reviewed inputs

- [Base architecture](architecture-base.md)
- [Alternative architecture](architecture-alternative.md)
- [Feature specification](../specs/001-manage-study-work/spec.md)
- [Requirements checklist](../specs/001-manage-study-work/checklists/requirements.md)
- [Constitution](../.specify/memory/constitution.md)

This review evaluates the uploaded proposals against the confirmed single-student, same-browser/device scope. It evaluates documentation and proposed behavior. Application performance, accessibility, persistence, and tests have not been demonstrated.

Reviewed source blob identifiers are recorded for reproducibility.

| Input | Git blob SHA |
| --- | --- |
| docs/architecture-base.md | 9562cb382266591e7e9122db7ba73dddd52e421f |
| docs/architecture-alternative.md | 3fcbb2b34f8dce4b14cb7249164b148240fdb685 |
| specs/001-manage-study-work/spec.md | a79bda9db2db0f202aa2806f29d3a672207f5f12 |
| .specify/memory/constitution.md | f92f69b633955473de850a974621d6894978abfe |

## Base architecture review

The base proposes semantic HTML, plain CSS, native JavaScript modules and one localStorage snapshot. UI, application coordination, domain rules, dates and persistence have explicit responsibilities. It fits the constitution's preference for the simplest sufficient design and avoids a production build pipeline.

Its proposed save protocol validates a candidate snapshot, writes courses and assignments together under one key, and publishes success afterward. This addresses relationship integrity and failed-save requirements within the stated single-active-tab scope. Date-only rules, stable sorting, duplicate-record identification, blocked deletion of populated courses and accessible forms are described in enough detail to guide implementation.

The main costs are manual DOM and focus management, synchronous whole-dataset serialization and browser storage limits. Adequacy for 20 courses and 500 assignments remains a measurement target. The proposal's claim of adequacy should remain conditional until SC-002 is tested. Concurrent tabs can overwrite changes, and cleared browser data cannot be recovered under the accepted scope.

Assessment: Recommended for this college project, subject to the consolidation clarifications below and eventual acceptance testing.

## Alternative architecture review

The alternative proposes React components, shared domain functions, a native IndexedDB repository and a Vite build. Its change is substantive. Component rendering and asynchronous transactions alter both presentation and storage design.

The proposal correctly defines transaction completion as the success boundary and specifies current-record checks within the write transaction. It includes stable ordering counters, rollback tests, blocked upgrades, stale startup results and duplicate-submission handling. Keeping reducers pure and persistence in explicit commands gives the design a clear save protocol.

The costs are more dependencies, build setup, component state coordination and database lifecycle/error paths. These add learning and maintenance work for the same functional requirements. Transactional per-record writes are a credible benefit, but the specification supplies no measured workload requiring this stack. Its constitution compliance is conditional on documenting why that added complexity is justified if selected.

Assessment: A feasible alternative with stronger structured-storage capabilities, but less suitable for the current small scope unless the student has a concrete maintenance reason to prefer it.

## Comparison

| Criterion | Base | Alternative |
| --- | --- | --- |
| Required features | Covers the proposed workflows | Covers the same workflows |
| Setup | Native modules and static files | React dependencies and Vite build |
| UI maintenance | Explicit rendering and focus management | Components, drafts and reducer coordination |
| Persistence | One validated serialized snapshot | Transactions across courses, assignments and metadata |
| Save failures | Preserve old snapshot and drafts | Abort transaction and preserve drafts |
| Storage work | Rewrites the full dataset | Writes affected records |
| Additional failure paths | Parse, access, serialization and quota | Also transactions, connections and schema upgrades |
| Deployment | Publish web assets | Build and publish dist assets |
| Data-loss limits | Browser/profile/origin boundaries | Same user-level boundaries |
| College-project fit | Strong fit for simplicity | Requires a stronger dependency justification |

## Requirements coverage

| Requirements | Base evidence | Alternative evidence | Review outcome |
| --- | --- | --- | --- |
| FR-001–FR-004 | Course/assignment models, CRUD rules, confirmation and limits | Components, models and transaction commands | Covered in proposed design |
| FR-005–FR-009 | Calendar-date selectors, intersecting filters, stable array ties | Same selectors with explicit stored order | Covered in proposed design |
| FR-010 | Shared validation before snapshot persistence | Shared validation and in-transaction reference checks | Covered in proposed design |
| FR-011–FR-012 | Restart retention and blocked writes on load failure | Restart retention, abort handling and connection failures | Covered with clarification of post-save UI errors in the base |
| FR-013 | Semantic controls, focus, contrast and narrow-layout checks | Component accessibility requirements and manual checks | Specified, awaiting implementation evidence |
| FR-014 | Browser-local data notice and excluded accounts/sync | Same boundary and exclusions | Covered in proposed design |
| SC-001–SC-006 | Usability, fixture performance, correctness, restart and accessibility test plan | Same thresholds plus transaction/component checks | Planned only, no measured pass claim |

## Findings to resolve during consolidation

### R1 — Clarify deployment scope

The specification's assumptions exclude “deployment,” while the lab requires deployment analysis and both proposals provide deployment procedures. Clarify that actual hosting/publication is outside this documentation exercise while deployment analysis and instructions are required deliverables. Keep this distinction consistent in the selected plan and final documents.

### R2 — Define post-save display failure for the base

The base defines storage success before rendering but does not explicitly distinguish a later render failure from a failed storage write. Add a rule that once setItem succeeds, a later UI error must report that data was saved and the display needs refreshing. Do not automatically retry creation or claim rollback. Include a targeted test scenario. The alternative already states this distinction.

### R3 — Specify handling of the base storage key disappearing during use

The base explains missing-key startup and failed access, but an already-open page can retain an old snapshot after its storage key is removed. Clarify that clearing data requires a reload and that simultaneous editing or developer-tools storage changes are outside normal use. Describe expected reload behavior without adding a cross-tab synchronization feature.

### R4 — Make the acceptance environment concrete before implementation

Both proposals depend on browser features such as Intl.Segmenter and crypto.randomUUID. Record the supported demonstration browser/device and relevant runtime/test-tool versions in the final setup guidance. For now, label unchosen versions and unperformed measurements as pending. Do not describe performance or accessibility as already passing.

### R5 — Clean up documentation status

The constitution contains a temporary sync report with a note requesting removal before committing. Remove that temporary comment during consolidation while preserving the governing principles and version. The checklist's final historical note says no plan was created, although plans now exist. Label that statement as true at requirements-generation time or update it to describe current progress.

## Recommendation and next decision

Choose the base HTML/CSS/JavaScript and localStorage architecture. It covers the current requirements with fewer dependencies and a simpler static deployment process. Retain its module boundaries and whole-snapshot save protocol. Adopt the alternative's explicit post-commit display-failure distinction as a clarification.

The student makes the final selection for lab task 6. After that choice, ChatGPT should provide consolidation instructions covering R1–R5 and the selected requirements, architecture, design and deployment guidance. Codex then executes those instructions for task 7. Preserve both original proposals as comparison evidence.

## Validation performed for this report

Read both complete architecture proposals, the feature specification, constitution and requirements checklist. Compared their stated scope, requirements coverage, persistence boundaries, failure handling and planned validation. No application code was executed and no deployment occurred.
