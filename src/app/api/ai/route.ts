import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { action, prompt, text } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API Key. Please restart dev server." }, { status: 500 });
    }

    // DIAGNOSTIC: Get available models for this key
    const getAvailableModels = async () => {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        return data.models?.map((m: any) => m.name.split("/").pop()) || [];
      } catch (e) {
        return [];
      }
    };

    const callGemini = async (modelName: string, content: string) => {
      // Try both v1 and v1beta
      const versions = ["v1", "v1beta"];
      for (const v of versions) {
        try {
          const url = `https://generativelanguage.googleapis.com/${v}/models/${modelName}:generateContent?key=${apiKey}`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: content }] }] })
          });
          const result = await response.json();
          if (response.ok) return result.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } catch (e) { }
      }
      throw new Error(`Model ${modelName} not found or failed`);
    };

    if (action === "generate" || action === "translate") {
      const models = await getAvailableModels();
      if (models.length === 0) {
        return NextResponse.json({ error: "API Key không trả về bất kỳ model nào. Vui lòng kiểm tra lại Key trên Google AI Studio." }, { status: 500 });
      }

      // Pick the best available model
      const preferred = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.5-pro"];
      const modelToUse = preferred.find(p => models.includes(p)) || models[0];

      const aiContent = action === "generate"
        ? `You are a professional F&B Marketing expert for August Agency. Based on this title: "${prompt}", write a professional article in Vietnamese. Format as JSON: {title, excerpt, content}. Return ONLY JSON.`
        : `Translate the following Vietnamese text to professional English for an F&B agency website. Return ONLY the translated text. Text: "${text}"`;

      try {
        const aiText = await callGemini(modelToUse, aiContent);
        return NextResponse.json({ data: aiText });
      } catch (e: any) {
        return NextResponse.json({ error: `Lỗi gọi Model ${modelToUse}. Danh sách khả dụng: ${models.join(", ")}` }, { status: 500 });
      }
    }

    if (action === "generate-image") {
      const randomId = Math.floor(Math.random() * 1000);
      const imageUrl = `https://images.unsplash.com/photo-${randomId}?q=80&w=2000&auto=format&fit=crop`;
      return NextResponse.json({ data: imageUrl });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
