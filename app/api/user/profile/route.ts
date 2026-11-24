import { NextRequest, NextResponse } from "next/server";
import { USER_COOKIE_NAME, verifyUserToken, signUserToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET: Fetch current user profile directly from Supabase DB
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(USER_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyUserToken(token);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
    }

    // Fetch fresh user data from database
    const { data: dbUser, error } = await supabaseAdmin
      .from("users")
      .select("id, name, email, role, phone, address, pincode, created_at, updated_at")
      .eq("id", payload.id)
      .maybeSingle();

    if (error || !dbUser) {
      return NextResponse.json({
        success: true,
        user: payload,
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role || "customer",
        phone: dbUser.phone || "",
        address: dbUser.address || "",
        pincode: dbUser.pincode || "276121",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// PUT: Update current user profile directly in Supabase DB
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get(USER_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyUserToken(token);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, address, pincode } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Full Name is required." },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {
      name: name.trim(),
      phone: phone !== undefined && phone !== null ? String(phone).trim() : null,
      address: address !== undefined && address !== null ? String(address).trim() : null,
      pincode: pincode !== undefined && pincode !== null ? String(pincode).trim() : null,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedRecord, error: dbError } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", payload.id)
      .select("id, name, email, role, phone, address, pincode, created_at, updated_at")
      .single();

    if (dbError) {
      console.error("DB profile update error:", dbError);
      return NextResponse.json(
        { success: false, message: dbError.message },
        { status: 400 }
      );
    }

    // Prepare updated user payload
    const updatedUser = {
      ...payload,
      name: updatedRecord.name,
      phone: updatedRecord.phone || "",
      address: updatedRecord.address || "",
      pincode: updatedRecord.pincode || "276121",
    };

    // Re-sign JWT so session has the latest profile info
    const newToken = await signUserToken(updatedUser);

    const response = NextResponse.json({
      success: true,
      message: "Profile details updated and saved to database successfully!",
      user: updatedUser,
    });

    response.cookies.set({
      name: USER_COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
