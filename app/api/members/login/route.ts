import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const TIMEOUT_MS = 12_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export async function POST(req: Request) {
  console.log("[login] POST /api/members/login received");

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      console.warn("[login] Missing email or password in request body");
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    console.log(`[login] Attempting sign-in for: ${email}`);

    const cookieStore = await cookies();
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
            console.log(`[login] Setting ${cookiesToSet.length} session cookie(s)`);
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                cookieStore.set(name, value, options);
              } catch {
                // Route Handlers set cookies via the response object directly
              }
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // 1. Sign in server-side with timeout
    console.log("[login] Calling signInWithPassword…");
    const { data: signInData, error: signInError } = await withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      TIMEOUT_MS
    );

    if (signInError || !signInData.user) {
      console.warn("[login] Sign-in failed:", signInError?.message ?? "no user returned");
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const authenticatedEmail = signInData.user.email!.toLowerCase().trim();
    console.log(`[login] Auth OK for: ${authenticatedEmail}`);

    // 2. Check approval — email comes from the authenticated session, not the request body
    console.log(`[login] Querying members table for: ${authenticatedEmail}`);
    const admin = createAdminClient();
    const dbQuery = Promise.resolve(
      admin
        .from("members")
        .select("status, name")
        .eq("email", authenticatedEmail)
        .maybeSingle()
    );
    const { data: member, error: dbError } = await withTimeout(dbQuery, TIMEOUT_MS);

    if (dbError) {
      console.error(`[login] DB error for ${authenticatedEmail}:`, dbError.message, dbError.code);
      await supabase.auth.signOut();
      return NextResponse.json({ error: "membership_check_failed" }, { status: 500 });
    }

    if (!member || member.status !== "approved") {
      console.warn(
        `[login] ${authenticatedEmail} not approved (status: ${member?.status ?? "not found"}) — signing out`
      );
      await supabase.auth.signOut();
      return NextResponse.json({ error: "not_approved" }, { status: 403 });
    }

    console.log(`[login] Access granted for: ${authenticatedEmail} — returning response with session cookies`);
    return response;

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[login] Unhandled error:", message);
    return NextResponse.json({ error: "login_failed" }, { status: 500 });
  }
}
