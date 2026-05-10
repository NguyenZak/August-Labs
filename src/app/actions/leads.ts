"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function submitLead(formData: {
  name: string;
  email: string;
  phone?: string;
  brand?: string;
  service?: string;
  budget?: string;
  message?: string;
}) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        brand: formData.brand,
        service: formData.service,
        budget: formData.budget,
        message: formData.message,
      },
    ])
    .select();

  if (error) {
    console.error("Error submitting lead:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getLeads() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function updateLeadStatus(id: string, status: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating lead:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
