import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { sendTracked, emailShell } from "@/lib/email";

/**
 * Contact form.
 *
 * Contract with the frontend (components/VesperHome.tsx → submitContact):
 *   JSON body, never FormData.
 *   { name, email, tel, message, company, ts }
 *
 * `company` is a honeypot and `ts` is the moment the form was rendered.
 * Both are anti-spam signals, never shown to the user and never emailed.
 */

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MIN_FILL_MS = 3_000;      // nobody types a message in under 3 seconds
const MAX_FORM_AGE_MS = 3 * 60 * 60 * 1000;

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** Deliberately permissive: shape check only, so no real address is refused. */
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(req: Request) {
  const ip = clientIp(req);

  const limit = await rateLimit(`contact:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    console.warn(`[contact] rate limited ${ip}`);
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // ── anti-spam ─────────────────────────────────────────────────────────
  // A hidden field only an automated filler would populate. Answer 200 so a
  // bot cannot tell it was caught, but send nothing.
  if (clean(body.company, 100)) {
    console.warn(`[contact] honeypot triggered from ${ip}`);
    return NextResponse.json({ ok: true });
  }

  const ts = Number(body.ts);
  if (Number.isFinite(ts) && ts > 0) {
    const elapsed = Date.now() - ts;
    if (elapsed < MIN_FILL_MS || elapsed > MAX_FORM_AGE_MS) {
      console.warn(`[contact] suspicious timing from ${ip}: ${elapsed}ms`);
      return NextResponse.json({ error: "invalid_submission" }, { status: 400 });
    }
  }

  // ── validation ────────────────────────────────────────────────────────
  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const tel = clean(body.tel, 60);
  const message = clean(body.message, 4000);

  if (!name || !email || !message || !looksLikeEmail(email)) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is not set");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const supabase = createAdminClient();

  // ── 1. Persist ────────────────────────────────────────────────────────
  // Same policy as the application form: a DB failure never swallows the
  // message. Without a row there is no tracking, and the email says so.
  let recordId: string | null = null;
  try {
    const { data: inserted, error } = await supabase
      .from("contact_messages")
      .insert({ name, email, tel: tel || null, message })
      .select("id")
      .single();
    if (error) console.error("[contact] supabase insert failed:", error.message);
    else recordId = inserted.id;
  } catch (err) {
    console.error("[contact] supabase insert threw:", err instanceof Error ? err.message : err);
  }

  // ── 2. Notify ─────────────────────────────────────────────────────────
  const rows: [string, string][] = [
    ["Nombre", name],
    ["Email", email],
    ["Teléfono", tel || "—"],
  ];
  const warning = recordId
    ? undefined
    : "⚠ Este mensaje NO pudo guardarse en la base de datos. Conservá este email.";

  const content = {
    replyTo: email,
    subject: `Nuevo mensaje de contacto — ${name}`,
    text:
      `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${tel || "—"}\n\nMensaje:\n${message}\n` +
      (warning ? `\n${warning}\n` : ""),
    html: emailShell("Vesper · Nuevo mensaje de contacto", rows, "Mensaje", message, warning),
  };

  const resend = new Resend(process.env.RESEND_API_KEY);
  const outcome = await sendTracked(
    resend,
    "contact",
    recordId ?? crypto.randomUUID(),
    content
  );

  // ── 3. Record the outcome ─────────────────────────────────────────────
  if (recordId) {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("contact_messages")
      .update({
        resend_email_id: outcome.status === "sent" ? outcome.emailId : null,
        email_status: outcome.status,
        email_sent_at: outcome.status === "sent" ? now : null,
        email_error: outcome.status === "sent" ? null : outcome.error,
        email_status_updated_at: now,
      })
      .eq("id", recordId);
    if (error) console.error("[contact] status update failed:", error.message);
  }

  if (outcome.status === "send_failed") {
    console.error("[contact] send failed:", outcome.error);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  if (outcome.status === "send_pending") {
    console.warn("[contact] send pending:", outcome.error);
    return NextResponse.json({ ok: true, pending: true }, { status: 202 });
  }

  console.log("[contact] sent, id:", outcome.emailId);
  return NextResponse.json({ ok: true });
}
