import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching public categories:", error);
      return NextResponse.json(
        { success: false, message: error.message, categories: [] },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, categories: data || [] },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message, categories: [] },
      { status: 500 }
    );
  }
}
