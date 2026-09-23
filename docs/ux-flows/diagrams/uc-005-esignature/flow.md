# UC-005: E-Signature Launched In Place

```mermaid
graph TD
    A[User opens a document\nin LitBox] --> B{Needs a\nsignature?}
    B -->|No| C[Normal document view]
    B -->|Yes| D[Click "Continue\nto e-signature"]
    D --> E[Hands off into\nOmnisProof — same document]
    E --> F[Signer setup: general info,\nsigner list, extra fields]
    F --> G[Distribution]

    classDef userStep fill:#eef2ff,stroke:#3353f8,color:#111c53
    classDef systemStep fill:#ecfdf5,stroke:#22c55e,color:#0b4a2e
    classDef decision fill:#fff7ed,stroke:#f59e0b,color:#7c2d12
    class A,D userStep
    class E,F,G systemStep
    class B decision
```

**No export/re-upload step** — this is the one line worth keeping visible: node D → E is a
direct handoff, not a round trip through a downloaded file.
