# Consolidate review

Run two local review passes and merge them into one deduplicated, ranked list,
because a single local review pass is non-deterministic and misses findings.

1. Review the current diff with a code-review mindset (correctness, security,
   missing tests). Write each finding to `review-pass-1.json` as
   `{ "severity": "normal"|"nit"|"pre_existing", "file": "...", "line": N, "title": "..." }`.
2. Review the diff a second time. Write to `review-pass-2.json`.
3. Run `npm run review:consolidate` to dedupe + rank into `review-findings.json`
   and emit `review-summary.json` (`{normal, nit, pre_existing}`).
4. Present the ranked list following `REVIEW.md` (🔴 first with `file:line`, max 5
   🟡 inline, tally line, verdict). Do not auto-fix or merge — the human decides.
