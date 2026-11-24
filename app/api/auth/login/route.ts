import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { signUserToken, USER_COOKIE_NAME } from "@/lib/auth";
import { comparePassword } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Please enter your password." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 2. Fetch user from Supabase
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, name, email, password_hash, role")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST205" || error.message?.includes("schema cache")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Database table 'users' does not exist yet. Please run 'scripts/users-schema.sql' in your Supabase SQL Editor.",
          },
          { status: 500 }
        );
      }
      if (error.code === "42501" || error.message?.includes("permission denied")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Database permission error: Please execute 'GRANT ALL ON TABLE public.users TO postgres, anon, authenticated, service_role; ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;' in your Supabase SQL Editor.",
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    if (!user || !user.password_hash) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password. Please try again." },
        { status: 401 }
      );
    }

    // 3. Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password. Please try again." },
        { status: 401 }
      );
    }

    // 4. Generate JWT
    const token = await signUserToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: "customer",
    });

    // 5. Set Cookie
    const res = NextResponse.json({
      success: true,
      message: "Login successful! Welcome back.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "customer",
      },
    });

    res.cookies.set({
      name: USER_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 14 * 24 * 60 * 60, // 14 days
    });

    return res;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
