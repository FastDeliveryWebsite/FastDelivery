import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const inputPassword = String(password);

    // Query admin user STRICTLY from Supabase "admins" table (Zero credentials stored in code or .env)
    const { data: dbAdmin, error: dbError } = await supabaseAdmin
      .from("admins")
      .select("*")
      .ilike("email", trimmedEmail)
      .maybeSingle();

    if (dbError) {
      console.error("Supabase admin query error:", dbError);
      return NextResponse.json(
        {
          success: false,
          message: `Database permission error: ${dbError.message || "Please run GRANT SELECT ON public.admins TO service_role in Supabase."}`,
        },
        { status: 500 }
      );
    }

    if (!dbAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password. Admin account not found.",
        },
        { status: 401 }
      );
    }

    // Verify password: checks bcrypt hash (if password_hash exists) or direct match (if password column is used)
    let isPasswordValid = false;

    if (dbAdmin.password_hash) {
      isPasswordValid = await bcrypt.compare(inputPassword, dbAdmin.password_hash);
    }

    if (!isPasswordValid && dbAdmin.password) {
      isPasswordValid = dbAdmin.password === inputPassword;
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password. Please check your credentials.",
        },
        { status: 401 }
      );
    }

    const adminPayload = {
      id: String(dbAdmin.id || "admin"),
      email: dbAdmin.email,
      name: dbAdmin.name || "Fast Delivery Admin",
      role: "admin" as const,
    };

    // Generate custom JWT token (Valid for 7 days)
    const token = await signAdminToken(adminPayload);

    // Set secure HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      message: "Admin login successful",
      admin: adminPayload,
      token,
    });
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred during login.",
      },
      { status: 500 }
    );
  }
}
