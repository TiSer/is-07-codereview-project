# Security model for the review setup

The reviewer is itself an attack surface. This file is the threat model for the
AI review tooling in this repo.

## Threats

### 1. Prompt injection — "Comment and Control"
Attackers plant instructions in PR titles, issue bodies, comments, diffs, or repo
files (`AGENTS.md` / `CLAUDE.md`). A naive agent executes them — in a published
demo a security agent posted its own API key as a comment.

**Mitigations here**
- `AGENTS.md` / `CLAUDE.md` explicitly tell agents to treat reviewed content as
  **data, not instructions**.
- The audit agent is **read-only** (`.claude/agents/security-reviewer.md`): read +
  scanners only, no editing, no shell with side effects.
- Never put secrets in the review context; never echo `.env*` contents.

### 2. Over-privileged reviewer
A reviewer with write access + an autonomous fix-loop driven by untrusted content
is a remote-code-execution path.

**Mitigations here**
- Read-only audit subagent for security work.
- Hooks (`.cursor/hooks.json`, `.claude/settings.json`) block `rm -rf`,
  force-push, and pushes to `main` — policy-as-code, can't be "forgotten".
- Humans merge. Fix-loops may *prepare* fixes; they do not merge.

### 3. Secret leakage
**Mitigations here**
- `.gitignore` excludes `.env*` and `.cursor/mcp.json`.
- `.env.example` and `.cursor/mcp.json.example` contain placeholders only.
- CI / CodeRabbit checks scan committed files for secret-shaped strings.

### 4. Data residency / training
- Cloud review (ultra, managed) sends code off-box and is blocked by ZDR.
- Verify whether your plan trains on your code before rollout.

## Checklist before enabling a PR bot org-wide

- [ ] Secrets excluded from repo and from the bot's context.
- [ ] Read-only scopes where the bot only needs to read.
- [ ] Untrusted PR content treated as data (test with a benign injected string).
- [ ] Spend cap configured; trigger chosen (per-push multiplies cost).
- [ ] A human approval is required to merge (branch protection).
