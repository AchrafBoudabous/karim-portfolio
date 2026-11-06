import "server-only";

/**
 * Small fixed-window, in-memory rate limiter.
 *
 * Note: memory is per server instance. On serverless hosting each instance
 * has its own window, so treat this as a first line of defence against
 * bursts — not a hard global quota.
 */

interface Entry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Map<string, Entry>>();
const MAX_KEYS_PER_BUCKET = 5_000;

function prune(store: Map<string, Entry>, now: number) {
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
  // Hard cap so a flood of unique keys can never exhaust memory.
  if (store.size > MAX_KEYS_PER_BUCKET) {
    const overflow = store.size - MAX_KEYS_PER_BUCKET;
    let i = 0;
    for (const key of store.keys()) {
      if (i++ >= overflow) break;
      store.delete(key);
    }
  }
}

export function checkRateLimit(
  bucket: string,
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  let store = buckets.get(bucket);
  if (!store) {
    store = new Map();
    buckets.set(bucket, store);
  }
  if (store.size > MAX_KEYS_PER_BUCKET / 2) prune(store, now);

  const entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}
