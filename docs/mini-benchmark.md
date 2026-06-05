# Your mini-benchmark (don't trust vendor numbers)

There is no SWE-bench for code review — every vendor wins its own benchmark.
The only number you can trust is one you measured on **your** code.

## How to run it

1. Create a branch and seed 4–5 bugs across classes (see `docs/seeded-bugs.md`).
2. Open a PR. Run each layer against it.
3. For each seeded bug, mark whether each layer **caught** it (✅) or **missed** it (❌).
4. Fill the table below. Keep it honest — a miss is the most useful cell.

## Coverage table (fill in)

| # | Seeded bug | Class | L2 ESLint/Semgrep | L3 local AI | L4 PR bot | L5 ultra/BugBot | Human |
|---|---|---|---|---|---|---|---|
| 1 | other user's note readable (`GET` skips `isOwner`) | Broken Access Control / IDOR | ❌ | ? | ? | ? | ✅ |
| 2 | owner taken from `body.ownerId` on `POST` | IDOR (write) | ❌ | ? | ? | ? | ✅ |
| 3 | `PATCH` skips Zod, raw JSON into store | Validation gap | ❌ | ? | ? | ? | ✅ |
| 4 | unbounded `limit` (removed `.max(100)`) | Resource / DoS | ? | ? | ? | ? | ✅ |
| 5 | tests edited to expect wrong owner / 200 on IDOR | Process / wrong fix | ❌ | ? | ? | ? | ✅ |

## What to expect (from the research)

- **Layer 2** catches recognizable patterns, **misses authorization logic**.
- **Authorization / IDOR is found poorly** by every layer (kasra.blog: best model
  7/10 on Broken Access Control, OWASP #1). The human row should be the strongest
  on bugs #1, #2, #5.
- AI layers are **non-deterministic** — run twice; results differ.

## Reflection (answer in your PR)

- Which layer gave the best **signal-to-noise** for your bug set?
- Which bug did every automated layer miss, and **why** (what context was needed)?
- Which **metric** would you track to know review is working
  (precision / acceptance / escaped defects / time-to-merge)?
