"use server";

export async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram credentials missing. Token:", !!token, "ChatID:", !!chatId);
    return { success: false, error: "Telegram credentials missing" };
  }
  
  console.log(`Sending Telegram notification to ${chatId}...`);

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("Telegram API error:", data);
      return { success: false, error: data.description };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to send Telegram notification:", error);
    return { success: false, error: error.message };
  }
}
