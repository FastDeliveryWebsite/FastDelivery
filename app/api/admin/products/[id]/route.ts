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

    const { data, error } = await supabaseAdmin
      .from("products")
      .update({
        name: name.trim(),
        category_id: category_id || null,
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
