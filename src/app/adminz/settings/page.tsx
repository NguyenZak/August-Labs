"use client";

import { useEffect, useState } from "react";
import { getAllSettings, updateSettings } from "@/app/actions/settings";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Share2, 
  ShieldCheck, 
  Save, 
  Mail, 
  Phone, 
  MapPin, 
  Link2,
  Loader2,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "@/components/admin/ImageUpload";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    general: { 
      agency_name: "", 
      email: "", 
      phone: "", 
      address: "",
      logo_url: "",
      footer_logo_url: "",
      favicon_url: ""
    },
    social: { facebook: "", instagram: "", linkedin: "", youtube: "" },
    seo: { meta_title: "", meta_description: "" }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const data = await getAllSettings();
    if (data && data.length > 0) {
      const formatted = data.reduce((acc: Record<string, any>, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      setSettings((prev: any) => ({ ...prev, ...formatted }));
    }
    setLoading(false);
  };

  const handleSave = async (key: string) => {
    setSaving(true);
    const result = await updateSettings(key, settings[key]);
    if (result.success) {
      alert("Đã cập nhật cài đặt thành công!");
    } else {
      alert("Lỗi cập nhật: " + result.error);
    }
    setSaving(false);
  };

  const updateField = (tab: string, field: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: "general", name: "Thông tin Chung", icon: SettingsIcon },
    { id: "social", name: "Mạng xã hội", icon: Share2 },
    { id: "seo", name: "SEO & Google", icon: Globe },
    { id: "security", name: "Bảo mật", icon: ShieldCheck },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt hệ thống</h1>
        <p className="text-gray-500">Quản lý cấu hình toàn cầu cho website August Agency.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="md:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-white text-pink-500 shadow-sm border border-gray-100" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "general" && (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Thông tin cơ bản</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Tên Agency</label>
                        <input 
                          type="text"
                          value={settings.general.agency_name}
                          onChange={(e) => updateField("general", "agency_name", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email liên hệ</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input 
                            type="email"
                            value={settings.general.email}
                            onChange={(e) => updateField("general", "email", e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input 
                            type="text"
                            value={settings.general.phone}
                            onChange={(e) => updateField("general", "phone", e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-gray-50">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Thương hiệu (Branding)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-4">
                        <label className="text-sm font-semibold text-gray-700">Logo chính</label>
                        <ImageUpload 
                          value={settings.general.logo_url}
                          onChange={(url) => updateField("general", "logo_url", url)}
                          folder="branding"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-sm font-semibold text-gray-700">Logo Footer (Chân trang)</label>
                        <ImageUpload 
                          value={settings.general.footer_logo_url}
                          onChange={(url) => updateField("general", "footer_logo_url", url)}
                          folder="branding"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-sm font-semibold text-gray-700">Favicon (Tab trình duyệt)</label>
                        <ImageUpload 
                          value={settings.general.favicon_url}
                          onChange={(url) => updateField("general", "favicon_url", url)}
                          folder="branding"
                        />
                        <p className="text-[10px] text-gray-400 italic">Gợi ý: Dùng ảnh vuông .png hoặc .ico (32x32px).</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Địa chỉ văn phòng</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                      <textarea 
                        rows={3}
                        value={settings.general.address}
                        onChange={(e) => updateField("general", "address", e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-50 flex justify-end">
                    <button 
                      type="button"
                      onClick={() => handleSave("general")}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "social" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Liên kết mạng xã hội</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Link2 size={20} />
                      </div>
                      <input 
                        type="text"
                        placeholder="Facebook URL"
                        value={settings.social.facebook}
                        onChange={(e) => updateField("social", "facebook", e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                        <Link2 size={20} />
                      </div>
                      <input 
                        type="text"
                        placeholder="Instagram URL"
                        value={settings.social.instagram}
                        onChange={(e) => updateField("social", "instagram", e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Link2 size={20} />
                      </div>
                      <input 
                        type="text"
                        placeholder="LinkedIn URL"
                        value={settings.social.linkedin}
                        onChange={(e) => updateField("social", "linkedin", e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        <Link2 size={20} />
                      </div>
                      <input 
                        type="text"
                        placeholder="YouTube URL"
                        value={settings.social.youtube}
                        onChange={(e) => updateField("social", "youtube", e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-50 flex justify-end">
                    <button 
                      onClick={() => handleSave("social")}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                      Lưu mạng xã hội
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Tối ưu hóa tìm kiếm (SEO)</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Tiêu đề Trang chủ (Meta Title)</label>
                      <input 
                        type="text"
                        value={settings.seo.meta_title}
                        onChange={(e) => updateField("seo", "meta_title", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Mô tả Trang chủ (Meta Description)</label>
                      <textarea 
                        rows={4}
                        value={settings.seo.meta_description}
                        onChange={(e) => updateField("seo", "meta_description", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-50 flex justify-end">
                    <button 
                      onClick={() => handleSave("seo")}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                      Lưu cấu hình SEO
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Bảo mật tài khoản</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
                    <div className="shrink-0 text-blue-500">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-900 mb-1">Xác thực an toàn</p>
                      <p className="text-sm text-blue-700">
                        Tài khoản của bạn được bảo vệ bởi Supabase Auth. Để thay đổi mật khẩu hoặc quản lý quyền truy cập, vui lòng truy cập Supabase Dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
