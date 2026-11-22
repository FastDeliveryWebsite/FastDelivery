import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET: Fetch all categories
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
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

// POST: Create a new category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, image } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Category name is required." },
        { status: 400 }
      );
    }

    const categorySlug = (slug && slug.trim()) ? generateSlug(slug) : generateSlug(name);

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert([
        {
          name: name.trim(),
          slug: categorySlug,
          image: image || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting category:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      category: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
