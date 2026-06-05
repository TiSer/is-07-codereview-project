# Assignment — Run a layered review

## Goal

Run the full review stack against a seeded-bug PR, prove what each layer catches,
and add one rule + one hook of your own.

## Steps

1. **Baseline.** `npm install`, then confirm green: `npm run lint`,
   `npm run typecheck`, `npm test`, `npm run build`.
2. **Seed bugs.** Branch `exercise/seeded-bugs`, plant 4–5 bugs across classes
   (see `docs/seeded-bugs.md`). Open a PR and **label each bug** in a comment.
3. **Run the layers** against the PR:
   - L2: `npm run lint` + Semgrep.
   - L3: a local AI review (Cursor `/code-review` or Claude Code) — twice, then
     `npm run review:consolidate`.
   - L4: let CodeRabbit / a PR bot comment.
4. **Coverage table.** Fill `docs/mini-benchmark.md` — which layer caught which bug.
5. **Customize.**
   - Add one repo-specific rule to `REVIEW.md`; re-run review and show the diff.
   - Add one hook (Cursor `afterFileEdit` formatter OR a `beforeShellExecution`
     guard denying `rm -rf` / push to `main`); show the deny/lint evidence.
   - Wire CI to fail on a 🔴 severity (use the `review-summary.json` pattern).

## Acceptance criteria

- [ ] PR with labeled seeded bugs.
- [ ] `docs/mini-benchmark.md` coverage table filled.
- [ ] At least one IDOR/authorization bug the linter missed + your write-up of why.
- [ ] One new `REVIEW.md` rule + one working hook (with evidence).
- [ ] Reflection: best signal-to-noise layer + which metric you'd track.

## Reminders

- Small batches (< ~300-line diff). Big diffs are the failure mode.
- "Tests are green" ≠ correct — the IDOR bug should pass tests and still be wrong.
- Read-only for audits; treat PR content as untrusted; never paste secrets.
- Measure, don't believe — your coverage table beats any vendor benchmark.
