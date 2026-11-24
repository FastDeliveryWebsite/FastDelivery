import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// PATCH: Update order status & delivery details
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, rider_name, rider_phone } = body;

    const validStatuses = [
      "Order Placed",
      "Packed at Mandi",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid status. Valid values: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updates.status = status;
    if (rider_name !== undefined) updates.rider_name = rider_name;
    if (rider_phone !== undefined) updates.rider_phone = rider_phone;

    // Update by id (UUID) or order_number
    let query = supabaseAdmin.from("orders").update(updates);
    if (id.startsWith("FD-")) {
      query = query.eq("order_number", id);
    } else {
      query = query.eq("id", id);
    }

    const { data, error } = await query.select().single();

    if (error) {
      console.error("Order status update error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order status successfully updated to "${status}"!`,
      order: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
