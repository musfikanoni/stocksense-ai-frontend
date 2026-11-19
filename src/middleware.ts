import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add standard security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Route alias: /dashboard, /watchlist, /alerts, /settings, /subscription, /stocks/*
  // seamlessly map to /user/* if accessed via standard clean URLs
  const userSubRoutes = ["dashboard", "watchlist", "alerts", "settings", "subscription", "stocks"];
  const firstSegment = pathname.split("/")[1];

  if (userSubRoutes.includes(firstSegment)) {
    const url = request.nextUrl.clone();
    url.pathname = `/user${pathname}`;
    return NextResponse.rewrite(url, { headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - landing/ (landing images)
     * - logo.png
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|logo.png|landing|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
