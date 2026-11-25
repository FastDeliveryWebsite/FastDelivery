import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// GET: Fetch all customer contact messages for admin
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin contact messages fetch error:", error);
      // Graceful handling if table not created yet
      if (error.code === "PGRST205" || error.message?.includes("schema cache") || error.message?.includes("contact_messages")) {
        return NextResponse.json({
          success: true,
          messages: [],
          tablePending: true,
        });
      }
      return NextResponse.json(
        { success: false, message: error.message, messages: [] },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messages: data || [] },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message, messages: [] },
      { status: 500 }
    );
  }
}
