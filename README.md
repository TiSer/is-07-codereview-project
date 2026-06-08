# is-07-codereview-project

Day 7 reference for **Code Review with AI in Agentic Development**. A clean,
correct Next.js 16 notes API that exists to be **reviewed** — with the full
5-layer review pyramid wired and runnable.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm test
npm run build
```

All of lint / typecheck / test / build are green on `main`.

## What's wired (the 5-layer pyramid)

| Layer | What | Where |
|---|---|---|
| 1 — Process | rules of the game, severity, gating | `docs/process.md`, `REVIEW.md` |
| 2 — Static | ESLint + Semgrep + CodeQL | `eslint.config.mjs`, `semgrep.yml`, `.github/workflows/codeql.yml` |
| 3 — Local agents + hooks | review rules, hooks, security subagent, consolidate | `REVIEW.md`, `.cursor/hooks.json`, `.claude/`, `scripts/` |
| 4 — PR bots | CodeRabbit + Copilot | `.coderabbit.yaml`, `.github/copilot-instructions.md` |
| 5 — Cloud fleets | `/code-review ultra`, BugBot (docs) | `docs/process.md` |

## The app under review

A tiny notes API. Demo auth via `Authorization: Bearer demo:<userId>`.

| Method | Path | Auth |
|---|---|---|
| GET | `/api/health` | public |
| GET / POST | `/api/notes` | session |
| GET / PATCH / DELETE | `/api/notes/[id]` | owner-only (IDOR guard) |

The interesting review surface is authorization (`lib/notes.ts` `isOwner`,
`requireOwnedNote` in `[id]/route.ts`) — logic a linter can't reason about.

## Assignment

Slides: [koldovsky.github.io/is-07-codereview-slidev](https://koldovsky.github.io/is-07-codereview-slidev/)

`main` is the **correct** reference app. The exercise is a **pre-seeded PR** with
hidden issues — your job is to find them, not to plant new ones.

### 1. Baseline (on `main`)

```bash
git clone https://github.com/koldovsky/is-07-codereview-project.git
cd is-07-codereview-project
npm install
npm run lint && npm run typecheck && npm test && npm run build
```

All four must be green on `main`.

### 2. Review target — PR #1

Open [PR #1](https://github.com/koldovsky/is-07-codereview-project/pull/1)
(`exercise/seeded-bugs` → `main`). Checkout the branch locally to run tools:

```bash
git fetch origin exercise/seeded-bugs
git checkout exercise/seeded-bugs
```

**Do not merge** `exercise/seeded-bugs` into `main`.

Read the diff like a reviewer: auth, validation, tests, resource limits. Compare
to `main` when you need the correct behavior.

### 3. Run the review layers

| Layer | What to run |
|---|---|
| L2 | `npm run lint` + `npx semgrep --config semgrep.yml` |
| L3 | Local AI review (Cursor `/code-review` or Claude Code) — **twice**, then `npm run review:consolidate` |
| L4 | Let CodeRabbit / Copilot comment on PR #1 |

### 4. Submit your work

On a branch `exercise/<your-name>` (from `main`):

1. Fill `docs/mini-benchmark.md` — bugs **you found** × which layer caught them.
2. Add one rule to `REVIEW.md` and one hook (see `.cursor/hooks.json` examples).
3. Open **your** PR with the coverage table + reflection.

Full steps and acceptance criteria: [`docs/assignment.md`](docs/assignment.md).

Also read `REVIEW.md` (review rules) and `docs/process.md` (policy).

## Hooks

- **Cursor**: `.cursor/hooks.json` — auto-lint on edit, deny dangerous shell.
- **Claude Code**: `.claude/settings.json` — same idea via `PostToolUse` /
  `PreToolUse`. See `.claude/agents/security-reviewer.md` for the read-only audit
  subagent and `.claude/commands/` for the consolidating review command.

## Security

The reviewer is an attack surface — see `docs/security.md` (prompt injection,
over-privileged reviewers, secret leakage).
