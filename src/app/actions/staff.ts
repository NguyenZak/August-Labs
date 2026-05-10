"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Admin client with Service Role Key
const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    console.error("SUPABASE_SERVICE_ROLE_KEY is missing in environment variables.");
    return null;
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export async function createMember(memberData: { email: string; full_name: string; role: string; password?: string }) {
  const adminClient = getAdminClient();
  if (!adminClient) {
    return { success: false, error: "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY. Vui lòng thêm vào file .env.local" };
  }

  // 1. Create User in Auth
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: memberData.email,
    password: memberData.password || "August@2026", // Default password
    email_confirm: true,
    user_metadata: { full_name: memberData.full_name }
  });

  if (authError) return { success: false, error: authError.message };

  // 2. Explicitly create/update profile to ensure it exists (backup for trigger)
  const { error: profileError } = await adminClient
    .from("profiles")
    .upsert({ 
      id: authData.user.id,
      full_name: memberData.full_name,
      role: memberData.role,
      updated_at: new Date().toISOString()
    });

  if (profileError) {
    console.error("Error creating profile explicitly:", profileError);
  }

  revalidatePath("/adminz/staff");
  return { success: true, user: authData.user };
}

// ... existing actions (getAllProfiles, updateMemberRole, deleteMember)
export async function getAllProfiles() {
  const adminClient = getAdminClient();
  if (!adminClient) return [];

  const { data, error } = await adminClient
    .from("profiles")
    .select("*")
    .order("role", { ascending: true });

  if (error) {
    console.error("Error fetching profiles with adminClient:", error);
    return [];
  }
  return data;
}

export async function updateMemberRole(userId: string, role: string) {
  const cookieStore = await cookies();
  const supabase = await createServerClient(cookieStore);

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/adminz/staff");
  return { success: true };
}

export async function deleteMember(userId: string) {
  const adminClient = getAdminClient();
  if (!adminClient) return { success: false, error: "Missing Service Role Key" };

  // Delete from Auth (this also deletes from profiles due to CASCADE)
  const { error } = await adminClient.auth.admin.deleteUser(userId);

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/adminz/staff");
  return { success: true };
}
