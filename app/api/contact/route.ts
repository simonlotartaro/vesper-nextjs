import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, tel, message } = await req.json();

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "Vesper <info@vesperevent.com>",
    to: "info@vesperevent.com",
    replyTo: email,
    subject: `Nuevo mensaje de contacto — ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${tel || "—"}\n\nMensaje:\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
