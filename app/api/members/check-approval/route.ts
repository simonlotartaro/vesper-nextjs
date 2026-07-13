import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    console.warn("[check-approval] No authenticated user:", authError?.message ?? "no user");
    return NextResponse.json({ approved: false, error: "not_authenticated" }, { status: 401 });
  }

  const email = user.email.toLowerCase().trim();
  console.log(`[check-approval] Checking membership for: ${email}`);

  const admin = createAdminClient();
  const { data, error: dbError } = await admin
    .from("members")
    .select("status, email, name")
    .eq("email", email)
    .maybeSingle();

  if (dbError) {
    console.error(`[check-approval] DB error for ${email}:`, dbError.message, dbError.code);
    return NextResponse.json({ approved: false, error: "membership_check_failed" }, { status: 500 });
  }

  if (!data) {
    console.warn(`[check-approval] No member row found for: ${email}`);
    return NextResponse.json({ approved: false, error: "member_not_found" }, { status: 403 });
  }

  if (data.status !== "approved") {
    console.warn(`[check-approval] Member ${email} has status: "${data.status}" — access denied.`);
    return NextResponse.json({ approved: false, error: "not_approved" }, { status: 403 });
  }

  console.log(`[check-approval] Access granted for: ${email}`);
  return NextResponse.json({ approved: true });
}
