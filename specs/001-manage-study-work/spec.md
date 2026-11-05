# Feature Specification: Manage Study Work

**Feature Branch**: `main` (existing branch; no branch-creation hook configured)

**Created**: 2026-11-05

**Status**: Requirements consolidated after base architecture selection; application acceptance pending

**Input**: Students can add, edit, and delete courses and assignments; assign titles,
optional descriptions, and due dates; track completion; view upcoming and overdue work;
filter by course and status; and keep information after reopening. User confirmed one student
on the same browser/device, without accounts, login, or synchronization.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Organize Courses (Priority: P1)

As a student, I can maintain courses so my assignments have a clear context.

**Why this priority**: Courses organize all subsequent work.

**Independent Test**: Starting empty, create, view, rename, and delete a course. This provides
course-list value without assignment features.

**Acceptance Scenarios**:

1. **Given** an empty planner, **When** I save a valid course name, **Then** it appears in the list.
2. **Given** a course, **When** I rename it, **Then** its new name appears everywhere referenced
   and its existing assignments stay attached.
3. **Given** an empty course, **When** I confirm deletion, **Then** only that course disappears.
4. **Given** a course with assignments, **When** I request deletion, **Then** deletion is blocked
   with instructions to move or delete assignments first, and all saved data is unchanged.
5. **Given** an edit or deletion prompt, **When** I cancel, **Then** saved data is unchanged.

---

### User Story 2 - Maintain Assignments (Priority: P1)

As a student, I can record assignment details and completion so I know what work remains.

**Why this priority**: Tracking work is the central planner function.

**Independent Test**: With a prepared course, create, inspect, edit, complete, mark incomplete,
and delete an assignment without depending on deadline views or filters.

**Acceptance Scenarios**:

1. **Given** a course, **When** I save a title and due date without a description, **Then** an
   incomplete assignment appears with the selected course and entered details.
2. **Given** an assignment, **When** I edit its title, description, date, or course, **Then** the
   same assignment shows the saved values without duplication or lost relationships.
3. **Given** an assignment, **When** I mark it complete and later incomplete, **Then** each state
   is displayed with text and saved.
4. **Given** an assignment, **When** I confirm deletion, **Then** only that assignment disappears.
5. **Given** a form, **When** I submit missing, invalid, or oversized values, **Then** field-specific
   errors explain corrections, entered values remain available, and saved data is unchanged.
6. **Given** no courses, **When** I try to add an assignment, **Then** I am directed to add a course.

---

### User Story 3 - Find Work by Deadline and Filters (Priority: P2)

As a student, I can find upcoming and overdue work and focus on one course or completion state.

**Why this priority**: These views help prioritize recorded work.

**Independent Test**: Use prepared assignments in two courses, both states, and dates before,
on, and after today; compare every view/filter combination to the known expected results.

**Acceptance Scenarios**:

1. **Given** incomplete work due yesterday, today, and tomorrow, **When** I open upcoming,
   **Then** today and tomorrow appear in date order, and yesterday does not.
2. **Given** that work, **When** I open overdue, **Then** only yesterday appears.
3. **Given** completed work with any date, **When** I open upcoming or overdue, **Then** it is
   excluded but remains available in the all-assignments view.
4. **Given** multiple courses and states, **When** I choose a course and completion filter,
   **Then** results match both selections and the selected view.
5. **Given** no matches, **When** results appear, **Then** an empty message and filter/view
   controls let me broaden the results.
6. **Given** a visible assignment, **When** its course, date, or completion changes, **Then**
   its membership in the current results updates after saving.
7. **Given** active filters, **When** I clear them, **Then** all courses and states are selected
   within the current view. If a filtered course is deleted, its filter resets to all courses.

---

### User Story 4 - Resume Saved Work (Priority: P1)

As a student, I can close and reopen the app without reentering saved information.

**Why this priority**: Retention makes the planner useful between study sessions.

**Independent Test**: Prepare records, save edits and deletions, close the app and browser
normally, and reopen in the same browser profile to compare the exact saved state.

**Acceptance Scenarios**:

1. **Given** successful saves, **When** I reload or close and reopen the app/browser, **Then**
   course names, assignment details, relationships, dates, states, and deletions are retained.
2. **Given** a failed save, edit, or deletion, **When** the operation ends, **Then** I see an
   actionable failure rather than success, prior saved data is unchanged, and I can retry.
