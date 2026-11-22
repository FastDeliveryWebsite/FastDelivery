import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const admin = token ? await verifyAdminToken(token) : null;

    // 1. If trying to visit login page while already authenticated -> redirect to dashboard
    if (pathname === "/admin/login") {
      if (admin) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // 2. If trying to visit root /admin -> redirect to dashboard (or login if unauthenticated)
    if (pathname === "/admin") {
      if (admin) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // 3. For any other /admin/* routes -> require authentication
    if (!admin) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
