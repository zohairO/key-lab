# User Preferences

How the user wants to collaborate on this project.

- **Clarify before building.** For new features or load-bearing decisions, the user wants the idea reflected back and questions asked first. Don't jump into implementation.
- **Smallest-thing-first.** v0 is the minimum that proves the concept. Don't build Phase 2/3/4 features pre-emptively.
- **Concise responses.** Short, direct, no fluff. Answer the question asked.
- **Decisions get recorded.** Architectural decisions → `.claude/rules/architecture.md`. Dated decisions → `.claude/memory/memory-decisions.md`.
- **Correctness over ceremony.** No premature abstractions, no error handling for impossible cases, no "future-proofing" that isn't requested.
- **No em dashes in user-facing writing.** OK in internal prose like this memory system.
- **OK with `Co-Authored-By: Claude` trailer on commits.** Don't strip it; don't ask again.
- **Commit frequently.** Every logical chunk, not batched at the end.
