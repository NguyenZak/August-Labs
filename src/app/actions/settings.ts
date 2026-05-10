"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getSettings(key: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error) {
    console.error(`Error fetching settings for ${key}:`, error);
    return null;
  }

  return data.value;
}

export async function getAllSettings() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("settings")
    .select("*");

  if (error) {
    console.error("Error fetching all settings:", error);
    return [];
  }

  return data;
}

export async function updateSettings(key: string, value: any) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("settings")
    .upsert({ 
      key, 
      value, 
      updated_at: new Date().toISOString() 
    })
    .select();

  if (error) {
    console.error(`Error updating settings for ${key}:`, error);
    return { success: false, error: error.message };
  }

  revalidatePath("/"); // Update public pages
  return { success: true, data };
}
