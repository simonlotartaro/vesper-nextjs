import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies to the request so downstream reads are consistent
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Recreate the response so cookie Set-Cookie headers propagate
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — must call getUser() (not getSession()) per Supabase docs
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect /members/* (but not /members-access)
  if (
    pathname.startsWith("/members") &&
    !pathname.startsWith("/members-access")
  ) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/members-access";
      const redirectResponse = NextResponse.redirect(redirectUrl);
      // Forward any cookies set during the session refresh
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return redirectResponse;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match only the routes that need session handling or protection.
     * Explicitly excludes:
     * - /api/* (all API routes, including /api/members/login)
     * - _next/static, _next/image
     * - /assets/*
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/members/:path*",
    "/members-access",
  ],
};
