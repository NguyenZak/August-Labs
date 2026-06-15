"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { createClient as createAdminClient } from "@supabase/supabase-js";

// Define admin client for reading public settings bypassing RLS
const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getSettings(key: string) {
  const { data, error } = await adminSupabase
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
  const { data, error } = await adminSupabase
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
