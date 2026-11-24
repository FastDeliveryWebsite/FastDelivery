import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { signUserToken, USER_COOKIE_NAME } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 1. Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    // 2. Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (checkError) {
      if (checkError.code === "PGRST205" || checkError.message?.includes("schema cache")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Database table 'users' does not exist yet. Please run 'scripts/users-schema.sql' in your Supabase SQL Editor.",
          },
          { status: 500 }
        );
      }
      if (checkError.code === "42501" || checkError.message?.includes("permission denied")) {
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
        { success: false, message: checkError.message },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists. Please log in instead.",
        },
        { status: 400 }
      );
    }

    // 3. Hash password
    const hashedPassword = await hashPassword(password);

    // 4. Create new user record
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from("users")
      .insert([
        {
          name: cleanName,
          email: cleanEmail,
          password_hash: hashedPassword,
          role: "customer",
        },
      ])
      .select("id, name, email, role")
      .single();

    if (insertError || !newUser) {
      if (insertError?.code === "42501" || insertError?.message?.includes("permission denied")) {
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
        {
          success: false,
          message: insertError?.message || "Failed to create user account.",
        },
        { status: 500 }
      );
    }

    // 5. Generate secure JWT token
    const token = await signUserToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: "customer",
    });

    // 6. Set HTTP-Only Cookie
    const res = NextResponse.json({
      success: true,
      message: "Registration successful! Welcome to Fast Delivery.",
      user: newUser,
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
    console.error("Register error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
