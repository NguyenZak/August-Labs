"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Sparkles, Image as ImageIcon, Send } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import SEOPanel from "@/components/admin/SEOPanel";
import { useToast } from "@/context/ToastContext";

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [activeLang, setActiveLang] = useState<"vi" | "en">("vi");

  const [formData, setFormData] = useState({
    slug: "",
    title_en: "",
    title_vi: "",
    excerpt_en: "",
    excerpt_vi: "",
    content_en: "",
    content_vi: "",
    image_url: "",
    category: "Strategy",
    author: "August Team",
    status: "draft",
    seo_title: "",
    seo_description: "",
    seo_keywords: [] as string[],
    og_title: "",
    og_description: "",
    og_image: "",
    canonical_url: "",
    no_index: false,
    no_follow: false,
  });

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Auto-sync slug if it matches the previous title's slug or is empty
      if (name === "title_vi") {
        const oldSlug = slugify(prev.title_vi);
        if (prev.slug === "" || prev.slug === oldSlug) {
          newData.slug = slugify(value);
        }
      }
      return newData;
    });
  };

  const handleGenerateImage = async () => {
    const title = formData.title_vi || formData.title_en;
    if (!title) {
      toast("Vui lòng nhập tiêu đề để AI hiểu nội dung cần vẽ!", "error");
      return;
    }

    setIsAiGenerating(true);
    toast("AI đang vẽ ảnh minh họa cho bài viết...", "info");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ action: "generate-image", prompt: title }),
      });
      const { data, error } = await response.json();
      
      if (error) throw new Error(error);

      setFormData(prev => ({ ...prev, image_url: data }));
      toast("Đã vẽ ảnh AI thành công!", "success");
    } catch (error: any) {
      toast("Lỗi khi tạo ảnh: " + error.message, "error");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAiTranslate = async () => {
    if (!formData.title_vi && !formData.content_vi) {
      toast("Vui lòng nhập nội dung Tiếng Việt trước khi dịch!", "error");
      return;
    }

    setIsAiGenerating(true);
    toast("Gemini đang dịch nội dung sang Tiếng Anh...", "info");

    try {
      // 1. Dịch tiêu đề
      const response = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ action: "translate", text: formData.title_vi }),
      });
      const resData = await response.json();
      const titleEn = response.ok ? resData.data : "";

      // 2. Dịch tóm tắt
      const excerptResponse = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ action: "translate", text: formData.excerpt_vi }),
      });
      const resExcerptData = await excerptResponse.json();
      const excerptEn = excerptResponse.ok ? resExcerptData.data : "";

      // 3. Dịch nội dung
      const contentResponse = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ action: "translate", text: formData.content_vi }),
      });
      const resContentData = await contentResponse.json();
      const contentEn = contentResponse.ok ? resContentData.data : "";

      setFormData(prev => ({
        ...prev,
        title_en: titleEn || prev.title_en,
        excerpt_en: excerptEn || prev.excerpt_en,
        content_en: contentEn || prev.content_en,
        slug: titleEn ? slugify(titleEn) : prev.slug
      }));
      toast("Đã dịch xong bằng Gemini!", "success");
    } catch (error: any) {
      toast("Lỗi Gemini: " + error.message, "error");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!formData.title_vi) {
      toast("Vui lòng nhập tiêu đề Tiếng Việt!", "error");
      return;
    }

    setIsAiGenerating(true);
    toast("Gemini đang soạn thảo bài viết...", "info");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ action: "generate", prompt: formData.title_vi }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Lỗi API");
      }

      if (!result.data) {
        throw new Error("AI không trả về dữ liệu");
      }

      // Attempt to parse JSON from Gemini response
      const cleanJson = result.data.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      setFormData(prev => ({
        ...prev,
        title_vi: parsed.title || prev.title_vi,
        excerpt_vi: parsed.excerpt || prev.excerpt_vi,
        content_vi: parsed.content || prev.content_vi,
        slug: slugify(parsed.title || prev.title_vi)
      }));
      toast("Gemini đã hoàn tất bài viết!", "success");
    } catch (error) {
      console.error(error);
      toast("Có lỗi khi gọi Gemini. Hãy kiểm tra API Key.", "error");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug || !formData.image_url) {
      toast("Vui lòng nhập đầy đủ thông tin bắt buộc!", "error");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("posts").insert([formData]);

    if (!error) {
      toast("Đã lưu bài viết thành công!", "success");
      router.push("/adminz/magazine");
    } else {
      toast("Lỗi khi lưu: " + error.message, "error");
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/adminz/magazine" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-headline text-gray-900">Viết bài Magazine</h1>
        </div>
        <div className="flex items-center gap-4">
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white outline-none"
          >
            <option value="draft">Bản nháp</option>
            <option value="published">Xuất bản</option>
          </select>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Lưu bài viết
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
            {/* Language Switcher */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
              <button 
                onClick={() => setActiveLang("vi")}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeLang === 'vi' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Tiếng Việt
              </button>
              <button 
                onClick={() => setActiveLang("en")}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeLang === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Tiếng Anh
              </button>
            </div>

            {/* Title Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tiêu đề bài viết</label>
                <input 
                  required 
                  name={activeLang === 'vi' ? "title_vi" : "title_en"}
                  value={activeLang === 'vi' ? formData.title_vi : formData.title_en}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  className="w-full text-3xl font-headline px-0 py-2 border-0 border-b border-gray-100 focus:border-pink-500 focus:ring-0 placeholder:text-gray-200"
                />
              </div>
            </div>

            {/* AI Generator Bar */}
            <div className="p-6 bg-gradient-to-r from-pink-50 to-blue-50 rounded-3xl border border-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-500 shadow-sm">
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">AI Assistant</p>
                  <p className="text-sm text-gray-500">Tạo nội dung và dịch thuật tự động.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  type="button"
                  onClick={handleAiTranslate}
                  disabled={isAiGenerating}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-2xl font-bold hover:shadow-md transition-all border border-gray-100"
                >
                  Dịch sang English
                </button>
                <button 
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={isAiGenerating}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-md transition-all disabled:opacity-50"
                >
                  {isAiGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
                  Gợi ý nội dung
                </button>
              </div>
            </div>

            {/* Excerpt Section */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tóm tắt (Excerpt)</label>
              <textarea 
                name={activeLang === 'vi' ? "excerpt_vi" : "excerpt_en"}
                value={activeLang === 'vi' ? formData.excerpt_vi : formData.excerpt_en}
                onChange={handleChange}
                rows={3}
                placeholder="Một đoạn mô tả ngắn để thu hút người đọc..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-pink-500 focus:ring-1 bg-gray-50/50 resize-none"
              />
            </div>

            {/* Content Section */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Nội dung bài viết</label>
              <textarea 
                name={activeLang === 'vi' ? "content_vi" : "content_en"}
                value={activeLang === 'vi' ? formData.content_vi : formData.content_en}
                onChange={handleChange}
                rows={15}
                placeholder="Bắt đầu viết những kiến thức tuyệt vời..."
                className="w-full px-6 py-6 rounded-3xl border border-gray-100 focus:border-pink-500 focus:ring-1 bg-gray-50/50 resize-none leading-loose text-lg"
              />
            </div>
          </div>

          <SEOPanel 
            data={formData}
            onChange={(seoData) => setFormData(prev => ({ ...prev, ...seoData }))}
            baseUrl="https://viz.io.vn/magazine"
            slug={formData.slug}
            defaultTitle={formData.title_vi}
            defaultDescription={formData.excerpt_vi}
            defaultImage={formData.image_url}
          />
        </div>

        {/* Sidebar Info Area */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900">Thiết lập bài viết</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Đường dẫn bài viết (Slug)</label>
              <input 
                name="slug" 
                value={formData.slug} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Danh mục</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none"
              >
                <option value="Strategy">Strategy</option>
                <option value="Data & Trends">Data & Trends</option>
                <option value="Technology">Technology</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Tác giả</label>
              <input 
                name="author" 
                value={formData.author} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm" 
              />
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Ảnh bìa bài viết *</label>
                <button 
                  type="button"
                  onClick={handleGenerateImage}
                  disabled={isAiGenerating}
                  className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1 transition-colors"
                >
                  <Sparkles size={14} />
                  Tạo ảnh bằng AI
                </button>
              </div>
              <ImageUpload 
                label=""
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                folder="blog"
              />
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-[32px] text-white space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <h4 className="font-bold">Mẹo viết bài AI</h4>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Hãy nhập tiêu đề thật chi tiết, ví dụ: "Cách tối ưu tỷ lệ đặt bàn qua TikTok cho nhà hàng Fine Dining". AI sẽ tạo ra cấu trúc bài viết chuyên sâu hơn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
