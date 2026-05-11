"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Trash2, Sparkles, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import { useToast } from "@/context/ToastContext";

export default function NewProjectPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "details">("basic");
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    client: "",
    slug: "",
    category: "Restaurant Chains",
    title_en: "",
    title_vi: "",
    image_url: "",
    bg_color: "bg-gray-50",
    stat_highlight: "",
    booking_url: "",
    menu_images: [] as string[]
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Auto-generate slug and subdomain when client name changes
      if (name === "client") {
        const newSlug = slugify(value);
        if (!prev.slug || prev.slug === slugify(prev.client)) {
          newData.slug = newSlug;
        }
      }
      return newData;
    });
  };

  const handleAddMenuImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      menu_images: [...prev.menu_images, url]
    }));
  };

  const handleRemoveMenuImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      menu_images: prev.menu_images.filter((_: string, i: number) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client || !formData.slug) {
      toast("Vui lòng điền đầy đủ các thông tin bắt buộc!", "error");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("projects").insert([formData]);

    setIsSaving(false);
    if (!error) {
      toast("Đã tạo dự án mới thành công!", "success");
      router.push("/adminz/projects");
      router.refresh();
    } else {
      toast("Lỗi khi tạo dự án: " + error.message, "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/adminz/projects" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-headline text-gray-900">Thêm dự án mới</h1>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab("basic")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'basic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Thông tin cơ bản
        </button>
        <button 
          onClick={() => setActiveTab("details")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'details' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Menu & Hình ảnh
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-8">
        {activeTab === "basic" ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tên khách hàng *</label>
                <input required name="client" value={formData.client} onChange={handleChange} placeholder="Ví dụ: The Coffee House" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Lĩnh vực (Category) *</label>
                <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50 appearance-none">
                  <option value="Restaurant Chains">Chuỗi nhà hàng</option>
                  <option value="Fine Dining">Fine Dining</option>
                  <option value="Cafe & Bakery">Cà phê & Bánh ngọt</option>
                  <option value="App & Tech">Ứng dụng & Công nghệ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Đường dẫn Project (Slug) *</label>
                <div className="relative">
                  <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50 text-sm" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold uppercase">/projects/[slug]</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tiêu đề (Tiếng Việt) *</label>
                <input required name="title_vi" value={formData.title_vi} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tiêu đề (Tiếng Anh) *</label>
                <input required name="title_en" value={formData.title_en} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Link Đặt bàn (Booking URL)</label>
                <input name="booking_url" value={formData.booking_url} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
            </div>

            <div className="space-y-2">
              <ImageUpload 
                label="Hình ảnh dự án chính *"
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                folder="projects"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Số liệu nổi bật (VD: +240%) *</label>
                <input required name="stat_highlight" value={formData.stat_highlight} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Màu nền thẻ</label>
                <select name="bg_color" value={formData.bg_color} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50 appearance-none">
                  <option value="bg-gray-50">Xám</option>
                  <option value="bg-blue-50">Xanh dương</option>
                  <option value="bg-orange-50">Cam</option>
                  <option value="bg-amber-50">Hổ phách</option>
                  <option value="bg-pink-50">Hồng</option>
                  <option value="bg-green-50">Xanh lá</option>
                  <option value="bg-red-50">Đỏ</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Menu Nhà hàng (Hình ảnh)</h3>
                  <p className="text-sm text-gray-500">Upload các trang Menu của nhà hàng khách hàng.</p>
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{formData.menu_images.length} ảnh</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.menu_images.map((img: string, idx: number) => (
                  <div key={idx} className="group relative aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                    <img src={img} alt={`Menu ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => handleRemoveMenuImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <div className="aspect-[3/4]">
                  <ImageUpload 
                    label="Thêm ảnh"
                    value=""
                    onChange={(url) => handleAddMenuImage(url)}
                    folder="menus"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Lưu dự án
          </button>
        </div>
      </form>
    </div>
  );
}
