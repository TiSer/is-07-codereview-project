# Seeded-bug exercise

`main` is intentionally **clean and correct**. To run a meaningful review you
create a branch and plant bugs, then see which layer catches which. The point is
that the dangerous bugs (authorization) pass the tests and the linter — only
reasoning catches them.

> Do this on a branch (`exercise/seeded-bugs`), open a PR, and **label each bug**
> in a PR comment so graders can score the coverage table.

## Suggested bugs (one per class)

### 1. Broken Access Control / IDOR (read) — 🔴
In `app/api/notes/[id]/route.ts`, drop the ownership check so any signed-in user
can read any note:

```diff
- if (!isOwner(note, session.user.id)) {
-   throw forbidden("You do not own this note");
- }
```

Tests still pass for the owner; the linter says nothing. This is the bug class
AI finds **worst**.

### 2. IDOR (write) — owner from client — 🔴
In `app/api/notes/route.ts` POST, trust the client's owner:

```diff
- const note = createNote(session.user.id, parsed.data);
+ const ownerId = (body as { ownerId?: string }).ownerId ?? session.user.id;
+ const note = createNote(ownerId, parsed.data);
```

### 3. Validation gap — 🔴
In PATCH, skip Zod and shove raw JSON into the store:

```diff
- const parsed = updateNoteSchema.safeParse(body);
- if (!parsed.success) return badRequest(...);
- const updated = updateNote(note, parsed.data);
+ const updated = updateNote(note, body as UpdateNoteInput);
```

### 4. Resource / DoS — unbounded list — 🟡/🔴
In `lib/validation.ts`, remove the `.max(100)` clamp on `limit` so a caller can
request everything.

### 5. Process / wrong fix — 🔴
Instead of fixing a failing assertion, change the test to expect the wrong value.
This is the "green but wrong" trap a fix-loop without a guard would fall into.

### Bonus nit — 🟡
Rename a variable inconsistently or add a redundant `useMemo`-style micro-thing
so you have a pure-style finding to compare noise levels.

## How to score

Run Layer 2 → 3 → 4 (→ 5 if available) and fill `docs/mini-benchmark.md`. The
honest result: the linter catches ~none of #1/#2/#3, AI catches some
inconsistently, and the **human** is the reliable catch for authorization.
