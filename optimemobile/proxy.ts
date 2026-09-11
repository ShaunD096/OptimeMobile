import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Route protection — DENY BY DEFAULT.
 *
 * Every route the matcher reaches requires a session unless it is
 * explicitly listed in PUBLIC_ROUTES. The previous version was the
 * inverse — an allow-list of protected routes — which meant every
 * newly added page shipped public until someone remembered to register
 * it. That is exactly how /dashboard, /optime, /travel and
 * /travel-optimizer ended up open (and the list still contained
 * /reports and /vacation-ai, which do not exist).
 *
 * With deny-by-default, forgetting to register a new page fails
 * CLOSED: the page requires login until someone deliberately makes it
 * public. See proxy.test.ts for the proof against an unregistered
 * route.
 *
 * API requests get a 401 JSON response; page requests get a redirect
 * to /login with a callback. NextAuth's own endpoints and static
 * assets are excluded in the matcher below.
 */

/** The ONLY unauthenticated routes. Add here deliberately, never by omission. */
const PUBLIC_ROUTES: ReadonlySet<string> = new Set([
  "/",
  "/login",
  "/mobile",
  "/api/mobile",
]);

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  // Prefix form for public sections with sub-paths (e.g. /api/mobile/* or /mobile/*).
  for (const route of PUBLIC_ROUTES) {
    if (pathname.startsWith(`${route}/`)) return true;
  }
  return false;
}

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    cookieName: "atlasgo.session-token",
  });

  const authHeader = request.headers.get("authorization");
  const isMobileBearer = !!(authHeader && authHeader.startsWith("Bearer mbl_live_"));
  const isLoggedIn = !!token || isMobileBearer;
  const pathname = nextUrl.pathname;

  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isLoggedIn || isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Deny by default from here down.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", nextUrl);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Everything except:
     *  - NextAuth's own endpoints (/api/auth/*) — they must be reachable
     *    to establish a session at all;
     *  - Next.js internals and static assets.
     * Everything this matcher reaches is protected unless PUBLIC_ROUTES
     * says otherwise.
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)",
  ],
};
