"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/app/actions/settings";
import { 
  Info, 
  Target, 
  Users, 
  Heart, 
  Save, 
  Loader2, 
  Image as ImageIcon,
  Link as LinkIcon,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AboutCMSPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    hero: {
      title_vi: "", title_en: "",
      highlight_vi: "", highlight_en: "",
      desc_vi: "", desc_en: ""
    },
    mission: {
      title_vi: "", title_en: "",
      desc_vi: "", desc_en: ""
    },
    founder: {
      name_vi: "", name_en: "",
      role_vi: "", role_en: "",
      bio_vi: "", bio_en: "",
      tag_vi: "", tag_en: "",
      image_url: "",
      connect_url: ""
    },
    values: [
      { title_vi: "", title_en: "", desc_vi: "", desc_en: "" },
      { title_vi: "", title_en: "", desc_vi: "", desc_en: "" },
      { title_vi: "", title_en: "", desc_vi: "", desc_en: "" }
    ]
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const data = await getSettings("about_page");
    if (data) {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateSettings("about_page", settings);
    if (result.success) {
      alert("Đã cập nhật trang About thành công!");
    } else {
      alert("Lỗi cập nhật: " + result.error);
    }
    setSaving(false);
  };

  const updateField = (section: string, field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateValue = (index: number, field: string, value: string) => {
    const newValues = [...settings.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setSettings((prev: any) => ({ ...prev, values: newValues }));
  };

  const tabs = [
    { id: "hero", name: "Đầu trang (Hero)", icon: Info },
    { id: "mission", name: "Sứ mệnh", icon: Target },
    { id: "founder", name: "Người sáng lập", icon: Users },
    { id: "values", name: "Giá trị cốt lõi", icon: Heart },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chỉnh sửa trang About</h1>
          <p className="text-gray-500">Quản lý nội dung giới thiệu, sứ mệnh và đội ngũ.</p>
        </div>
        <button 
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg shadow-gray-900/10"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
          Lưu tất cả thay đổi
        </button>
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
                type="button"
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
              className="space-y-8"
            >
              {activeTab === "hero" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2"><Globe size={16}/> Tiếng Việt</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Tiêu đề chính</label>
                          <input 
                            type="text"
                            value={settings.hero.title_vi}
                            onChange={(e) => updateField("hero", "title_vi", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                            placeholder="Ví dụ: Chúng tôi kiến tạo"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Chữ nổi bật (Gradient)</label>
                          <input 
                            type="text"
                            value={settings.hero.highlight_vi}
                            onChange={(e) => updateField("hero", "highlight_vi", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                            placeholder="Ví dụ: Trải nghiệm số"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Mô tả ngắn</label>
                          <textarea 
                            rows={3}
                            value={settings.hero.desc_vi}
                            onChange={(e) => updateField("hero", "desc_vi", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none resize-none"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2"><Globe size={16}/> English</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Hero Title</label>
                          <input 
                            type="text"
                            value={settings.hero.title_en}
                            onChange={(e) => updateField("hero", "title_en", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                            placeholder="e.g. We architect"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Highlight Text</label>
                          <input 
                            type="text"
                            value={settings.hero.highlight_en}
                            onChange={(e) => updateField("hero", "highlight_en", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                            placeholder="e.g. Digital Experiences"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                          <textarea 
                            rows={3}
                            value={settings.hero.desc_en}
                            onChange={(e) => updateField("hero", "desc_en", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none resize-none"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "mission" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2"><Globe size={16}/> Tiếng Việt</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Tiêu đề sứ mệnh</label>
                        <input 
                          type="text"
                          value={settings.mission.title_vi}
                          onChange={(e) => updateField("mission", "title_vi", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Nội dung (Trích dẫn)</label>
                        <textarea 
                          rows={4}
                          value={settings.mission.desc_vi}
                          onChange={(e) => updateField("mission", "desc_vi", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2"><Globe size={16}/> English</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Mission Title</label>
                        <input 
                          type="text"
                          value={settings.mission.title_en}
                          onChange={(e) => updateField("mission", "title_en", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Mission Content (Quote)</label>
                        <textarea 
                          rows={4}
                          value={settings.mission.desc_en}
                          onChange={(e) => updateField("mission", "desc_en", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "founder" && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-1">
                      <ImageUpload 
                        label="Ảnh chân dung"
                        value={settings.founder.image_url}
                        onChange={(url) => updateField("founder", "image_url", url)}
                        folder="founder"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Họ và tên</label>
                          <input 
                            type="text"
                            value={settings.founder.name_vi}
                            onChange={(e) => updateField("founder", "name_vi", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Vai trò (VI)</label>
                          <input 
                            type="text"
                            value={settings.founder.role_vi}
                            onChange={(e) => updateField("founder", "role_vi", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Facebook / Connect URL</label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input 
                            type="text"
                            value={settings.founder.connect_url}
                            onChange={(e) => updateField("founder", "connect_url", e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                            placeholder="https://facebook.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2"><Globe size={16}/> Tiếng Việt</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Tagline (VD: Người sáng lập)</label>
                          <input 
                            type="text"
                            value={settings.founder.tag_vi}
                            onChange={(e) => updateField("founder", "tag_vi", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Tiểu sử (Bio)</label>
                          <textarea 
                            rows={6}
                            value={settings.founder.bio_vi}
                            onChange={(e) => updateField("founder", "bio_vi", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none resize-none text-sm leading-relaxed"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2"><Globe size={16}/> English</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Role (EN)</label>
                          <input 
                            type="text"
                            value={settings.founder.role_en}
                            onChange={(e) => updateField("founder", "role_en", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Bio (EN)</label>
                          <textarea 
                            rows={6}
                            value={settings.founder.bio_en}
                            onChange={(e) => updateField("founder", "bio_en", e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none resize-none text-sm leading-relaxed"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "values" && (
                <div className="space-y-12">
                  {settings.values.map((val: any, idx: number) => (
                    <div key={idx} className="p-6 rounded-[32px] bg-gray-50 border border-gray-100 space-y-6">
                      <h4 className="font-bold text-gray-900 px-2">Giá trị #{idx + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Tiêu đề (VI)</label>
                            <input 
                              type="text"
                              value={val.title_vi}
                              onChange={(e) => updateValue(idx, "title_vi", e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Mô tả (VI)</label>
                            <textarea 
                              rows={3}
                              value={val.desc_vi}
                              onChange={(e) => updateValue(idx, "desc_vi", e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none resize-none text-sm"
                            ></textarea>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Title (EN)</label>
                            <input 
                              type="text"
                              value={val.title_en}
                              onChange={(e) => updateValue(idx, "title_en", e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Description (EN)</label>
                            <textarea 
                              rows={3}
                              value={val.desc_en}
                              onChange={(e) => updateValue(idx, "desc_en", e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-pink-500/20 outline-none resize-none text-sm"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
