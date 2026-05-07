const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  limit = 5,
  windowMs = 60_000
): { allowed: boolean } {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    return { allowed: false };
  }

  entry.count++;
  return { allowed: true };
}
