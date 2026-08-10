import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Outbound-click analytics, shared by every beacon endpoint.
 *
 * One implementation on purpose: the endpoints differ only in two string
 * constants, so any future correction here applies to all of them by
 * construction rather than by remembering to copy it.
 *
 * Nothing is read from the request except the IP, and that is only ever fed
 * through an HMAC to key the rate limiter — never stored, never logged. The
 * body and headers are not read at all, so no browser can write arbitrary
 * data through these routes.
 */

const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/** Single-page site; never taken from the client. */
const PAGE_PATH = "/";

/**
 * Rate-limit key: HMAC of the IP, salted with the current window index so it
 * rotates every window and cannot be correlated across time or reversed into
 * an address. The rotation lines up with the fixed window, so the counter is
 * stable for as long as the window it belongs to.
 *
 * No fallback secret: a predictable salt would make the hash reversible by
 * brute force over the IPv4 space, which defeats the point of hashing at all.
 */
function originKey(req: Request, secret: string): string {
  const windowIndex = Math.floor(Date.now() / RATE_WINDOW_MS);
  return createHmac("sha256", secret)
    .update(`${clientIp(req)}:${windowIndex}`)
    .digest("hex")
    .slice(0, 32);
}

export type OutboundEvent = {
  /** Rate-limit namespace, so one button cannot exhaust another's budget. */
  bucket: string;
  eventName: string;
  placement: string;
};

export async function recordOutboundClick(req: Request, event: OutboundEvent) {
  const secret = process.env.ANALYTICS_IP_SALT;
  if (!secret) {
    console.error("[analytics] salt not configured");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const limit = await rateLimit(
    `${event.bucket}:${originKey(req, secret)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS
  );
  if (!limit.ok) {
    // No IP, no body, no headers — just the fact.
    console.warn(`[analytics] ${event.bucket} rate limited`);
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("analytics_events").insert({
      event_name: event.eventName,
      placement: event.placement,
      page_path: PAGE_PATH,
      // created_at is left to the database default on purpose: a client clock
      // can be wrong or spoofed.
    });
    if (error) {
      console.error("[analytics] insert failed:", error.message);
      return NextResponse.json({ error: "insert_failed" }, { status: 500 });
    }
  } catch (err) {
    console.error("[analytics] insert threw:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
