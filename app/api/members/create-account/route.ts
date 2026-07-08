import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });

  const supabase = createAdminClient();

  const { data: member } = await supabase
    .from("members")
    .select("status")
    .eq("email", (email as string).toLowerCase().trim())
    .single();

  if (member?.status !== "approved") {
    return NextResponse.json({ error: "not_approved" }, { status: 403 });
  }

  const { error } = await supabase.auth.admin.createUser({
    email: (email as string).toLowerCase().trim(),
    password,
    email_confirm: true,
  });

  if (error) {
    const alreadyExists =
      error.message.toLowerCase().includes("already") ||
      error.message.toLowerCase().includes("registered") ||
      error.message.toLowerCase().includes("exists");
    return NextResponse.json(
      { error: alreadyExists ? "already_exists" : error.message },
      { status: alreadyExists ? 409 : 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
