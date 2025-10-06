# Week 7 Overview – Client-Side Persistence & Local Datastores

This week we move beyond purely in‑memory React state and learn strategies for **persisting data across page reloads and sessions** without deploying a remote cloud database.

## Learning Objectives
By the end of the week students should be able to:
- Explain the difference between ephemeral state, persistent local state, and persistent remote state. 
- Use localStorage for simple key/value persistence in React apps.
- Run an SQL server from your codespace to handle persistent data storage.
  - Connect to it from a React frontend.
- A new development approach:
  - spec-based rather than test-based development. (Copilot isn't good enough at test-based development with React)


## This Week's File Map
- `persistent_storage.md` – Main lecture notes
- `react_survey_app/` – Full‑stack example app (React + Node + SQLite).
    - "frontend-persistence" branch has implementation of localStorage, without full backend.
    - "main" branch has full backend with SQLite.


## Recommended Sequence
1. Read `persistent_storage.md` slides 1-9 and work through it using the "frontend-persistence" branch of the example app.
2. Read the rest of the slides and work through the backend setup using the "main" branch.

