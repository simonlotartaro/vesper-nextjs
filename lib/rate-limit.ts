/**
 * Fixed-window rate limiter, in memory.
 *
 * Scope caveat: serverless instances don't share memory, so the real ceiling
 * is `limit × number of warm instances`. That is fine for what this defends
 * against — a script hammering the contact form — and costs nothing. If these
 * endpoints ever need a hard guarantee, back it with Supabase or Upstash.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5_000;

function sweep(now: number) {
  if (buckets.size < MAX_KEYS) return;
  buckets.forEach((b, key) => { if (b.resetAt <= now) buckets.delete(key); });
  // Still full of live buckets: drop the oldest insertions.
  if (buckets.size >= MAX_KEYS) {
    const excess = buckets.size - MAX_KEYS + 1;
    Array.from(buckets.keys()).slice(0, excess).forEach((key) => buckets.delete(key));
  }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

/** Client IP as seen through Vercel's proxy. */
export function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
