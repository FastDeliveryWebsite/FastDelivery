import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// POST: Save contact inquiry from customer into database
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, subject, message } = body;

    // Validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide your full name." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid mobile number so we can reach you." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, message: "Please enter your message or query details." },
        { status: 400 }
      );
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email && typeof email === "string" ? email.trim().toLowerCase() : null,
      subject: subject && typeof subject === "string" ? subject.trim() : "General Inquiry",
      message: message.trim(),
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Error inserting contact message:", error);
      if (error.code === "PGRST205" || error.message?.includes("schema cache") || error.message?.includes("contact_messages")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Database table 'contact_messages' does not exist yet. Please execute 'scripts/contact-messages-schema.sql' in Supabase SQL editor.",
            tablePending: true,
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { success: false, message: error.message || "Failed to submit inquiry. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your inquiry has been submitted successfully. Our Bilariyaganj team will reach out to you shortly.",
      inquiry: data,
    });
  } catch (err: any) {
    console.error("Contact API Exception:", err);
    return NextResponse.json(
      { success: false, message: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
