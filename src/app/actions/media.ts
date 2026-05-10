"use server";

import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getMediaAssets(parentId: string | null = null) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    let query = supabase
      .from("media_assets")
      .select("*")
      .order("type", { ascending: false }) // Folders first
      .order("name", { ascending: true });

    if (parentId) {
      query = query.eq("parent_id", parentId);
    } else {
      query = query.is("parent_id", null);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  } catch (error: any) {
    console.error("Get Media Assets Error:", error);
    return [];
  }
}

export async function createFolder(name: string, parentId: string | null = null) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("media_assets")
    .insert([{ 
      name, 
      type: "folder", 
      parent_id: parentId 
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/adminz/media");
  return { success: true, data };
}

export async function uploadMediaAsset(
  formData: FormData, 
  parentId: string | null = null
) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Upload to Cloudinary
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "media_library",
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

    // 2. Save to Database (Supabase)
    const { data, error: dbError } = await supabase
      .from("media_assets")
      .insert([{
        name: file.name,
        url: publicUrl,
        type: "image",
        parent_id: parentId,
        size: file.size,
        mime_type: file.type,
        width: result.width,
        height: result.height
      }])
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);

    revalidatePath("/adminz/media");
    return { success: true, data };
  } catch (error: any) {
    console.error("Cloudinary Library Upload Error:", error);
    throw new Error(error.message);
  }
}

export async function deleteAsset(id: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Note: For a complete solution, you might want to delete from Cloudinary too
  // using the public_id, but deleting the record is the priority for UI
  const { error } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/adminz/media");
  return { success: true };
}
