import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminToken,
  ADMIN_COOKIE_NAME,
  verifyUserToken,
  USER_COOKIE_NAME,
} from "./lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Protect Admin API Routes (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    // Whitelist login endpoint
    if (pathname === "/api/admin/login") {
      return NextResponse.next();
    }

    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const admin = token ? await verifyAdminToken(token) : null;

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 2. Protect Admin Frontend Pages (/admin/*)
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const admin = token ? await verifyAdminToken(token) : null;

    // A. If visiting admin login while authenticated -> redirect to admin dashboard
    if (pathname === "/admin/login") {
      if (admin) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // B. If visiting root /admin -> redirect to dashboard or login
    if (pathname === "/admin") {
      if (admin) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // C. For any other /admin/* routes -> require admin authentication
    if (!admin) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. User Authentication Routes
  const userToken = req.cookies.get(USER_COOKIE_NAME)?.value;
  const user = userToken ? await verifyUserToken(userToken) : null;

  // A. Protect /dashboard (and subpaths) -> require user authentication
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // B. If user is already logged in and visits /login or /register -> redirect to /dashboard
  if (pathname === "/login" || pathname === "/register") {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
