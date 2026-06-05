# The review process (Layer 1 — policy)

Tools don't rescue a bad process. This is the policy layer that everything else
sits on. Adapt the numbers to your team.

## Rules of the game

| Rule | This repo's default |
|---|---|
| Max PR size | ~300 lines of diff (soft cap; bigger PRs get split) |
| Who is the backstop | a human reviewer (the tech lead) — final approve |
| What blocks merge | red CI (lint/typecheck/test/build) + any 🔴 severity finding |
| Branch protection | `main` requires green CI + 1 human approval (configure in GitHub) |
| Trigger for AI review | local before commit (always) + PR bot (auto) + ultra (critical PRs) |

## The layered flow

1. **Layer 2 — static, first.** `npm run lint`, `npm run audit` (npm audit),
   Semgrep. Deterministic, seconds, free. Fix these before asking an AI anything.
2. **Layer 3 — local AI, before commit.** Run a local review (Cursor `/code-review`
   or Claude Code). For non-trivial diffs, run it **twice** and consolidate
   (`npm run review:consolidate`) — single passes are non-deterministic.
3. **Layer 4 — PR bot.** CodeRabbit / Copilot comment automatically. Read
   `.coderabbit.yaml` to see what it checks.
4. **Layer 5 — cloud fleet.** `/code-review ultra` or Cursor BugBot on critical /
   large PRs only (cost + latency).
5. **Human.** Verify intent and business logic — the part automation misses.
   The human makes the final merge decision. **Agentic ≠ unattended.**

## Making non-blocking review blocking

Most bots leave a neutral check. To gate merge, parse the severity breakdown in
CI and fail on 🔴. See `.github/workflows/ci.yml` (the "review severity gate"
step) and `scripts/consolidate-review.mjs` which emits `review-summary.json`:

```json
{ "normal": 0, "nit": 3, "pre_existing": 1 }
```

`normal > 0` ⇒ fail the job. Add the job as a required status check + branch
protection.

## Governance reminders (for leads)

- Verify whether your plan **trains on your code**; enterprise plans usually
  exclude it. ZDR blocks cloud features (ultra, managed).
- Watch **spend** — consumption billing explodes; per-push triggers multiply cost.
- Treat the reviewer as an **attack surface** — read-only audit agents, no secrets
  in context, untrusted PR content handled carefully.
