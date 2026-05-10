"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Save, Image as ImageIcon, Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/context/ToastContext";

export default function EditHeroPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    tag_en: "", tag_vi: "",
    title1_en: "", title1_vi: "",
    title2_en: "", title2_vi: "",
    desc_en: "", desc_vi: "",
    image_url: "",
    bookings_text: "",
    growth_percent: ""
  });

  const supabase = createClient();

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    const { data, error } = await supabase.from("hero_content").select("*").eq("id", 1).single();
    if (data) {
      setFormData(data);
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { error } = await supabase
      .from("hero_content")
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
      .eq("id", 1);

    setIsSaving(false);
    if (!error) {
      toast("Cập nhật nội dung Hero thành công!", "success");
    } else {
      toast("Lỗi khi lưu: " + error.message, "error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-pink-500" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline text-gray-900 mb-2">Chỉnh sửa Hero Section</h1>
          <p className="text-gray-500">Cập nhật văn bản và hình ảnh banner chính trên trang chủ.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu thay đổi
        </button>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-2 gap-8" onSubmit={handleSave}>
        
        {/* English Content */}
        <div className="bg-white p-6 md:p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">EN</span>
            <h2 className="text-xl font-headline text-gray-900">Nội dung tiếng Anh</h2>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Tagline trên cùng</label>
            <input name="tag_en" value={formData.tag_en} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-gray-50/50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Tiêu đề (Phần 1 - Chữ đen)</label>
            <input name="title1_en" value={formData.title1_en} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-gray-50/50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Tiêu đề (Phần 2 - Gradient)</label>
            <input name="title2_en" value={formData.title2_en} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-gray-50/50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Mô tả</label>
            <textarea name="desc_en" rows={4} value={formData.desc_en} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-gray-50/50 resize-none" />
          </div>
        </div>

        {/* Vietnamese Content */}
        <div className="bg-white p-6 md:p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">VI</span>
            <h2 className="text-xl font-headline text-gray-900">Nội dung tiếng Việt</h2>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Top Tagline</label>
            <input name="tag_vi" value={formData.tag_vi} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-gray-50/50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Headline (Part 1 - Black)</label>
            <input name="title1_vi" value={formData.title1_vi} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-gray-50/50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Headline (Part 2 - Gradient)</label>
            <input name="title2_vi" value={formData.title2_vi} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-gray-50/50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea name="desc_vi" rows={4} value={formData.desc_vi} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-gray-50/50 resize-none" />
          </div>
        </div>

        {/* Media & Visuals */}
        <div className="bg-white p-6 md:p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="text-pink-500 w-6 h-6" />
            <h2 className="text-xl font-headline text-gray-900">Hình ảnh & Số liệu</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <ImageUpload 
                label="Main Image"
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                folder="hero"
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tên thương hiệu (hiện trên ảnh)</label>
                <input name="bookings_text" value={formData.bookings_text} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Số phần trăm tăng trưởng</label>
                <input name="growth_percent" value={formData.growth_percent} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-gray-50/50" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
