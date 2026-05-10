"use server";

import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(formData: FormData, folder: string = "august_agency") {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder,
          format: "webp", // Tự động chuyển sang WebP
          quality: "auto", // Tự động tối ưu dung lượng
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      ).end(buffer);
    });

    const publicUrl = result.secure_url;

    // Save to media_assets for consistency
    await supabase
      .from("media_assets")
      .insert([{
        name: file.name,
        url: publicUrl,
        type: "image",
        size: file.size,
        mime_type: file.type,
        width: result.width,
        height: result.height,
        folder_path: "/"
      }]);

    return publicUrl;
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(error.message || "Failed to upload to Cloudinary");
  }
}
