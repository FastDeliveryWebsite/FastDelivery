import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken, USER_COOKIE_NAME } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(USER_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    const payload = await verifyUserToken(token);
    if (!payload?.id) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    // Fetch fresh user details directly from Supabase DB
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("id, name, email, role, phone, address, pincode")
      .eq("id", payload.id)
      .maybeSingle();

    const user = {
      ...payload,
      name: dbUser?.name || payload.name,
      email: dbUser?.email || payload.email,
      phone: dbUser?.phone || payload.phone || "",
      address: dbUser?.address || payload.address || "",
      pincode: dbUser?.pincode || payload.pincode || "276121",
    };

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (err: any) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      error: err.message,
    });
  }
}
