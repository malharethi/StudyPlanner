# StudyPlanner Constitution

## Core Principles

### I. Simple, Focused Design

StudyPlanner MUST use the simplest design that meets its documented requirements for courses,
assignments, due dates, and completion status. New dependencies, abstractions, or services MUST
solve a current requirement and have a brief written justification. Speculative features and
infrastructure MUST remain outside the baseline scope. This keeps a college project achievable
and understandable.

### II. Readable, Maintainable Code

Code MUST use descriptive names, consistent formatting, and small functions or modules with clear
responsibilities. Presentation, application rules, and storage access MUST have clear boundaries
without requiring extra services or elaborate frameworks. Shared rules MUST have one authoritative
implementation. Comments MUST explain non-obvious decisions; setup, storage choices, and test
commands MUST be documented so another student can run and maintain the project.

### III. Accessible Screens

Core workflows MUST work with a keyboard and provide visible focus, semantic controls, associated
form labels, and meaningful headings. Text MUST have readable contrast, and status or errors MUST
not rely on color alone. Validation messages MUST identify the affected field and explain how to
correct it. Screens MUST remain usable on narrow displays. Core workflows MUST receive a manual
keyboard and screen-size check before acceptance.

### IV. Validated Input and Reliable Storage

All mutations MUST validate required fields, declared length limits, valid course references,
parseable due dates, and supported completion states before persisting changes. Date handling
MUST define whether a due date is a calendar date or a timestamp and use that meaning consistently.
Validation MUST run at the trusted write boundary; browser checks alone are insufficient when a
server accepts writes. Invalid input MUST produce an actionable error without changing stored data.

The selected storage mechanism MUST preserve accepted data across reloads and normal restarts
within its documented persistence lifetime. Storage failures MUST be surfaced rather than reported
as successful saves. Updates and deletions MUST preserve course-assignment relationships, with
course deletion behavior explicitly defined. Storage limits, reset behavior, and any migration or
recovery procedure needed by the chosen design MUST be documented. No particular database or
hosting platform is mandated.

### V. Tested Core Features

Automated tests MUST cover creating, viewing, editing, and deleting courses and assignments,
recording and displaying due dates, and changing and retaining completion status. Tests MUST
include invalid input, course-assignment relationships, persistence after reload or reopening
storage, and failed writes without false success or corrupted data. Tests MUST assert observable
behavior and use isolated test data. A bug fix affecting a core feature MUST add a regression test.
Testing tools and test volume MUST stay proportionate to the project; exhaustive coverage targets
and enterprise test infrastructure are not required.

## Project Scope and Constraints

The baseline product is a small student web application for managing courses, assignments, due
dates, and completion status. Requirements and designs MUST stay feasible for a college project.
Accounts, notifications, external integrations, and advanced analytics require explicit scope
agreement before inclusion. The project MUST avoid collecting personal information beyond what
its agreed features require.

Architecture proposals and the selected design MUST explain how these principles are satisfied,
including storage, validation, accessibility, and testing decisions. Technology choices MUST favor
familiar, supported tools with a manageable setup. Distributed services and complex deployment
pipelines require a documented need that a simpler design cannot meet.

## Development and Review Workflow

Before implementation, each feature MUST have a short description and observable acceptance
criteria. Design documents MUST identify affected data, validation rules, and failure behavior.
Work MUST proceed in small, reviewable changes tied to those criteria.

Before accepting a change, the author and any assigned reviewer MUST check applicable principles,
run the relevant automated tests, and record results. Changes to core screens MUST also record the
manual accessibility checks described above. Documentation-only changes require consistency and
placeholder checks rather than application tests. Failed checks MUST be resolved before acceptance.
Any proposed exception MUST record its reason, scope, and a concrete corrective action or trigger
for reconsideration, and receive project-maintainer approval before acceptance.

## Governance

This constitution governs StudyPlanner requirements, architecture, implementation, and review.
Conflicting project guidance MUST be corrected to match it. Every feature plan and change review
MUST check compliance; a solo student may perform and record that review without a separate
approval body.

Amendments MUST describe the proposed change, its rationale, and effects on existing work. The
project maintainer MUST approve the amendment, update this document, and identify any affected
plans or guidance requiring follow-up. Use semantic versioning: MAJOR for incompatible principle
removals or redefinitions, MINOR for new principles or materially expanded guidance, and PATCH
for clarifications that do not change obligations. Preserve the original ratification date and
update the last-amended date whenever the constitution changes.

**Version**: 1.0.0 | **Ratified**: 2026-11-05 | **Last Amended**: 2026-11-05
