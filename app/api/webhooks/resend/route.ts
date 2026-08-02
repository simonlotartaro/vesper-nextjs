import { Resend, type WebhookEventPayload } from "resend";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PRIMARY_RECIPIENT } from "@/lib/email";

/**
 * Resend delivery events.
 *
 * Every verified event is logged to public.email_events, whatever recipient
 * it belongs to. Only events for the primary recipient move a request's own
 * status — delivery to the Gmail backup says nothing about the real one.
 *
 * Not rate limited: throttling Resend would drop delivery information.
 */

const STATUS_BY_EVENT: Record<string, string> = {
  "email.delivered": "delivered",
  "email.delivery_delayed": "delayed",
  "email.bounced": "bounced",
  "email.failed": "failed",
  "email.suppressed": "suppressed",
};

/** Explicit whitelist. An unknown form_type updates nothing, ever. */
const TABLE_BY_FORM: Record<string, string> = {
  request_access: "access_requests",
  contact: "contact_messages",
};

type BaseEventData = {
  created_at?: string;
  email_id?: string;
  to?: string[];
  tags?: Record<string, string>;
  bounce?: { message?: string; subType?: string; type?: string };
  failed?: { reason?: string };
  suppressed?: unknown;
};

function errorReason(type: string, data: BaseEventData): string | null {
  if (type === "email.bounced") {
    const b = data.bounce;
    return [b?.type, b?.subType, b?.message].filter(Boolean).join(" · ") || "bounced";
  }
  if (type === "email.failed") return data.failed?.reason || "failed";
  if (type === "email.suppressed") {
    return typeof data.suppressed === "string"
      ? data.suppressed
      : JSON.stringify(data.suppressed ?? "suppressed").slice(0, 500);
  }
  if (type === "email.delivery_delayed") return "delivery delayed";
  return null;
}

export async function POST(req: Request) {
  const raw = await req.text();

  const id = req.headers.get("svix-id");
  const timestamp = req.headers.get("svix-timestamp");
  const signature = req.headers.get("svix-signature");
  if (!id || !timestamp || !signature) {
    return NextResponse.json({ error: "missing_headers" }, { status: 400 });
  }

  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[resend-webhook] RESEND_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  // verify() is synchronous: it returns the parsed event or throws.
  let event: WebhookEventPayload;
  try {
    // Signature verification is purely local — it never calls the API. The
    // constructor throws without a key, so pass a placeholder rather than
    // coupling webhook intake to the sending credential.
    const resend = new Resend(process.env.RESEND_API_KEY ?? "webhook-verification-only");
    event = resend.webhooks.verify({
      payload: raw,
      headers: { id, timestamp, signature },
      webhookSecret: secret,
    });
  } catch (err) {
    console.warn("[resend-webhook] invalid signature:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const data = (event.data ?? {}) as BaseEventData;
  const recipient = data.to?.[0] ?? "unknown";
  const tags = data.tags ?? {};
  const formType = tags.form_type ?? null;
  const recordId = tags.record_id ?? null;
  const emailId = data.email_id ?? null;

  const supabase = createAdminClient();

  // ── 1. Log first, always ────────────────────────────────────────────
  const { error: logError } = await supabase.from("email_events").insert({
    svix_id: id,
    event_created_at: event.created_at,
    recipient,
    resend_email_id: emailId,
    form_type: formType,
    record_id: recordId,
    event_type: event.type,
    payload: event,
  });

  if (logError) {
    // 23505 = unique_violation on svix_id: Resend is retrying a delivery we
    // already processed. Anything else is a real failure and must be retried,
    // so we answer 500 and let Resend send it again.
    if (logError.code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error("[resend-webhook] email_events insert failed:", logError.message);
    return NextResponse.json({ error: "log_failed" }, { status: 500 });
  }

  // ── 2. Only the primary recipient moves a request's status ──────────
  if (recipient !== PRIMARY_RECIPIENT) {
    return NextResponse.json({ ok: true, logged_only: "non_primary_recipient" });
  }

  const status = STATUS_BY_EVENT[event.type];
  if (!status) return NextResponse.json({ ok: true, ignored: event.type });

  const table = formType ? TABLE_BY_FORM[formType] : undefined;
  if (!table) {
    console.warn(`[resend-webhook] unknown form_type ${formType ?? "(none)"} — logged only`);
    return NextResponse.json({ ok: true, logged_only: "unknown_form_type" });
  }

  // ── 3. Locate the row: record_id first, email id as fallback ────────
  const lookup = supabase
    .from(table)
    .select("id, email_status, email_status_updated_at, email_sent_at");

  const { data: row, error: findError } = await (
    recordId ? lookup.eq("id", recordId) : lookup.eq("resend_email_id", emailId ?? "")
  ).maybeSingle();

  if (findError) {
    console.error("[resend-webhook] lookup failed:", findError.message);
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ ok: true, logged_only: "no_matching_row" });
  }

  // ── 4. Ordering guards ──────────────────────────────────────────────
  // Guard 1: never apply an event older than the one already applied.
  if (row.email_status_updated_at && row.email_status_updated_at >= event.created_at) {
    return NextResponse.json({ ok: true, skipped: "stale_event" });
  }
  // Guard 2: explicit and deliberately redundant — a delay never overwrites a
  // delivery, even if a clock skew gave it a later timestamp.
  if (event.type === "email.delivery_delayed" && row.email_status === "delivered") {
    return NextResponse.json({ ok: true, skipped: "delayed_after_delivered" });
  }

  const isDelivered = event.type === "email.delivered";

  const patch: Record<string, unknown> = {
    email_status: status,
    email_status_updated_at: event.created_at,
    // Backfills a row left at send_pending, whose id we never recorded.
    ...(emailId ? { resend_email_id: emailId } : {}),
    // A delivery clears any earlier failure reason; anything else records one.
    email_error: isDelivered ? null : errorReason(event.type, data),
    ...(isDelivered ? { email_delivered_at: event.created_at } : {}),
    // If the send never got as far as stamping this, take Resend's own
    // creation time for the message.
    ...(isDelivered && !row.email_sent_at && data.created_at
      ? { email_sent_at: data.created_at }
      : {}),
  };

  const { error: updateError } = await supabase
    .from(table)
    .update(patch)
    .eq("id", row.id)
    // Database-level backstop for the guard above, in case two events for the
    // same message are processed concurrently.
    .or(`email_status_updated_at.is.null,email_status_updated_at.lt.${event.created_at}`);

  if (updateError) {
    console.error("[resend-webhook] update failed:", updateError.message);
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  console.log(`[resend-webhook] ${event.type} → ${table}/${row.id} (${status})`);
  return NextResponse.json({ ok: true });
}
