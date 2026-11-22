import { NextRequest, NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided for upload." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload buffer to ImageKit
    const uploadResult = await imagekit.upload({
      file: buffer,
      fileName: file.name || `img_${Date.now()}`,
      folder: `/fast-delivery/${folder}`,
      useUniqueFileName: true,
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      fileId: uploadResult.fileId,
      name: uploadResult.name,
    });
  } catch (error: any) {
    console.error("ImageKit Upload Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to upload image to ImageKit.",
      },
      { status: 500 }
    );
  }
}
