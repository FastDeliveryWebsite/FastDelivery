import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// PUT: Update category
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;
    const body = await req.json();
    const { name, slug, image } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Category name is required." },
        { status: 400 }
      );
    }

    const categorySlug = (slug && slug.trim()) ? generateSlug(slug) : generateSlug(name);

    // Fetch existing category to get old name for cascade
    const { data: oldCategory } = await supabaseAdmin
      .from("categories")
      .select("name")
      .eq("id", categoryId)
      .single();

    // 1. Update category
    const updatePayload: Record<string, any> = {
      name: name.trim(),
      slug: categorySlug,
      updated_at: new Date().toISOString(),
    };
    if (image !== undefined) {
      updatePayload.image = image || null;
    }

    const { data, error } = await supabaseAdmin
      .from("categories")
      .update(updatePayload)
      .eq("id", categoryId)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    // 2. Cascade category name update to all linked products in the products table
    try {
      await supabaseAdmin
        .from("products")
        .update({
          category_name: name.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("category_id", categoryId);

      if (oldCategory?.name && oldCategory.name !== name.trim()) {
        await supabaseAdmin
          .from("products")
          .update({
            category_name: name.trim(),
            category_id: categoryId,
            updated_at: new Date().toISOString(),
          })
          .eq("category_name", oldCategory.name);
      }
    } catch (cascadeErr) {
      console.error("Error cascading category name to products:", cascadeErr);
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      category: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete category
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    const { error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      console.error("Error deleting category:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
