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

## Do the workshop

1. Read `REVIEW.md` (review rules) and `docs/process.md` (policy).
2. Follow `docs/assignment.md`: seed bugs (`docs/seeded-bugs.md`), run the layers,
   fill the coverage table (`docs/mini-benchmark.md`), add a rule + a hook.

## Hooks

- **Cursor**: `.cursor/hooks.json` — auto-lint on edit, deny dangerous shell.
- **Claude Code**: `.claude/settings.json` — same idea via `PostToolUse` /
  `PreToolUse`. See `.claude/agents/security-reviewer.md` for the read-only audit
  subagent and `.claude/commands/` for the consolidating review command.

## Security

The reviewer is an attack surface — see `docs/security.md` (prompt injection,
over-privileged reviewers, secret leakage).
