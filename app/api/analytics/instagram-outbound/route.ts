import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Outbound click on the @Vesper link in the menu footer.
 *
 * Sent with navigator.sendBeacon, so nothing here can delay or block the
 * navigation: the browser opens Instagram through a plain <a target="_blank">
 * and never waits for this response.
 *
 * The request body is never read. All three recorded values are fixed here
 * and pinned again by check constraints in the database, so this endpoint
 * has no channel through which a browser could write arbitrary data.
 *
 * The IP is never stored and never logged. It is used solely to derive a
 * rotating HMAC used as the rate-limit key.
 */

const EVENT_NAME = "instagram_outbound_click";
const PLACEMENT = "menu_footer";
const PAGE_PATH = "/";        // single-page site; not taken from the client

const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 10 * 60 * 1000;

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

export async function POST(req: Request) {
  const secret = process.env.ANALYTICS_IP_SALT;
  if (!secret) {
    console.error("[analytics] salt not configured");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const limit = await rateLimit(`ig_outbound:${originKey(req, secret)}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    // No IP, no body, no headers — just the fact.
    console.warn("[analytics] instagram-outbound rate limited");
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("analytics_events").insert({
      event_name: EVENT_NAME,
      placement: PLACEMENT,
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
