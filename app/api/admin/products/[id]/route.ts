import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// PUT: Update product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
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

    // Safely resolve category_id (must be a valid UUID or null for PostgreSQL)
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let resolvedCategoryId: string | null = null;

    if (category_id && UUID_REGEX.test(String(category_id))) {
      resolvedCategoryId = String(category_id);
    } else if (category_id || category_name) {
      try {
        const searchKey = category_id || category_name;
        const { data: matchedCat } = await supabaseAdmin
          .from("categories")
          .select("id")
          .or(`slug.eq.${searchKey},name.ilike.%${category_name || searchKey}%`)
          .limit(1)
          .maybeSingle();

        if (matchedCat?.id && UUID_REGEX.test(matchedCat.id)) {
          resolvedCategoryId = matchedCat.id;
        }
      } catch (catLookupErr) {
        console.warn("Category lookup fallback on update:", catLookupErr);
      }
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .update({
        name: name.trim(),
        category_id: resolvedCategoryId,
        category_name: category_name ? category_name.trim() : undefined,
        weight: weight ? weight.trim() : "1 Unit",
        price: Number(price),
        original_price: original_price ? Number(original_price) : null,
        image: image ? image.trim() : undefined,
        specifications: specifications || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete product
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
