import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Public routes that don't require authentication
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  // Onboarding funnel (public acquisition flow)
  "/onboarding-v2",
  "/onboarding",
  "/grass",
  "/email",
  "/path",
  "/expert",
  "/save",
  "/plan",
  "/game",
];

export async function middleware(request: NextRequest) {
  // Skip auth for auth callback routes
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Skip if Supabase env vars are not set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if path is public
  const isPublicPath = PUBLIC_PATHS.includes(request.nextUrl.pathname) ||
    request.nextUrl.pathname.startsWith("/api/game") || // Game leaderboard API is public
    request.nextUrl.pathname.startsWith("/admin"); // Admin routes are protected by admin layout

  // Allow guest users who completed onboarding (email submitted) to access app pages
  const isGuest = request.cookies.has("lawnhq_guest");

  // Redirect unauthenticated users to login for protected pages (unless they're a guest)
  if (!user && !isGuest && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|manifest|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
