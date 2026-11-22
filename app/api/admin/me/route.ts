import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    let token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: "No active admin session" },
        { status: 401 }
      );
    }

    const payload = await verifyAdminToken(token);
    if (!payload) {
      return NextResponse.json(
        { authenticated: false, message: "Session expired or invalid" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      admin: payload,
    });
  } catch {
    return NextResponse.json(
      { authenticated: false, message: "Authentication check failed" },
      { status: 500 }
    );
  }
}
