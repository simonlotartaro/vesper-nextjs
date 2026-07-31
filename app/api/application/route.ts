import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * "Request Access" submissions.
 *
 * Contract with the frontend (components/VesperHome.tsx → submitApplication):
 *   JSON body, never FormData.
 *   { name, email, city, role, referred, interested, note, lang }
 *
 * One email to info@vesperevent.com, one row in public.access_requests.
 * The Resend key is read from the server env only — it never reaches the client.
 */

const DEST = "info@vesperevent.com";
const FROM = "Vesper <info@vesperevent.com>";

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

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildEmail(d: Normalized, stored: boolean) {
  const rows: [string, string][] = [
    ["Nombre", d.name],
    ["Email", d.email],
    ["Ciudad", or(d.city)],
    ["Rol / profesión", or(d.role)],
    ["Referido por", or(d.referred)],
    ["Interesado en", or(d.interested)],
    ["Idioma del formulario", or(d.lang)],
  ];

  const warning = stored ? "" : "\n⚠ Esta solicitud NO pudo guardarse en la base de datos. Conservá este email.\n";

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nNota:\n${or(d.note)}\n` + warning;

  const html = `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;color:#1a1a1a">
  <p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8a7340;margin:0 0 18px">
    Vesper · Nueva solicitud de acceso
  </p>
  <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">
    ${rows.map(([k, v]) => `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #eceae4;color:#77736b;width:180px;vertical-align:top">${esc(k)}</td>
      <td style="padding:9px 0;border-bottom:1px solid #eceae4;vertical-align:top">${esc(v)}</td>
    </tr>`).join("")}
  </table>
  <p style="font-size:12px;color:#77736b;margin:24px 0 6px">Nota</p>
  <p style="font-size:14px;line-height:1.6;white-space:pre-line;margin:0">${esc(or(d.note))}</p>
  ${stored ? "" : `<p style="margin:22px 0 0;padding:12px 14px;background:#fdf3f0;border:1px solid #e8c4b8;font-size:13px;color:#93412a">⚠ Esta solicitud no pudo guardarse en la base de datos. Conservá este email.</p>`}
</div>`.trim();

  return { text, html };
}

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

  // ── 1. Persist ────────────────────────────────────────────────────────
  // A DB failure must NOT swallow the request: the email is the channel the
  // team actually reads, so we log the failure, flag it inside the email and
  // keep going. Only a failed email is treated as a failed submission.
  let stored = false;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("access_requests").insert({
      name: data.name,
      email: data.email,
      city: data.city || null,
      role: data.role || null,
      referred: data.referred || null,
      interested: data.interested || null,
      note: data.note || null,
      lang: data.lang || null,
    });
    if (error) console.error("[application] supabase insert failed:", error.message);
    else { stored = true; dbg("row inserted in access_requests"); }
  } catch (err) {
    console.error("[application] supabase insert threw:", err instanceof Error ? err.message : err);
  }

  // ── 2. Notify ─────────────────────────────────────────────────────────
  if (!process.env.RESEND_API_KEY) {
    console.error("[application] RESEND_API_KEY is not set");
    return NextResponse.json({ error: "not_configured", stored }, { status: 500 });
  }

  const { text, html } = buildEmail(data, stored);
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: sent, error } = await resend.emails.send({
    from: FROM,                    // never the applicant — it would fail DMARC
    to: DEST,
    replyTo: data.email,           // replying goes straight to the applicant
    subject: `Nueva solicitud de acceso — ${data.name}`,
    text,
    html,
  });

  if (error) {
    console.error("[application] resend error:", error);
    return NextResponse.json({ error: "send_failed", stored }, { status: 500 });
  }

  dbg("resend ok, id:", sent?.id, "| stored:", stored);
  return NextResponse.json({ ok: true, stored });
}
