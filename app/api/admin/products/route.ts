import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// GET: Fetch all products (supports filtering by category_id or search)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");

    let query = supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
    }

    if (search && search.trim()) {
      query = query.ilike("name", `%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
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

// POST: Create a new product (No stock status)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      category_id,
      category_name,
      weight,
      price,
      original_price,
      image,
      specifications,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Product name is required." },
        { status: 400 }
      );
    }

    if (!category_name || !category_name.trim()) {
      return NextResponse.json(
        { success: false, message: "Category is required." },
        { status: 400 }
      );
    }

    if (!price || isNaN(Number(price))) {
      return NextResponse.json(
        { success: false, message: "Valid product price is required." },
        { status: 400 }
      );
    }

    if (!image || !image.trim()) {
      return NextResponse.json(
        { success: false, message: "Product image is required." },
        { status: 400 }
      );
    }

    // Safely resolve category_id (must be a valid UUID or null for PostgreSQL)
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let resolvedCategoryId: string | null = null;

    if (category_id && UUID_REGEX.test(String(category_id))) {
      resolvedCategoryId = String(category_id);
    } else {
      // Look up real category ID by slug or name in categories table
      try {
        const searchKey = category_id || category_name;
        const { data: matchedCat } = await supabaseAdmin
          .from("categories")
          .select("id")
          .or(`slug.eq.${searchKey},name.ilike.%${category_name}%`)
          .limit(1)
          .maybeSingle();

        if (matchedCat?.id && UUID_REGEX.test(matchedCat.id)) {
          resolvedCategoryId = matchedCat.id;
        }
      } catch (catLookupErr) {
        console.warn("Category lookup fallback:", catLookupErr);
      }
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([
        {
          name: name.trim(),
          category_id: resolvedCategoryId,
          category_name: category_name.trim(),
          weight: (weight && weight.trim()) ? weight.trim() : "1 Unit",
          price: Number(price),
          original_price: original_price ? Number(original_price) : null,
          image: image.trim(),
          specifications: specifications || [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting product:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
