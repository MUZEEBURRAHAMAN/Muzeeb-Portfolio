# LitBox — Use Cases

Source: litbox-case-study.html (shipped internal-beta product, not a PRD — this repo is a
design portfolio, not an app under construction, so use cases are reverse-derived from the
case study's own described flows rather than a product spec).

Scoping note: Phase 3 (low-fidelity wireframes) is intentionally skipped for this project.
Every screen in these flows already has a real, shipped-product screenshot in the case study
at higher fidelity than a gray-box wireframe could offer — generating wireframes here would be
a regression, not an improvement. State and sequence diagrams are also skipped per use case:
this is a static case-study page, not a client talking to a real backend, so a sequence
diagram would be inventing an API that doesn't exist to document. Flowcharts (Phase 2's
screen-to-screen diagram) are the deliverable that actually matches what the case study needs.

## UC-001: File Request → AutoDoc Auto-Pickup

- **Actors**: Paralegal (internal), External Submitter, AutoDoc (system)
- **Preconditions**: Paralegal has a File Requests destination folder connected to AutoDoc
- **Main Flow**:
  1. Paralegal opens File Requests → Create New Request
  2. Sets title, destination folder, optional deadline + password
  3. Shares the request link via external email
  4. External submitter opens the link — no LitBox account required
  5. Submitter uploads files to the scoped upload page
  6. Files route into the destination folder
  7. If the folder is AutoDoc-connected, AutoDoc picks up and processes automatically
- **Alternate flow**: Destination folder is not AutoDoc-connected → files sit in the folder, no auto-processing (not currently a distinct UI state — noted as an open question)
- **Postconditions**: File is in LitBox, optionally already processed by AutoDoc, with no manual re-upload step

## UC-002: Content Search Across a Matter

- **Actors**: Any LitBox user
- **Preconditions**: AutoDoc has already extracted text from at least one document
- **Main Flow**:
  1. User types into global search
  2. Selects scope: Files/Documents, Folders, or Content
  3. Content tab searches inside AutoDoc-extracted text
  4. Results show source file, exact page, and a highlighted snippet
  5. User opens the source document directly from the result
- **Postconditions**: User reaches the exact page of the exact file without guessing

## UC-003: Permission Denied → Request Access

- **Actors**: LitBox user without folder access, Folder Owner/Admin
- **Preconditions**: User navigates to a folder they are not scoped into
- **Main Flow**:
  1. User opens a restricted folder (e.g. via a shared link or breadcrumb)
  2. Sees a "You don't have access to this folder" state, not a generic 403 or blank page
  3. Clicks Request Access
  4. (Not yet shown further downstream in the shipped product — owner-side approval is a roadmap item)
- **Postconditions**: A denial is explained and actionable, not a dead end

## UC-004: Sharing a File With Per-Person Roles

- **Actors**: File Owner, Named Recipient
- **Preconditions**: Owner has a file to share
- **Main Flow**:
  1. Owner opens Share on a file
  2. Enters a specific person's email or name — not a public-link toggle
  3. Assigns a role: Owner, Editor, or Viewer
  4. Named person appears in the Shared To list with their role visible
- **Postconditions**: Access is scoped to named people with roles, auditable later via the Audit Timeline (UC not modeled separately — it's the record of every use case above, not a use case itself)

## UC-005: E-Signature Launched In Place

- **Actors**: LitBox user, OmnisProof (downstream system)
- **Preconditions**: An open document needs a signature
- **Main Flow**:
  1. User opens a document in LitBox
  2. Clicks "Continue to e-signature"
  3. Hands off directly into OmnisProof's signer setup (general info, signer list, extra fields, distribution)
  4. No export/re-upload step between the two products
- **Postconditions**: Signature workflow begins in OmnisProof with the same document, no manual file handoff

## UC-006: Restore vs. Delete — Two Different Frictions

- **Actors**: LitBox user
- **Preconditions**: A file exists in Trash (restore) or is within its retention window (delete)
- **Main Flow (Restore)**: User selects a trashed file → clicks Restore → file returns immediately, one click, no confirmation friction
- **Main Flow (Delete)**: User selects a file within the retention window → clicks Delete → confirmation step required → file is removed
- **Design intent**: Restore stays quiet because it's reversible; Delete costs a deliberate extra step because it can destroy something sensitive
