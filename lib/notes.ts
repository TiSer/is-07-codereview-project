import type { CreateNoteInput, UpdateNoteInput } from "@/lib/validation";

/**
 * In-memory notes store + pure-ish domain logic.
 *
 * No database on purpose — the workshop is about review, not persistence.
 * The store is an intentional process-wide singleton (a demo cache), NOT
 * request-scoped data, so module-level state is acceptable here.
 *
 * The interesting review surface lives in `isOwner` / `assertCanMutate`:
 * authorization that a linter cannot reason about.
 */

export type Note = {
  id: string;
  ownerId: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

const notes = new Map<string, Note>();

/** Monotonic creation sequence per note id. Kept internal (not on `Note`, not
 * serialized) so listing can be ordered "newest first" deterministically even
 * for notes created within the same millisecond, where `createdAt` would tie. */
const seqById = new Map<string, number>();
let counter = 0;

function nextSeq(): number {
  counter += 1;
  return counter;
}

export function isOwner(note: Note, userId: string): boolean {
  return note.ownerId === userId;
}

export function getNote(id: string): Note | undefined {
  return notes.get(id);
}

export function listNotes(
  ownerId: string,
  limit: number,
  offset: number,
): Note[] {
  const owned = [...notes.values()]
    .filter((n) => n.ownerId === ownerId)
    .toSorted((a, b) => (seqById.get(b.id) ?? 0) - (seqById.get(a.id) ?? 0));
  return owned.slice(offset, offset + limit);
}

export function createNote(ownerId: string, input: CreateNoteInput): Note {
  const now = Date.now();
  const seq = nextSeq();
  const note: Note = {
    id: `note_${seq}`,
    ownerId,
    title: input.title,
    body: input.body,
    createdAt: now,
    updatedAt: now,
  };
  notes.set(note.id, note);
  seqById.set(note.id, seq);
  return note;
}

export function updateNote(note: Note, input: UpdateNoteInput): Note {
  const updated: Note = {
    ...note,
    title: input.title ?? note.title,
    body: input.body ?? note.body,
    updatedAt: Date.now(),
  };
  notes.set(note.id, updated);
  return updated;
}

export function deleteNote(id: string): void {
  notes.delete(id);
  seqById.delete(id);
}

/** Test helper — resets the store between tests. */
export function __resetNotes(): void {
  notes.clear();
  seqById.clear();
  counter = 0;
}
