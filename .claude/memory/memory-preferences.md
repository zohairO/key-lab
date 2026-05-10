# User Preferences

How the user wants to collaborate on this project.

- **Clarify before building.** For new features or load-bearing decisions, the user wants the idea reflected back and questions asked first. Don't jump into implementation.
- **Smallest-thing-first.** v0 is the minimum that proves the concept. Don't build Phase 2/3/4 features pre-emptively.
- **Concise responses.** Short, direct, no fluff. Answer the question asked.
- **Decisions get recorded.** Architectural decisions → `.claude/rules/architecture.md`. Dated decisions → `.claude/memory/memory-decisions.md`.
- **Correctness over ceremony.** No premature abstractions, no error handling for impossible cases, no "future-proofing" that isn't requested.
- **No em dashes in user-facing writing.** OK in internal prose like this memory system.
- **No `Co-Authored-By: Claude` trailer on commits.** User explicitly does not want AI co-authorship attribution. Don't add it; don't ask again.
- **Commit frequently.** Every logical chunk, not batched at the end.
- **Design language: workshop tooling, not consumer-premium.** UI surfaces should feel like a tool on the same desk as the hardware — solid dark panels, sharp typography, hairline borders, no glass/lensing/refraction. No Apple Liquid Glass aesthetic. The product is *enthusiasts building their own thing*, not *consumers being marketed to*. **Why:** the user's product POV — KeyboardLab is a workshop, not a showroom. **How to apply:** when adding new UI, default to opaque dark panels (`#0e0e10`-ish), 1px hairline borders (`#27272a`-ish), 8–10px corner radius (not pill-shaped), all-caps muted-grey section headers, sharp sans-serif type, 2px accent rail for selection, monochrome hairline icons. Avoid backdrop-blur, gradients, glow effects beyond the keypress emissive, and anything that reads as "iOS Control Center."
