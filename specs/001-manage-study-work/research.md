# Research: StudyPlanner Base Design

Date: 2026-11-05. All design questions resolved; no clarification blockers remain.
The installed plan workflow's research-agent step was used for storage/date/character semantics.

## Static native web application

**Decision**: HTML/CSS/native JavaScript modules; a static host serves `web/` only.
**Rationale**: Matches requested stack, single-student scope and constitution simplicity gate.
**Alternatives considered**: Framework/bundler adds runtime/build dependencies; backend accounts
and database add operations outside scope. Static deployment may use a dedicated publish branch.
[GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
documents branch-root publishing. Deployment is documented, not performed.

## Snapshot storage and failed writes

**Decision**: One key `studyplanner:data` with schemaVersion 1 and both entity arrays. Validate
and serialize a candidate before setItem; publish state/success only after the call succeeds.
**Rationale**: Avoid partial relationships from multiple-key writes; catch denied storage and
quota errors. Origin-scoped retention supports normal reopening but is not backup. Preserve raw
corrupted/unsupported data and block writes; this follows FR-010–FR-012.
**Alternatives considered**: Separate keys complicate multi-entity commits; IndexedDB adds
asynchronous schema/transaction machinery for modest data; server persistence exceeds scope.
[WHATWG Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html) defines storage
access, failure behavior and origin boundaries. No multi-tab transaction guarantee is assumed.

## Calendar dates

**Decision**: Canonical YYYY-MM-DD strings, real Gregorian date validation, local calendar today.
**Rationale**: Lexical date comparison is sufficient; avoid timestamp conversions changing the
student's chosen date. [ECMAScript Date.parse](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.parse)
defines date-only parsing's UTC behavior. Upcoming includes today without a future limit.
**Alternatives considered**: Timestamps need unspecified deadline time/timezone; date libraries
are unnecessary for date-only validation and comparisons.

## Character limits and identifiers

**Decision**: Intl.Segmenter grapheme counting; crypto.randomUUID identifiers; stable array order
for final sort ties, Intl.Collator('en') for titles. Target current browsers supporting these APIs.
**Rationale**: Specification limits count user-perceived characters, not UTF-16 code units.
[ECMA-402 Segmenter](https://tc39.es/ecma402/#segmenter-objects) provides grapheme segmentation.
**Alternatives considered**: String.length/native maxlength can reject valid grapheme-length
input; hand-maintained grapheme parsing adds maintenance risk. Never use names as entity IDs.

## Testing tools

**Decision**: Node 24 LTS built-in runner for pure rules/adapter faults and Playwright for browser
flows; manual accessibility/usability acceptance. Lock exact package versions at implementation.
**Rationale**: No test-framework dependency needed for unit checks; browser automation validates
real storage and DOM behavior. See [Node test runner](https://nodejs.org/api/test.html) and
[Playwright web server configuration](https://playwright.dev/docs/test-webserver).
**Alternatives considered**: Manual-only testing misses regressions; a large component testing
stack has little value for five native modules. Browser restart tests require retained profiles.

## Consolidation decisions after architecture selection

**Decision**: The student selected native HTML/CSS/JavaScript, localStorage and static hosting.
[Decision record](../../docs/architecture-decision.md) explains why React/IndexedDB was not selected.
**Rationale**: Fewer dependencies and simpler setup meet the current single-student scope.

**Decision**: Separate pre-save failures from post-save display failures. Once setItem succeeds,
the candidate remains committed; report later rendering errors as needing refresh, block further
mutations until refresh/reload, and never retry creation automatically or claim rollback.
**Rationale**: A display error cannot reverse an already successful persistent write (R2).

**Decision**: Manual storage clearing requires reload; missing key at load means an empty planner.
Concurrent editing/developer-tools changes during use remain outside normal use (R3).
**Rationale**: There is no live synchronization of the in-memory snapshot with external edits.

**Decision**: Require deployment analysis and instructions; exclude actual hosting/publication
from this documentation exercise (R1). Record browser API requirements and pending exact
browser/device, Node/npm and test-tool versions in [quickstart](quickstart.md) (R4).
**Rationale**: Proposed support and targets are not verification results. All application tests,
performance, persistence and accessibility measurements remain pending. No new external research
or runtime verification was performed during consolidation.
