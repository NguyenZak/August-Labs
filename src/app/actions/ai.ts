"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function generateSEOData(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Bạn là một chuyên gia SEO (Search Engine Optimization) và Copywriter cấp cao làm việc cho August Agency - một Creative & Marketing Agency cao cấp. 
Nhiệm vụ của bạn là đọc nội dung (hoặc thông tin dự án) được cung cấp và tạo ra bộ thẻ Meta SEO tối ưu nhất để giúp trang web đạt thứ hạng cao trên Google và tăng tỷ lệ click (CTR).

YÊU CẦU NGHIÊM NGẶT:
1. SEO Title (Tiêu đề): 
- Độ dài: Tối đa 60 ký tự.
- Viết hấp dẫn, kích thích sự tò mò hoặc thể hiện rõ giá trị cốt lõi. Luôn chứa từ khoá chính.
- Thêm hậu tố " | August Agency" nếu còn đủ số lượng ký tự.

2. SEO Description (Mô tả):
- Độ dài: Tối đa 155-160 ký tự.
- Tóm tắt súc tích, lôi cuốn nhất về dự án/bài viết.
- Phải chứa từ khóa chính và từ khóa phụ (Semantic Keywords).
- Luôn kết thúc bằng một Lời kêu gọi hành động (Call to action) tinh tế.

3. SEO Keywords (Từ khóa):
- Đưa ra chính xác 5 đến 8 từ khóa quan trọng nhất.
- Bao gồm cả từ khóa ngắn và từ khóa dài.

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC (Chỉ trả về JSON thuần túy, không markdown, không giải thích thêm, không có thẻ \`\`\`json):
{
  "seo_title": "...",
  "seo_description": "...",
  "seo_keywords": ["keyword 1", "keyword 2", "..."]
}

Nội dung cần phân tích SEO: 
${content}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating SEO:", error);
    throw new Error("Failed to generate SEO data");
  }
}