3. **Given** saved data cannot be read, **When** I open the app, **Then** a failure and retry
   guidance appear; existing information is not silently replaced by empty data.
4. **Given** normal use, **When** I inspect the app's data-retention explanation, **Then** it
   explains that data belongs to this browser profile/device and clearing app data can remove it.

### Edge Cases

- Whitespace-only names/titles fail; empty descriptions are valid. Outer name/title whitespace is trimmed.
- Course names of 100 characters, titles of 200, and descriptions of 2,000 are accepted;
  one character beyond each limit is rejected without truncation or partial saving.
- Duplicate names/titles are allowed; distinct records remain separately selectable and editable.
- Impossible dates, including non-leap-year February 29, fail; valid past dates are accepted.
- Today is upcoming, not overdue. At midnight classification changes on the next opening or
  refreshing of a view. Timezone changes do not change stored calendar dates.
- Equal due dates sort by title, then stable record order for equal titles.
- Completing overdue work removes it from overdue; marking it incomplete returns it.
- Selecting completed status in upcoming/overdue produces an explicit empty result.
- A stale form referencing a removed course or assignment fails with refresh/reselection guidance;
  it cannot create orphan assignments or recreate deleted records.
- Canceling changes never modifies saved records. Repeating a deletion never deletes another record.
- Full or unavailable storage produces a visible failure and preserves prior accepted data.
- An empty planner explains how to add a course; an empty course explains how to add work.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST list, create, and rename courses with a required name of 1–100
  characters after trimming outer whitespace (Story 1).
- **FR-002**: Course and assignment deletion MUST require confirmation. Course deletion MUST
  succeed only when it has no assignments; otherwise the app MUST explain how to move or delete
  its assignments first. Canceling MUST preserve data (Stories 1–2).
- **FR-003**: Students MUST be able to create, view all details of, edit, and delete individual
  assignments. Each MUST belong to exactly one existing course; editing MUST allow moving it
  to another existing course (Story 2).
- **FR-004**: Each assignment MUST have a trimmed title of 1–200 characters, an optional description
  of at most 2,000 characters, a valid calendar due date, and completed/incomplete status. New
  assignments MUST default to incomplete; oversized input MUST be rejected without truncation
  (Story 2; boundary edge cases).
- **FR-005**: Due dates MUST be calendar dates without times. Past dates MUST be accepted. Overdue
  MUST mean incomplete and due before the current local date; upcoming MUST mean incomplete
  and due today or later without an upper horizon. Classification MUST refresh when opening or
  refreshing a view, and stored dates MUST remain unchanged across timezone changes (Story 3).
- **FR-006**: Students MUST be able to mark an assignment completed or incomplete and see and
  retain the selected state with a textual status cue (Stories 2–4).
- **FR-007**: The app MUST offer all-assignments, upcoming, and overdue views. The initial view
  MUST be all assignments, including both states. Results MUST sort by ascending due date,
  ascending title, and stable record order for ties (Story 3; ordering edge case).
- **FR-008**: Every assignment view MUST offer one-course/all-courses and all/incomplete/completed
  filters combined by intersection with the view. Defaults MUST be all courses and all states.
  Users MUST be able to clear both filters (Story 3).
- **FR-009**: Results MUST reflect saved changes, explain empty states, and reset a deleted-course
  filter to all courses (Stories 1–3).
- **FR-010**: Before saving any change, the app MUST validate required fields, length limits,
  real calendar dates, supported states, and existing record references. Invalid input MUST show
  field-specific corrections, retain entered form values, and leave saved data unchanged
  (Story 2; boundary/stale-form edge cases).
- **FR-011**: Successfully saved course and assignment data, including edits, relationships,
  completion, and deletions, MUST survive normal reloads and closing/reopening the app and browser
  in the same browser profile/device until explicitly deleted or that profile's app data is
  cleared (Story 4).
- **FR-012**: Failed reads/writes MUST show an actionable error with retry guidance, without false
  success, silent data resets, or partially saved changes. Repeated deletion MUST leave other
  records intact (Story 4; storage/repeated-deletion edge cases). Once saving succeeds, a later
  display failure MUST state that data was saved and the display needs refresh. It MUST NOT
  claim rollback or automatically repeat creation.
- **FR-013**: All core workflows MUST work by keyboard with visible focus, meaningful headings,
  semantic controls, associated form labels, and text cues for errors and status. Normal text
  MUST meet 4.5:1 contrast. At 320 CSS pixels wide, core screens MUST retain all content and
  actions without horizontal page scrolling (all stories; SC-005).
