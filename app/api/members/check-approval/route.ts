import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.email) {
    console.warn("[check-approval] No authenticated session found.");
    return NextResponse.json({ approved: false }, { status: 401 });
  }

  const email = session.user.email.toLowerCase().trim();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("members")
    .select("status")
    .eq("email", email)
    .single();

  if (error) {
    console.error(`[check-approval] DB error for ${email}:`, error.message);
    return NextResponse.json({ approved: false }, { status: 500 });
  }

  const approved = data?.status === "approved";

  if (!approved) {
    console.warn(`[check-approval] User ${email} not approved (status: ${data?.status ?? "not found"}).`);
  }

  return NextResponse.json({ approved });
}
