import { Resend } from "resend";
import { NextResponse } from "next/server";

const DEST = "info@vesperevent.com";

const clean = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const city = clean(body.city, 120);
  const role = clean(body.role, 60);
  const referred = clean(body.referred, 160);
  const interested = clean(body.interested, 60);
  const note = clean(body.note, 2000);
  const lang = clean(body.lang, 4);

  if (!name || !email) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[application] RESEND_API_KEY is not set");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "Vesper <info@vesperevent.com>",
    to: DEST,
    replyTo: email,
    subject: `Nueva solicitud de acceso — ${name}`,
    text: [
      `Nombre: ${name}`,
      `Email: ${email}`,
      `Ciudad: ${city || "—"}`,
      `Rol: ${role || "—"}`,
      `Referido por: ${referred || "—"}`,
      `Interesado en: ${interested || "—"}`,
      `Idioma del formulario: ${lang || "—"}`,
      ``,
      `Nota:`,
      note || "—",
    ].join("\n"),
  });

  if (error) {
    console.error("[application] resend error", error);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
