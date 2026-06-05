import { afterEach, describe, expect, it } from "vitest";
import {
  __resetNotes,
  createNote,
  deleteNote,
  getNote,
  isOwner,
  listNotes,
  updateNote,
} from "@/lib/notes";

afterEach(() => {
  __resetNotes();
});

describe("notes store", () => {
  it("creates a note owned by the given user", () => {
    const note = createNote("user_a", { title: "T", body: "B" });
    expect(note.ownerId).toBe("user_a");
    expect(getNote(note.id)?.title).toBe("T");
  });

  it("isOwner only matches the owner", () => {
    const note = createNote("user_a", { title: "T", body: "B" });
    expect(isOwner(note, "user_a")).toBe(true);
    expect(isOwner(note, "user_b")).toBe(false);
  });

  it("listNotes returns only the owner's notes, newest first", () => {
    createNote("user_a", { title: "A1", body: "B" });
    createNote("user_b", { title: "B1", body: "B" });
    createNote("user_a", { title: "A2", body: "B" });

    const aNotes = listNotes("user_a", 20, 0);
    expect(aNotes).toHaveLength(2);
    expect(aNotes.every((n) => n.ownerId === "user_a")).toBe(true);
    expect(aNotes[0].title).toBe("A2");
  });

  it("listNotes respects limit and offset", () => {
    for (let i = 0; i < 5; i += 1) {
      createNote("user_a", { title: `N${i}`, body: "B" });
    }
    expect(listNotes("user_a", 2, 0)).toHaveLength(2);
    expect(listNotes("user_a", 2, 4)).toHaveLength(1);
  });

  it("updateNote patches only provided fields", () => {
    const note = createNote("user_a", { title: "T", body: "B" });
    const updated = updateNote(note, { title: "T2" });
    expect(updated.title).toBe("T2");
    expect(updated.body).toBe("B");
  });

  it("deleteNote removes the note", () => {
    const note = createNote("user_a", { title: "T", body: "B" });
    deleteNote(note.id);
    expect(getNote(note.id)).toBeUndefined();
  });
});
