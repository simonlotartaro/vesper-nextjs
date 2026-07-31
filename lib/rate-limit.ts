import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Rate limiting for the public form endpoints.
 *
 * Backed by Postgres, not memory: on Vercel each request may land on a
 * different serverless instance, so an in-process counter never accumulates
 * and lets a fast attacker straight through. The counting happens inside a
 * single SQL statement (public.hit_rate_limit) so concurrent requests cannot
 * both read a stale count.
 *
 * Requires supabase/migrations/0002_rate_limits.sql.
 */

type Bucket = { count: number; resetAt: number };

/** Last-resort fallback, used only if the database is unreachable. */
const memory = new Map<string, Bucket>();
const MAX_KEYS = 5_000;

function memoryLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (memory.size >= MAX_KEYS) {
    memory.forEach((b, k) => { if (b.resetAt <= now) memory.delete(k); });
  }
  const bucket = memory.get(key);
  if (!bucket || bucket.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

export async function rateLimit(key: string, limit: number, windowMs: number) {
  const windowSeconds = Math.ceil(windowMs / 1000);

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("hit_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });

    if (error) throw new Error(error.message);

    const row = Array.isArray(data) ? data[0] : data;
    if (!row || typeof row.allowed !== "boolean") throw new Error("unexpected rpc shape");

    return { ok: row.allowed as boolean, retryAfter: (row.retry_after as number) ?? windowSeconds };
  } catch (err) {
    // Never let the limiter take the endpoint down with it: degrade to the
    // in-process counter, which is weaker but better than nothing.
    console.error("[rate-limit] falling back to memory:", err instanceof Error ? err.message : err);
    return memoryLimit(key, limit, windowMs);
  }
}

/** Client IP as seen through Vercel's proxy. */
export function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
