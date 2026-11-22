import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");

    let query = supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
    } else if (category && category !== "all") {
      query = query.ilike("category_name", `%${category.trim()}%`);
    }

    if (search && search.trim()) {
      query = query.ilike("name", `%${search.trim()}%`);
    }

    if (limit && !isNaN(Number(limit))) {
      query = query.limit(Number(limit));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching public products:", error);
      return NextResponse.json(
        { success: false, message: error.message, products: [] },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, products: data || [] },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message, products: [] },
      { status: 500 }
    );
  }
}
