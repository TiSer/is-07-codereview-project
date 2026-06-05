/**
 * Tiny error-response helpers so handlers never leak stack traces, SQL, or
 * internal messages. Each returns a `Response` you can `return` directly, or
 * `throw` and catch with `isResponse()` in a try/catch.
 */

type ErrorBody = { error: string; code: string };

function json(body: ErrorBody, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function badRequest(message = "Bad request"): Response {
  return json({ error: message, code: "bad_request" }, 400);
}

export function unauthorized(message = "Unauthorized"): Response {
  return json({ error: message, code: "unauthorized" }, 401);
}

export function forbidden(message = "Forbidden"): Response {
  return json({ error: message, code: "forbidden" }, 403);
}

export function notFound(message = "Not found"): Response {
  return json({ error: message, code: "not_found" }, 404);
}

export function isResponse(value: unknown): value is Response {
  return value instanceof Response;
}
