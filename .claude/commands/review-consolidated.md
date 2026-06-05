---
description: Run two local review passes and consolidate into one deduplicated, ranked list (local review is non-deterministic).
---

Local AI review is non-deterministic — a single pass misses things. Run the
review twice and merge the results.

Steps:

1. Run `/code-review high` on the current diff. Save the findings to
   `review-pass-1.json` (one object per finding: `{severity, file, line, title}`,
   where `severity` is one of `normal` | `nit` | `pre_existing`).
2. Run `/code-review high` again. Save to `review-pass-2.json`.
3. Run: `npm run review:consolidate`
   - It reads `review-pass-*.json`, dedupes by `file:line:title`, ranks by
     severity, writes `review-findings.json` (ranked) and `review-summary.json`
     (`{normal, nit, pre_existing}`).
4. Present the ranked list. Apply `REVIEW.md`: 🔴 first with `file:line` proof,
   max 5 🟡 inline, the rest as a count. End with the tally line and a verdict.

Do NOT auto-fix or merge. The human makes the final decision.
