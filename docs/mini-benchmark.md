# Your mini-benchmark (don't trust vendor numbers)

There is no SWE-bench for code review — every vendor wins its own benchmark.
The only number you can trust is one you measured on **your** code.

## How to run it

1. Review PR #1 (`exercise/seeded-bugs` → `main`). Find the bugs yourself first.
2. Run each layer against that PR (L2 → L3 → L4, optionally L5).
3. For each bug you found, mark whether each layer **caught** it (✅) or **missed** it (❌).
4. Fill the table below. Keep it honest — a miss is the most useful cell.

## Bugs you found (list before the table)

<!-- Example: 1) GET /api/notes/[id] — any session can read any note (IDOR) -->

## Coverage table (fill in)

| # | Bug (your description) | Class | L2 ESLint/Semgrep | L3 local AI | L4 PR bot | L5 ultra/BugBot | Human |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |

## What to expect (from the research)

- **Layer 2** catches recognizable patterns, **misses authorization logic**.
- **Authorization / IDOR is found poorly** by every layer (kasra.blog: best model
  7/10 on Broken Access Control, OWASP #1). The human row should be the strongest
  on auth bugs.
- AI layers are **non-deterministic** — run twice; results differ.

## Reflection (answer in your PR)

- Which layer gave the best **signal-to-noise** for your bug set?
- Which bug did every automated layer miss, and **why** (what context was needed)?
- Which **metric** would you track to know review is working
  (precision / acceptance / escaped defects / time-to-merge)?
