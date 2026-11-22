import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
