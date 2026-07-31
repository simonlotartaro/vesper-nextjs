import { Resend } from "resend";
import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";

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

const DEST = "info@vesperevent.com";
const FROM = "Vesper <info@vesperevent.com>";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MIN_FILL_MS = 3_000;      // nobody types a message in under 3 seconds
const MAX_FORM_AGE_MS = 3 * 60 * 60 * 1000;

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** Deliberately permissive: shape check only, so no real address is refused. */
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

  // ── send ──────────────────────────────────────────────────────────────
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: sent, error } = await resend.emails.send({
    from: FROM,              // never the sender — it would fail DMARC
    to: DEST,
    replyTo: email,          // replying goes straight to the person
    subject: `Nuevo mensaje de contacto — ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${tel || "—"}\n\nMensaje:\n${message}`,
    html: `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;color:#1a1a1a">
  <p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8a7340;margin:0 0 18px">
    Vesper · Nuevo mensaje de contacto
  </p>
  <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">
    ${([["Nombre", name], ["Email", email], ["Teléfono", tel || "—"]] as [string, string][])
      .map(([k, v]) => `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #eceae4;color:#77736b;width:180px;vertical-align:top">${esc(k)}</td>
      <td style="padding:9px 0;border-bottom:1px solid #eceae4;vertical-align:top">${esc(v)}</td>
    </tr>`).join("")}
  </table>
  <p style="font-size:12px;color:#77736b;margin:24px 0 6px">Mensaje</p>
  <p style="font-size:14px;line-height:1.6;white-space:pre-line;margin:0">${esc(message)}</p>
</div>`.trim(),
  });

  if (error) {
    // Logged in full server-side; the client only learns that it failed.
    console.error("[contact] resend error:", error);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  console.log("[contact] sent, id:", sent?.id);
  return NextResponse.json({ ok: true });
}
