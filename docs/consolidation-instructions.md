# ChatGPT Consolidation Instructions Following the Student's Decision

Date: 2026-11-05. Lab 7 consolidation instructions supplied by the student for execution by Codex.
Student decision: select the base HTML/CSS/native JavaScript modules, localStorage and static hosting.

Read the constitution, feature specification, requirements checklist, existing planning/design
artifacts, both architecture proposals and ChatGPT's architecture review before consolidation.

1. Create docs/architecture-decision.md recording the student's base choice, simpler setup and
   fewer dependencies, accepted limitations, and why React/IndexedDB was not selected.
2. Save these instructions as docs/consolidation-instructions.md, identified as ChatGPT's
   instructions following the student's decision.
3. Update the specification, implementation plan, research decisions, data model, UI/storage
   contracts and quickstart so they consistently describe the selected base design.
4. Resolve review findings R1–R5:
   - Require deployment analysis/instructions while leaving actual hosting/publication outside
     this documentation exercise.
   - Distinguish failed writes from display errors after a successful save. Once storage succeeds,
     later display errors need refresh; never automatically repeat creation or claim rollback.
   - Manual clearing requires reload; missing key on reload produces an empty planner. Concurrent
     editing and developer-tools storage changes during use remain outside normal use.
   - Document browser/runtime requirements and mark unverified versions, measurements and
     application tests pending.
   - Remove only the constitution's temporary sync report, preserving principles/version; update
     the checklist's historical planning note.
5. Create docs/architecture-final.md and docs/design-final.md covering components, Mermaid,
   models, validation, dates, filtering, persistence, failures, accessibility, testing and
   deployment instructions. Keep shared rules consistent with Spec Kit documents.
6. Preserve both original proposals and the ChatGPT review as comparison evidence.
7. Link requirements, both proposals, review, decision, these instructions and final documents
   from README.md.
8. Check consistency, relative links and unresolved placeholders. Separate completed document
   checks from pending application tests. Summarize changed files and remaining issues.

Complete documentation only; do not implement, install dependencies, run application tests,
create hosting configuration or publish a site as part of this exercise.
