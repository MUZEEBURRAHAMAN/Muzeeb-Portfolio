# UC-006: Restore vs. Delete — Two Different Frictions

```mermaid
graph TD
    A[User selects a file] --> B{Where is it?}
    B -->|In Trash| C[Click Restore]
    C --> D[File returns\nimmediately — 1 click]
    B -->|Active, within\nretention window| E[Click Delete]
    E --> F{Confirm deletion?}
    F -->|Cancel| G[File stays]
    F -->|Confirm| H[File removed]

    classDef userStep fill:#eef2ff,stroke:#3353f8,color:#111c53
    classDef systemStep fill:#ecfdf5,stroke:#22c55e,color:#0b4a2e
    classDef decision fill:#fff7ed,stroke:#f59e0b,color:#7c2d12
    classDef danger fill:#fef2f2,stroke:#ef4444,color:#7f1d1d
    class A,C,E,G userStep
    class D systemStep
    class B,F decision
    class H danger
```

**Design intent, drawn on purpose**: Restore (left branch) is one click, no gate. Delete
(right branch) has a deliberate confirm gate — the case study's stated reason is "nothing
sensitive disappears silently."
