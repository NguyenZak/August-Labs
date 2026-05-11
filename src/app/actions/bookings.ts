"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { sendTelegramNotification } from "./telegram";

export async function submitBooking(formData: {
  client_name: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  note?: string;
  project_id: string;
  brand_name: string;
}) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        client_name: formData.client_name,
        phone: formData.phone,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        guests: formData.guests,
        note: formData.note,
        project_id: formData.project_id,
        status: 'pending'
      },
    ])
    .select();

  if (error) {
    console.error("Error submitting booking:", error);
    return { success: false, error: error.message };
  }

  // Send Telegram Notification
  const dateFormatted = new Date(formData.booking_date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric'
  });

  const message = `
<b>🍽 CÓ YÊU CẦU ĐẶT BÀN MỚI!</b>
-------------------------
🏢 <b>Nhà hàng:</b> ${formData.brand_name}
👤 <b>Khách hàng:</b> ${formData.client_name}
📞 <b>SĐT:</b> ${formData.phone}
👥 <b>Số khách:</b> ${formData.guests} người
⏰ <b>Giờ đến:</b> ${formData.booking_time}
📅 <b>Ngày đến:</b> ${dateFormatted}
📝 <b>Ghi chú:</b> ${formData.note || "N/A"}
-------------------------
📅 <i>Thời gian gửi: ${new Date().toLocaleString("vi-VN")}</i>

`;

  await sendTelegramNotification(message);

  return { success: true, data };
}
