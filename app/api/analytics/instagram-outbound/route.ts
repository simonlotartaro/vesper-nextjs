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
 * The client sends only page_path. event_name and placement are fixed on the
 * server and enforced again by check constraints in the database — a browser
 * cannot write arbitrary analytics rows.
 *
 * The IP is never stored and never logged. It is used solely to derive a
 * rotating HMAC used as the rate-limit key.
 */

const EVENT_NAME = "instagram_outbound_click";
const PLACEMENT = "menu_footer";

const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * Rate-limit key: HMAC of the IP, salted with the current window index so it
 * rotates every window and cannot be correlated across time or reversed into
 * an address. The rotation lines up with the fixed window, so the counter is
 * stable for as long as the window it belongs to.
 */
function originKey(req: Request): string {
  const secret =
    process.env.ANALYTICS_IP_SALT ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    "vesper-analytics-fallback-salt";
  const windowIndex = Math.floor(Date.now() / RATE_WINDOW_MS);
  return createHmac("sha256", secret)
    .update(`${clientIp(req)}:${windowIndex}`)
    .digest("hex")
    .slice(0, 32);
}

export async function POST(req: Request) {
  const limit = await rateLimit(`ig_outbound:${originKey(req)}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    // No IP, no body, no headers — just the fact.
    console.warn("[analytics] instagram-outbound rate limited");
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let pagePath: string | null = null;
  try {
    const body = await req.json();
    pagePath =
      typeof body?.page_path === "string" ? body.page_path.trim().slice(0, 300) : null;
  } catch {
    // sendBeacon payloads are ours, so a malformed one is noise, not an event.
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("analytics_events").insert({
      event_name: EVENT_NAME,   // fixed server-side, never read from the body
      placement: PLACEMENT,     // idem
      page_path: pagePath,
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
