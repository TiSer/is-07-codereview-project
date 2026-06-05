/**
 * Demo authentication.
 *
 * This workshop is about CODE REVIEW, not auth providers, so we mock sessions
 * with a signed-ish header instead of wiring a real IdP. The shape mirrors a
 * real `getSession()` so the review patterns (auth inside every mutation, owner
 * from session, never from the client) transfer 1:1 to production code.
 *
 * A request authenticates by sending:  Authorization: Bearer demo:<userId>
 * In a real app this would verify a JWT / session cookie against your IdP.
 */

import { unauthorized } from "@/lib/errors";

export type Session = {
  user: { id: string };
};

const BEARER_PREFIX = "Bearer demo:";

export function getSession(req: Request): Session | null {
  const header = req.headers.get("authorization");
  if (!header || !header.startsWith(BEARER_PREFIX)) {
    return null;
  }

  const userId = header.slice(BEARER_PREFIX.length).trim();
  if (userId.length === 0) {
    return null;
  }

  return { user: { id: userId } };
}

/**
 * Returns the session or throws a 401 Response. Call at the top of every
 * mutation BEFORE touching the data store.
 */
export function requireSession(req: Request): Session {
  const session = getSession(req);
  if (!session) {
    throw unauthorized("Sign in to continue");
  }
  return session;
}
