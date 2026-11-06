import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

const MAX_BODY_BYTES = 16 * 1024;

/**
 * Best-effort client IP. Platform-set headers come first because the
 * left-most `x-forwarded-for` entry is supplied by the client and can be
 * spoofed to dodge per-IP limits.
 */
export function getClientIp(req: NextRequest): string {
  const platformIp =
    req.headers.get("x-vercel-forwarded-for") ??
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip");
  if (platformIp) return platformIp.split(",")[0].trim();

  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
    // The right-most entry was appended by the closest proxy we trust.
    if (parts.length) return parts[parts.length - 1];
  }
  return "unknown";
}

function json(body: unknown, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export const respond = {
  ok: () => json({ ok: true }, 200),
  invalid: (errors: Record<string, string>) => json({ errors }, 422),
  error: () => json({ error: "server" }, 500),
  unavailable: () => json({ error: "unavailable" }, 503),
};

type GuardResult =
  | { ok: true; body: Record<string, unknown>; ip: string }
  | { ok: false; response: NextResponse };

/**
 * Shared checks for public form endpoints:
 * same-origin, JSON only, bounded body size, per-IP and global rate limits.
 */
export async function guardFormRequest(
  req: NextRequest,
  bucket: string
): Promise<GuardResult> {
  // 1. Same-origin only (blocks cross-site form posts / CSRF-style abuse).
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin) {
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      /* malformed origin */
    }
    if (!originHost || originHost !== host) {
      return { ok: false, response: json({ error: "forbidden" }, 403) };
    }
  }

  // 2. JSON only.
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return { ok: false, response: json({ error: "unsupported" }, 415) };
  }

  // 3. Rate limits: per IP, plus a global ceiling per instance.
  const ip = getClientIp(req);
  const perIp = checkRateLimit(bucket, ip, 5, 10 * 60_000);
  const global = checkRateLimit(`${bucket}:global`, "all", 60, 60 * 60_000);
  if (!perIp.allowed || !global.allowed) {
    const retry = Math.max(perIp.retryAfterSeconds, global.retryAfterSeconds);
    return {
      ok: false,
      response: json({ error: "rateLimited" }, 429, {
        "Retry-After": String(retry),
      }),
    };
  }

  // 4. Bounded body size, then parse.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return { ok: false, response: json({ error: "tooLarge" }, 413) };
  }
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return { ok: false, response: json({ error: "badRequest" }, 400) };
  }
  if (raw.length > MAX_BODY_BYTES) {
    return { ok: false, response: json({ error: "tooLarge" }, 413) };
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return { ok: false, response: json({ error: "badRequest" }, 400) };
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, response: json({ error: "badRequest" }, 400) };
  }

  return { ok: true, body: body as Record<string, unknown>, ip };
}

/** Limits how often a single recipient can receive an auto-reply. */
export function allowAutoReply(email: string): boolean {
  return checkRateLimit("autoreply", email, 2, 60 * 60_000).allowed;
}
