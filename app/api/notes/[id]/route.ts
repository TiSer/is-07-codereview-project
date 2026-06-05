import { requireSession } from "@/lib/auth";
import { badRequest, forbidden, isResponse, notFound } from "@/lib/errors";
import {
  deleteNote,
  getNote,
  isOwner,
  updateNote,
  type Note,
} from "@/lib/notes";
import { updateNoteSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Load a note and assert the current user owns it. Returns the note or throws
 * a Response (404 if missing, 403 if not the owner). This is the IDOR guard:
 * we 404 unknown ids and 403 someone else's note.
 */
function requireOwnedNote(req: Request, id: string): Note {
  const session = requireSession(req);
  const note = getNote(id);
  if (!note) {
    throw notFound("Note not found");
  }
  if (!isOwner(note, session.user.id)) {
    throw forbidden("You do not own this note");
  }
  return note;
}

export async function GET(req: Request, ctx: Ctx): Promise<Response> {
  try {
    const { id } = await ctx.params;
    const note = requireOwnedNote(req, id);
    return Response.json({ note });
  } catch (e) {
    if (isResponse(e)) return e;
    throw e;
  }
}

export async function PATCH(req: Request, ctx: Ctx): Promise<Response> {
  try {
    const { id } = await ctx.params;
    const note = requireOwnedNote(req, id);

    const body = await req.json().catch(() => null);
    const parsed = updateNoteSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid body");
    }

    const updated = updateNote(note, parsed.data);
    return Response.json({ note: updated });
  } catch (e) {
    if (isResponse(e)) return e;
    throw e;
  }
}

export async function DELETE(req: Request, ctx: Ctx): Promise<Response> {
  try {
    const { id } = await ctx.params;
    const note = requireOwnedNote(req, id);
    deleteNote(note.id);
    return new Response(null, { status: 204 });
  } catch (e) {
    if (isResponse(e)) return e;
    throw e;
  }
}
