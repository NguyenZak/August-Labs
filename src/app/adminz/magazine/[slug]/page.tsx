"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Sparkles, Send } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/context/ToastContext";

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [activeLang, setActiveLang] = useState<"vi" | "en">("vi");
  const [postId, setPostId] = useState<string | null>(null);

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
    status: "draft"
  });

  useEffect(() => {
    const fetchPost = async () => {
      const resolvedParams = await params;
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", resolvedParams.slug)
        .single();
      
      if (data) {
        setFormData(data);
        setPostId(data.id);
      } else {
        toast("Không tìm thấy bài viết!", "error");
        router.push("/adminz/magazine");
      }
      setIsLoading(false);
    };
    fetchPost();
  }, [params, router, toast]);

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
      toast("Vui lòng nhập tiêu đề để tạo ảnh!", "error");
      return;
    }

    setIsAiGenerating(true);
    toast("AI đang phân tích nội dung và tạo ảnh...", "info");

    setTimeout(() => {
      const randomId = Math.floor(Math.random() * 1000);
      const aiImageUrl = `https://images.unsplash.com/photo-${randomId}?q=80&w=2000&auto=format&fit=crop`;
      setFormData(prev => ({ ...prev, image_url: aiImageUrl }));
      setIsAiGenerating(false);
      toast("Đã tạo ảnh AI thành công!", "success");
    }, 2000);
  };

  const handleAiGenerate = async () => {
    if (!formData.title_vi && !formData.title_en) {
      toast("Vui lòng nhập tiêu đề để AI có thể viết bài!", "error");
      return;
    }

    setIsAiGenerating(true);
    
    // Simulate AI Generation
    setTimeout(() => {
      const title = activeLang === 'vi' ? formData.title_vi : formData.title_en;
      
      const generatedContent = activeLang === 'vi' 
        ? `Trong bối cảnh thị trường F&B năm 2026 đang thay đổi chóng mặt, việc ${title} không còn là một lựa chọn mà là một yêu cầu sống còn...`
        : `In the rapidly evolving F&B market of 2026, the strategy of ${title} is no longer optional but a vital requirement...`;

      setFormData(prev => ({
        ...prev,
        [activeLang === 'vi' ? 'content_vi' : 'content_en']: generatedContent
      }));
      
      setIsAiGenerating(false);
      toast("AI đã soạn thảo xong bài viết cho bạn!", "success");
    }, 1500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug || !formData.image_url) {
      toast("Vui lòng nhập đầy đủ thông tin bắt buộc!", "error");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("posts")
      .update(formData)
      .eq("id", postId);

    if (!error) {
      toast("Đã cập nhật bài viết thành công!", "success");
      router.push("/adminz/magazine");
    } else {
      toast("Lỗi khi lưu: " + error.message, "error");
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/adminz/magazine" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-headline text-gray-900">Sửa bài viết</h1>
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
            Cập nhật bài viết
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
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

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tiêu đề bài viết</label>
                <input 
                  name={activeLang === 'vi' ? "title_vi" : "title_en"}
                  value={activeLang === 'vi' ? formData.title_vi : formData.title_en}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  className="w-full text-3xl font-headline px-0 py-2 border-0 border-b border-gray-100 focus:border-pink-500 focus:ring-0 placeholder:text-gray-200"
                />
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-pink-50 to-blue-50 rounded-3xl border border-white flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-500 shadow-sm">
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">AI Assistant</p>
                  <p className="text-sm text-gray-500">Tiếp tục tối ưu nội dung bằng AI.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiGenerating}
                className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-2xl font-bold hover:shadow-md transition-all disabled:opacity-50"
              >
                {isAiGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
                Gợi ý nội dung
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tóm tắt (Excerpt)</label>
              <textarea 
                name={activeLang === 'vi' ? "excerpt_vi" : "excerpt_en"}
                value={activeLang === 'vi' ? formData.excerpt_vi : formData.excerpt_en}
                onChange={handleChange}
                rows={3}
                placeholder="Một đoạn mô tả ngắn..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-pink-500 focus:ring-1 bg-gray-50/50 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Nội dung bài viết</label>
              <textarea 
                name={activeLang === 'vi' ? "content_vi" : "content_en"}
                value={activeLang === 'vi' ? formData.content_vi : formData.content_en}
                onChange={handleChange}
                rows={15}
                placeholder="Tiếp tục viết..."
                className="w-full px-6 py-6 rounded-3xl border border-gray-100 focus:border-pink-500 focus:ring-1 bg-gray-50/50 resize-none leading-loose text-lg"
              />
            </div>
          </div>
        </div>

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
        </div>
      </div>
    </div>
  );
}
