import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const cookieStore = await cookies();

  // Build the response object first so we can attach Set-Cookie headers to it
  const response = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Persist to the Next.js cookie store (for server-side reads later)
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Route Handlers can set cookies via the response directly
            }
            // Attach to the outgoing response so the browser receives them
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 1. Sign in server-side
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError || !signInData.user) {
    console.warn("[login] Sign-in failed:", signInError?.message);
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const authenticatedEmail = signInData.user.email!.toLowerCase().trim();
  console.log(`[login] Auth OK for: ${authenticatedEmail}`);

  // 2. Check approval using the email from the session — never from the request body
  const admin = createAdminClient();
  const { data: member, error: dbError } = await admin
    .from("members")
    .select("status, name")
    .eq("email", authenticatedEmail)
    .maybeSingle();

  if (dbError) {
    console.error(`[login] DB error for ${authenticatedEmail}:`, dbError.message);
    await supabase.auth.signOut();
    return NextResponse.json({ error: "membership_check_failed" }, { status: 500 });
  }

  if (!member || member.status !== "approved") {
    console.warn(
      `[login] ${authenticatedEmail} not approved (status: ${member?.status ?? "not found"}) — signing out.`
    );
    await supabase.auth.signOut();
    return NextResponse.json({ error: "not_approved" }, { status: 403 });
  }

  console.log(`[login] Access granted for: ${authenticatedEmail}`);
  // Session cookies are already attached to `response` via setAll above
  return response;
}
