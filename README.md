# StudyPlanner

CIS 285 Lab 7 — Architecture and Design

StudyPlanner is a proposed small student web application for courses, assignments, due dates
and completion. The student selected HTML, CSS, native JavaScript modules, localStorage and static
hosting for one student using the same browser profile/device. Saved data must survive normal
restarts. This repository currently documents the design; application acceptance remains pending.

## Requirements and governance

- [Project constitution](.specify/memory/constitution.md)
- [Feature specification](specs/001-manage-study-work/spec.md)
- [Requirements quality checklist](specs/001-manage-study-work/checklists/requirements.md)

## Architecture comparison and selection

- [Original base architecture](docs/architecture-base.md)
- [Original React/IndexedDB alternative](docs/architecture-alternative.md)
- [ChatGPT architecture review](docs/architecture-review.md)
- [Student architecture decision](docs/architecture-decision.md)
- [ChatGPT consolidation instructions](docs/consolidation-instructions.md)
- [Final architecture](docs/architecture-final.md)
- [Final detailed design](docs/design-final.md)

Both proposals and the review are preserved historical evidence. The review's awaiting-choice
status refers to its original publication; the decision/final documents record the subsequent
selection and resolution of R1–R5.

## Selected Spec Kit planning documents

- [Implementation plan](specs/001-manage-study-work/plan.md)
- [Research decisions](specs/001-manage-study-work/research.md)
- [Data model](specs/001-manage-study-work/data-model.md)
- [UI/storage contracts](specs/001-manage-study-work/contracts/ui-storage.md)
- [Quickstart, environment and validation guide](specs/001-manage-study-work/quickstart.md)

Deployment analysis and instructions are required; actual hosting/publication is outside this
documentation exercise. No application code, test suite, package installation or deployment is
part of consolidation. Document checks cover consistency, links and placeholders; they do not
prove application behavior. Exact environment versions, all application tests and measurements
remain pending, including performance, persistence, accessibility and usability acceptance.