- **FR-014**: The app MUST explain the browser-profile/device persistence boundary and the risk
  of removal when app data is cleared. Accounts, login, and device syncing MUST remain outside
  this feature (Story 4; confirmed scope).

### Key Entities *(include if feature involves data)*

- **Course**: A separately identifiable course with a required name and zero or more assignments.
  Renaming preserves identity; deletion requires no assignments.
- **Assignment**: A separately identifiable task with exactly one course, title, optional
  description, calendar due date, and completion state. Duplicate titles do not merge records.
- **View selection**: Current assignment view, course selection, and completion selection.
  It controls visibility without changing assignment data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least four of five students unfamiliar with the app independently create a course
  and assignment within two minutes, then edit its date, toggle completion, and delete the
  assignment within two further minutes, without assistance.
- **SC-002**: With 20 courses and 500 assignments, opening a view or changing filters displays
  correct results within two seconds in at least 19 of 20 trials on the documented college-project
  demonstration device/browser.
- **SC-003**: A fixture covering yesterday/today/tomorrow, both states, two courses, and equal due
  dates produces exactly expected membership and ordering for every view/filter combination,
  including after edits and clearing filters; no incorrect inclusions or omissions are accepted.
- **SC-004**: Across ten normal close/reopen cycles, 100% of successfully saved values,
  relationships, states, edits, and deletions match the pre-close state. Invalid-input and forced
  read/write-failure checks yield zero false-success messages or lost prior saved records.
- **SC-005**: Every core workflow passes keyboard-only and 320-pixel-width checks. Every input has
  an associated label, every control has visible focus, all errors/states have text cues, and
  all normal text meets 4.5:1 contrast.
- **SC-006**: Before feature acceptance, automated behavioral checks pass for course/assignment
  create, read, edit, delete, dates, completion, filtering, relationships, boundaries, reopening,
  and failed writes. Manual usability/accessibility results are recorded. Each core-feature bug
  fix includes a passing regression check, as required by constitution v1.0.0.

## Assumptions

- User-confirmed scope: one student, same browser/device; no accounts, login, shared access,
  or syncing. Separate browser profiles have separate information.
- Course name is the only course detail. Duplicate names and titles are allowed, with separately
  selectable records. Lengths count user-perceived characters; demonstration title ordering is English.
- Date-only deadlines, upcoming from today onward, and blocked deletion of populated courses
  are simple defaults. Moving assignments uses editing; bulk deletion and undo are excluded.
- Normal persistence uses a standard browser profile. Clearing data, private-browsing retention,
  device loss, and browser eviction are outside the guarantee. Backup, export/import, recovery
  after cleared data, and simultaneous cross-tab conflict resolution are excluded.
- View/filter choices need not persist after reopening; saved course and assignment records do.
- Reminders, attachments, recurring assignments, grades, analytics and integrations are excluded.
  Deployment analysis and instructions are required; actual hosting/publication is outside this
  documentation exercise. No third-party service is a requirements dependency.
- Acceptance requires a browser/device permitting retained app data and a known local date.
  Architecture, storage technology, setup, storage limits/reset behavior, and any migration or
  recovery procedure are documented in the selected planning and final design documents.
- No important unresolved choices remain following the user's scope confirmation. These explicit
  defaults may be amended before planning if requested.

## Consolidation clarifications

The student selected the base architecture; implementation details remain in the
[plan](plan.md) and [final design](../../docs/design-final.md), preserving this document's
technology-independent requirements. Deployment analysis and instructions are required;
actual hosting/publication is outside this documentation exercise.

Story 4 additional acceptance scenarios:

5. **Given** a successful save, **When** rendering then fails, **Then** the app reports that
   data was saved and the display needs refresh; it does not retry creation or claim rollback.
6. **Given** deliberate manual clearing of the app's stored data, **When** the student reloads
   the app, **Then** the missing data produces an empty planner. Reload is required after clearing.

Manual browser-storage changes during use and concurrent editing are outside normal use. An
open page can retain an old in-memory snapshot; it must be reloaded after deliberate clearing.
Supported browser capabilities and the pending demonstration environment are recorded in
[quickstart](quickstart.md). Exact versions, measurements and application tests remain pending;
SC-001–SC-006 are acceptance targets, not passed results.
