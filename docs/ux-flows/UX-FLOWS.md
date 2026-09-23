# UX Flows — LitBox (Case Study)

Generated with `ux-flow-designer`, scoped for a design-portfolio case study rather than a
product build. See `use-cases.md` for the scoping note on why Phase 3 (wireframes) and the
per-use-case state/sequence diagrams were skipped.

## Master Screen Map
[diagrams/screen-map.md](diagrams/screen-map.md)

## Screen Inventory

| Screen | Purpose | Real screenshot in case study | Use Cases |
|---|---|---|---|
| Dashboard | Landing/home, storage widget, recent activity | Yes | — |
| My Folders/Files | Browse + manage files | Yes | UC-003 |
| File Requests (list + create) | Request files from external parties | Yes | UC-001 |
| External submitter upload page | No-account upload | Diagrammed only (no separate screenshot) | UC-001 |
| Document Details / Activity | Single-file view, share, e-sign | Yes | UC-004, UC-005 |
| Global Search / Results | Cross-matter content search | Yes | UC-002 |
| Access Denied state | Restricted folder | Yes | UC-003 |
| Trash | Restore/permanently remove | Yes (Restore + Delete modals) | UC-006 |
| Storage Management (admin) | Org storage, quotas | Yes | — |
| Audit Timeline (admin) | Compliance log of every action above | Yes | — |

## Use Case Diagrams

| ID | Name | Flowchart |
|---|---|---|
| UC-001 | File Request → AutoDoc Auto-Pickup | [flow.md](diagrams/uc-001-file-request-autodoc/flow.md) |
| UC-002 | Content Search Across a Matter | [flow.md](diagrams/uc-002-content-search/flow.md) |
| UC-003 | Permission Denied → Request Access | [flow.md](diagrams/uc-003-permission-denied/flow.md) |
| UC-004 | Sharing a File With Per-Person Roles | [flow.md](diagrams/uc-004-share-with-roles/flow.md) |
| UC-005 | E-Signature Launched In Place | [flow.md](diagrams/uc-005-esignature/flow.md) |
| UC-006 | Restore vs. Delete — Two Different Frictions | [flow.md](diagrams/uc-006-restore-delete/flow.md) |

## Where these render live

Unlike a from-scratch product build, this project's actual deliverable is the case study
page itself. All six flowcharts above are rendered in place inside
`litbox-case-study.html`, next to the section of the case study each flow belongs to —
replacing two hand-coded SVG diagrams and adding four new ones — rather than living only as
static Mermaid source files no visitor would ever open.

## Navigation Patterns

- Every-user sidebar nav is flat (no nested menus) — Dashboard, My Folders, Shared with Me,
  Starred/Recent/Trash, File Requests.
- Admin-only tools (Storage Management, Audit Logs) sit in the same sidebar but are a
  separate visual/permission tier, not hidden behind a toggle.
- Two confirmed downstream handoffs leave LitBox entirely: AutoDoc (automatic, no user
  action) and OmnisProof e-signature (one click, "Continue to e-signature").

## Open Questions

- UC-001's non-AutoDoc-connected-folder branch has no distinct UI state shown in the case
  study — flagged as a roadmap gap in the diagram itself.
- UC-003's owner-approval step (after "Request Access" is clicked) isn't shown downstream in
  the shipped product — drawn as a dashed/roadmap node, consistent with the case study's own
  "what's built vs. what's roadmap" framing.

## Figma Export (optional, not run)

Not requested. If wanted later, requires Figma Desktop with Dev Mode MCP Server enabled — see
the skill's `references/figma-integration.md` for the two-step setup.
