import { NextRequest, NextResponse } from "next/server";
import { USER_COOKIE_NAME, verifyUserToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET: Fetch current user's orders from Supabase DB
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(USER_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated", orders: [] }, { status: 401 });
    }

    const payload = await verifyUserToken(token);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: "Invalid session", orders: [] }, { status: 401 });
    }

    // Try fetching orders from Supabase
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .or(`user_id.eq.${payload.id},customer_email.eq.${payload.email}`)
      .order("created_at", { ascending: false });

    if (error) {
      // If table doesn't exist yet, return empty list gracefully
      console.warn("Orders fetch warning:", error.message);
      return NextResponse.json({ success: true, orders: [], tablePending: error.code === "PGRST205" });
    }

    return NextResponse.json({
      success: true,
      orders: data || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message, orders: [] },
      { status: 500 }
    );
  }
}

// POST: Place a new order into Supabase DB
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(USER_COOKIE_NAME)?.value;
    const userPayload = token ? await verifyUserToken(token) : null;

    if (!userPayload?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required. Please log in or register first to place an order." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      landmark,
      pincode,
      notes,
      items,
      payment_method,
    } = body;

    // Validation
    if (!customer_name || !customer_name.trim()) {
      return NextResponse.json({ success: false, message: "Customer full name is required." }, { status: 400 });
    }

    if (!customer_phone || !customer_phone.trim()) {
      return NextResponse.json({ success: false, message: "Contact mobile number is required for delivery." }, { status: 400 });
    }

    if (!delivery_address || !delivery_address.trim()) {
      return NextResponse.json({ success: false, message: "Complete delivery address is required." }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart cannot be empty. Please add items to order." }, { status: 400 });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => {
      const price = Number(item.price || item.product?.price || 0);
      const qty = Number(item.quantity || 1);
      return sum + price * qty;
    }, 0);

    const delivery_fee = 0; // Pure product price only
    const total_amount = subtotal;

    // Generate unique Bilariyaganj Order Number
    const order_number = `FD-${Math.floor(10000 + Math.random() * 90000)}`;

    // Format clean items JSON payload
    const formattedItems = items.map((i: any) => {
      const prod = i.product || i;
      return {
        id: prod.id,
        name: prod.name,
        weight: prod.weight || "1 Unit",
        price: Number(prod.price),
        quantity: Number(i.quantity || 1),
        image: prod.image || "/placeholder.png",
      };
    });

    const newOrderPayload = {
      order_number,
      user_id: userPayload?.id || null,
      customer_name: customer_name.trim(),
      customer_email: customer_email?.trim() || userPayload?.email || "customer@fastdelivery.in",
      customer_phone: customer_phone.trim(),
      delivery_address: delivery_address.trim(),
      landmark: landmark ? landmark.trim() : null,
      pincode: pincode ? pincode.trim() : "276121",
      notes: notes ? notes.trim() : null,
      items: formattedItems,
      subtotal,
      delivery_fee,
      total_amount,
      payment_method: payment_method || "Cash on Delivery",
      status: "Order Placed",
      rider_name: "Bilariyaganj Express Courier",
      rider_phone: "+919876543210",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert([newOrderPayload])
      .select()
      .single();

    if (error) {
      console.error("Error inserting order to Supabase:", error);
      // If table doesn't exist yet, return success with generated order object so client can store locally
      if (error.code === "PGRST205") {
        return NextResponse.json({
          success: true,
          message: "Order placed successfully! (Table pending in Supabase)",
          order: { id: order_number, ...newOrderPayload },
          tablePending: true,
        });
      }

      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      order: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to place order." },
      { status: 500 }
    );
  }
}
