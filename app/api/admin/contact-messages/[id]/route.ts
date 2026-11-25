import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// PATCH: Update contact inquiry status or reply
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Inquiry ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, admin_reply } = body;

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) updates.status = status;
    if (admin_reply !== undefined) updates.admin_reply = admin_reply;

    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating contact message:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Customer inquiry updated successfully.",
      inquiry: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a contact inquiry
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Inquiry ID is required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting contact message:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
