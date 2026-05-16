"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Trash2, Sparkles } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import SEOPanel from "@/components/admin/SEOPanel";
import Link from "next/link";

interface EditProjectFormProps {
  project: any;
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "seo">("basic");
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    client: project.client,
    slug: project.slug,
    subdomain: project.subdomain || project.slug,
    category: project.category,
    title_en: project.title_en,
    title_vi: project.title_vi,
    image_url: project.image_url,
    bg_color: project.bg_color,
    stat_highlight: project.stat_highlight,
    challenge_en: project.challenge_en || "",
    challenge_vi: project.challenge_vi || "",
    strategy_en: project.strategy_en || "",
    strategy_vi: project.strategy_vi || "",
    stat1_val: project.stat1_val || "",
    stat1_label_en: project.stat1_label_en || "",
    stat1_label_vi: project.stat1_label_vi || "",
    stat2_val: project.stat2_val || "",
    stat2_label_en: project.stat2_label_en || "",
    stat2_label_vi: project.stat2_label_vi || "",
    stat3_val: project.stat3_val || "",
    stat3_label_en: project.stat3_label_en || "",
    stat3_label_vi: project.stat3_label_vi || "",
    booking_url: project.booking_url || "",
    address: project.address || "",
    phone_number: project.phone_number || "",
    opening_hours: project.opening_hours || "",
    google_maps_embed: project.google_maps_embed || "",
    menu_images: project.menu_images || [],
    seo_title: project.seo_title || "",
    seo_description: project.seo_description || "",
    seo_keywords: project.seo_keywords || [],
    og_title: project.og_title || "",
    og_description: project.og_description || "",
    og_image: project.og_image || "",
    canonical_url: project.canonical_url || "",
    no_index: project.no_index || false,
    no_follow: project.no_follow || false,
  });

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
      if (name === "client") {
        const oldSlug = slugify(prev.client);
        if (prev.slug === "" || prev.slug === oldSlug) {
          newData.slug = slugify(value);
        }
      }
      return newData;
    });
  };

  const handleGenerateImage = async () => {
    const prompt = formData.client + " " + formData.title_vi;
    setIsAiGenerating(true);
    toast("AI đang thiết kế hình ảnh cho dự án...", "info");
    
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ action: "generate-image", prompt }),
      });
      const { data, error } = await response.json();
      
      if (error) throw new Error(error);

      setFormData(prev => ({ ...prev, image_url: data }));
      toast("Đã vẽ ảnh dự án thành công!", "success");
    } catch (error: any) {
      toast("Lỗi khi tạo ảnh: " + error.message, "error");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAiTranslate = async () => {
    if (!formData.title_vi) {
      toast("Vui lòng nhập tiêu đề Tiếng Việt!", "error");
      return;
    }
    setIsAiGenerating(true);
    toast("Gemini đang dịch sang Tiếng Anh...", "info");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ action: "translate", text: formData.title_vi }),
      });
      const resTitle = await response.json();
      if (!response.ok) throw new Error(resTitle.error || "Lỗi dịch tiêu đề");
      const titleEn = resTitle.data;

      const challengeResponse = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ action: "translate", text: formData.challenge_vi }),
      });
      const resChallenge = await challengeResponse.json();
      if (!challengeResponse.ok) throw new Error(resChallenge.error || "Lỗi dịch thách thức");
      const challengeEn = resChallenge.data;

      const strategyResponse = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ action: "translate", text: formData.strategy_vi }),
      });
      const resStrategy = await strategyResponse.json();
      if (!strategyResponse.ok) throw new Error(resStrategy.error || "Lỗi dịch chiến lược");
      const strategyEn = resStrategy.data;
      
      setFormData(prev => ({
        ...prev,
        title_en: titleEn || prev.title_en,
        challenge_en: challengeEn || prev.challenge_en,
        strategy_en: strategyEn || prev.strategy_en,
        slug: titleEn ? slugify(titleEn) : prev.slug
      }));
      toast("Đã dịch xong bằng Gemini!", "success");
    } catch (error: any) {
      toast("Lỗi Gemini: " + error.message, "error");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update(formData)
      .eq("id", project.id);

    setIsSaving(false);
    if (!error) {
      toast("Cập nhật dự án thành công!", "success");
      router.push("/adminz/projects");
      router.refresh();
    } else {
      toast("Lỗi khi lưu: " + error.message, "error");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (!error) {
      toast("Đã xoá dự án thành công!", "success");
      router.push("/adminz/projects");
      router.refresh();
      setIsOpen(false);
    } else {
      toast("Lỗi khi xoá: " + error.message, "error");
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/adminz/projects" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-headline text-gray-900">Chỉnh sửa Dự án</h1>
        </div>
        <button 
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold text-sm transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Xoá Dự án
        </button>
      </div>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Xoá Dự án"
        message="Bạn có chắc chắn muốn xoá dự án này không? Hành động này không thể hoàn tác."
        confirmText="Xoá ngay"
        cancelText="Huỷ"
        isDanger
      />

      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        <button 
          type="button"
          onClick={() => setActiveTab("basic")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'basic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Thông tin cơ bản
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab("details")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'details' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Nội dung chi tiết
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'seo' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Tối ưu SEO
        </button>
      </div>


      <form onSubmit={handleSave} className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-8">
        {activeTab === "basic" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tên khách hàng *</label>
                <input required name="client" value={formData.client} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Đường dẫn Project (Slug) *</label>
                <div className="relative">
                  <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50 text-sm" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold uppercase">
                    /projects/[slug]
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tiêu đề (Tiếng Việt) *</label>
                <input required name="title_vi" value={formData.title_vi} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">Tiêu đề (Tiếng Anh) *</label>
                  <button 
                    type="button"
                    onClick={handleAiTranslate}
                    className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    <Sparkles size={12} />
                    Dịch AI sang English
                  </button>
                </div>
                <input required name="title_en" value={formData.title_en} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Link Đặt bàn (Booking URL)</label>
                <input name="booking_url" value={formData.booking_url} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Số điện thoại quán</label>
                <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="028 ..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Địa chỉ quán</label>
                <input name="address" value={formData.address} onChange={handleChange} placeholder="123 Nguyễn Huệ, Quận 1..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Giờ hoạt động</label>
                <input name="opening_hours" value={formData.opening_hours} onChange={handleChange} placeholder="10:00 - 22:00" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Mã nhúng Google Maps (Embed URL)</label>
                <textarea 
                  name="google_maps_embed" 
                  value={formData.google_maps_embed} 
                  onChange={handleChange} 
                  placeholder="https://www.google.com/maps/embed?pb=..." 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50 text-xs font-mono"
                  rows={2}
                />
                <p className="text-[10px] text-gray-400">Gợi ý: Chỉ lấy phần src trong mã nhúng &lt;iframe&gt; của Google Maps.</p>
              </div>
            </div>
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Hình ảnh dự án *</label>
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
                folder="projects"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Số liệu nổi bật (VD: +240%) *</label>
                <input required name="stat_highlight" value={formData.stat_highlight} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Màu nền thẻ (Background)</label>
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
          </>
        ) : activeTab === "details" ? (
          <>
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">1. Thách thức (The Challenge)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Tiếng Anh</label>
                  <textarea name="challenge_en" rows={4} value={formData.challenge_en} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50 resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Tiếng Việt</label>
                  <textarea name="challenge_vi" rows={4} value={formData.challenge_vi} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50 resize-none" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">2. Chiến lược (Our Strategy)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Tiếng Anh</label>
                  <textarea name="strategy_en" rows={4} value={formData.strategy_en} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50 resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Tiếng Việt</label>
                  <textarea name="strategy_vi" rows={4} value={formData.strategy_vi} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-1 bg-gray-50/50 resize-none" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">3. Kết quả (Results)</h3>
              <div className="space-y-6">
                {/* Stat 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">Số liệu 1 (VD: 1.2M+)</label>
                    <input name="stat1_val" value={formData.stat1_val} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">Nhãn (Tiếng Anh)</label>
                    <input name="stat1_label_en" value={formData.stat1_label_en} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">Nhãn (Tiếng Việt)</label>
                    <input name="stat1_label_vi" value={formData.stat1_label_vi} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50" />
                  </div>
                </div>
                {/* Stat 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">Số liệu 2 (VD: 24/7)</label>
                    <input name="stat2_val" value={formData.stat2_val} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">Nhãn (Tiếng Anh)</label>
                    <input name="stat2_label_en" value={formData.stat2_label_en} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">Nhãn (Tiếng Việt)</label>
                    <input name="stat2_label_vi" value={formData.stat2_label_vi} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50" />
                  </div>
                </div>
                {/* Stat 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">Số liệu 3</label>
                    <input name="stat3_val" value={formData.stat3_val} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">Nhãn (Tiếng Anh)</label>
                    <input name="stat3_label_en" value={formData.stat3_label_en} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">Nhãn (Tiếng Việt)</label>
                    <input name="stat3_label_vi" value={formData.stat3_label_vi} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Images Section */}
            <div className="space-y-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">4. Menu Nhà hàng (Hình ảnh)</h3>
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
              <p className="text-xs text-gray-400 italic">Gợi ý: Bạn nên upload ảnh Menu theo đúng thứ tự trang (Trang 1, Trang 2...).</p>
            </div>
          </>
        ) : (
          <SEOPanel 
            data={formData}
            onChange={(seoData) => setFormData(prev => ({ ...prev, ...seoData }))}
            baseUrl="https://viz.io.vn/projects"
            slug={formData.slug}
            defaultTitle={`${formData.client} | ${formData.title_vi}`}
            defaultDescription={formData.challenge_vi}
            defaultImage={formData.image_url}
          />
        )}


        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}
