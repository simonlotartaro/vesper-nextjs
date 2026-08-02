import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { sendTracked, emailShell } from "@/lib/email";

/**
 * "Request Access" submissions.
 *
 * Contract with the frontend (components/VesperHome.tsx → submitApplication):
 *   JSON body, never FormData.
 *   { name, email, city, role, referred, interested, note, lang }
 *
 * Row in public.access_requests, one email to info@vesperevent.com.
 * The Resend key is read from the server env only — it never reaches the client.
 */

/** Temporary diagnostic logging. Flip to false once the flow is confirmed. */
const DEBUG = true;

const dbg = (...args: unknown[]) => { if (DEBUG) console.log("[application]", ...args); };

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** First non-empty value among the accepted aliases for a field. */
const pick = (body: Record<string, unknown>, keys: string[], max: number) => {
  for (const k of keys) {
    const v = clean(body[k], max);
    if (v) return v;
  }
  return "";
};

type Normalized = {
  name: string; email: string; city: string; role: string;
  referred: string; interested: string; note: string; lang: string;
};

/**
 * Collapse every naming variant the form could ever send into one shape.
 * Used for both the DB row and the email, so the two can never diverge.
 */
function normalize(body: Record<string, unknown>): Normalized {
  return {
    name:       pick(body, ["name", "fullName", "full_name", "nombre"], 120),
    email:      pick(body, ["email", "mail", "correo"], 160),
    city:       pick(body, ["city", "ciudad"], 120),
    role:       pick(body, ["role", "rol", "profession", "profesion"], 80),
    referred:   pick(body, ["referred", "referredBy", "referred_by", "referido"], 160),
    interested: pick(body, ["interested", "interestedIn", "interested_in", "interesadoEn"], 80),
    note:       pick(body, ["note", "message", "mensaje", "nota"], 2000),
    lang:       pick(body, ["lang", "language", "idioma"], 8),
  };
}

/** Optional fields render as an em dash — never as invented content. */
const or = (v: string) => v || "—";

export async function POST(req: Request) {
  dbg("POST /api/application");

  const ip = clientIp(req);
  const limit = await rateLimit(`application:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    console.warn(`[application] rate limited ${ip}`);
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    dbg("body is not valid JSON → 400");
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  dbg("body keys:", Object.keys(body));

  const data = normalize(body);
  dbg("normalized:", data);

  // Never send on an incomplete identity.
  if (!data.name || !data.email) {
    dbg("missing name or email → 400");
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // ── 1. Persist ────────────────────────────────────────────────────────
  // A DB failure must NOT swallow the request: the email is the channel the
  // team actually reads, so we log the failure, flag it inside the email and
  // keep going — without a row id there is simply no tracking.
  let recordId: string | null = null;
  try {
    const { data: inserted, error } = await supabase
      .from("access_requests")
      .insert({
        name: data.name,
        email: data.email,
        city: data.city || null,
        role: data.role || null,
        referred: data.referred || null,
        interested: data.interested || null,
        note: data.note || null,
        lang: data.lang || null,
      })
      .select("id")
      .single();

    if (error) console.error("[application] supabase insert failed:", error.message);
    else { recordId = inserted.id; dbg("row inserted:", recordId); }
  } catch (err) {
    console.error("[application] supabase insert threw:", err instanceof Error ? err.message : err);
  }

  // ── 2. Notify ─────────────────────────────────────────────────────────
  if (!process.env.RESEND_API_KEY) {
    console.error("[application] RESEND_API_KEY is not set");
    return NextResponse.json({ error: "not_configured", stored: !!recordId }, { status: 500 });
  }

  const rows: [string, string][] = [
    ["Nombre", data.name],
    ["Email", data.email],
    ["Ciudad", or(data.city)],
    ["Rol / profesión", or(data.role)],
    ["Referido por", or(data.referred)],
    ["Interesado en", or(data.interested)],
    ["Idioma del formulario", or(data.lang)],
  ];
  const warning = recordId
    ? undefined
    : "⚠ Esta solicitud NO pudo guardarse en la base de datos. Conservá este email.";

  const content = {
    replyTo: data.email,
    subject: `Nueva solicitud de acceso — ${data.name}`,
    text:
      rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
      `\n\nNota:\n${or(data.note)}\n` + (warning ? `\n${warning}\n` : ""),
    html: emailShell("Vesper · Nueva solicitud de acceso", rows, "Nota", or(data.note), warning),
  };

  const resend = new Resend(process.env.RESEND_API_KEY);

  // Without a row there is nothing to key idempotency to and nothing to track.
  const outcome = recordId
    ? await sendTracked(resend, "request_access", recordId, content)
    : await sendTracked(resend, "request_access", crypto.randomUUID(), content);

  // ── 3. Record the outcome ─────────────────────────────────────────────
  if (recordId) {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("access_requests")
      .update({
        resend_email_id: outcome.status === "sent" ? outcome.emailId : null,
        email_status: outcome.status,
        email_sent_at: outcome.status === "sent" ? now : null,
        email_error: outcome.status === "sent" ? null : outcome.error,
        email_status_updated_at: now,
      })
      .eq("id", recordId);
    if (error) console.error("[application] status update failed:", error.message);
  }

  if (outcome.status === "send_failed") {
    console.error("[application] send failed:", outcome.error);
    return NextResponse.json({ error: "send_failed", stored: !!recordId }, { status: 500 });
  }

  if (outcome.status === "send_pending") {
    // The first attempt may well have gone through. Telling the user to try
    // again is what would create a second row, a second key and a duplicate
    // email — so this is an accepted submission, not an error.
    console.warn("[application] send pending:", outcome.error);
    return NextResponse.json({ ok: true, pending: true, stored: !!recordId }, { status: 202 });
  }

  dbg("resend ok, id:", outcome.emailId, "| stored:", !!recordId);
  return NextResponse.json({ ok: true, stored: !!recordId });
}
