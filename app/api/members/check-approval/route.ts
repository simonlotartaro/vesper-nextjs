import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ approved: false }, { status: 400 });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("members")
    .select("status")
    .eq("email", (email as string).toLowerCase().trim())
    .single();

  return NextResponse.json({ approved: data?.status === "approved" });
}
