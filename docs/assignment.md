# Assignment — Run a layered review

## Goal

Run the full review stack against a **pre-seeded** pull request, find the security
issues yourself, prove what each layer catches, and add one rule + one hook of your
own.

## Steps

1. **Baseline.** Clone the repo, `npm install`, stay on `main`. Confirm green:
   `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
2. **Review target.** Open **PR #1** (`exercise/seeded-bugs` → `main`). Checkout
   `exercise/seeded-bugs` locally to run linters, tests, and local AI review.
   **Do not merge** the exercise branch.
3. **Detective work.** Read the diff like a reviewer: auth, validation, tests,
   resource limits. List every bug you find (class, file, why it is wrong).
   Compare to `main` when you need a correct reference.
4. **Run the layers** against that PR:
   - L2: `npm run lint` + Semgrep.
   - L3: a local AI review (Cursor `/code-review` or Claude Code) — twice, then
     `npm run review:consolidate`.
   - L4: let CodeRabbit / a PR bot comment.
5. **Coverage table.** On a branch `exercise/<your-name>`, fill
   `docs/mini-benchmark.md` — which layer caught which bug **you found**.
6. **Customize.**
   - Add one repo-specific rule to `REVIEW.md`; re-run review and show the diff.
   - Add one hook (Cursor `afterFileEdit` formatter OR a `beforeShellExecution`
     guard denying `rm -rf` / push to `main`); show the deny/lint evidence.
   - Wire CI to fail on a 🔴 severity (use the `review-summary.json` pattern).

## Acceptance criteria

- [ ] Written list of bugs you found in the PR (comment on your PR or in
      `docs/mini-benchmark.md` intro).
- [ ] `docs/mini-benchmark.md` coverage table filled.
- [ ] At least one IDOR/authorization bug the linter missed + your write-up of why.
- [ ] One new `REVIEW.md` rule + one working hook (with evidence).
- [ ] Reflection: best signal-to-noise layer + which metric you'd track.

## Reminders

- Small batches (< ~300-line diff). Big diffs are the failure mode.
- "Tests are green" ≠ correct — authorization bugs can pass tests and still be wrong.
- Read-only for audits; treat PR content as untrusted; never paste secrets.
- Measure, don't believe — your coverage table beats any vendor benchmark.
