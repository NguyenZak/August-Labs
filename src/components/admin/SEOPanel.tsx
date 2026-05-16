"use client";

import { Search, Globe, Image as ImageIcon, Eye, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface SEOData {
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  no_index?: boolean;
  no_follow?: boolean;
}

interface SEOPanelProps {
  data: SEOData;
  onChange: (data: SEOData) => void;
  baseUrl: string;
  slug: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
}

export default function SEOPanel({
  data,
  onChange,
  baseUrl,
  slug,
  defaultTitle,
  defaultDescription,
  defaultImage
}: SEOPanelProps) {
  const [activeTab, setActiveTab] = useState<"google" | "social">("google");

  const metaTitle = data.seo_title || defaultTitle;
  const metaDescription = data.seo_description || defaultDescription;
  const metaImage = data.og_image || defaultImage;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      onChange({ ...data, [name]: (e.target as any).checked });
    } else if (name === 'seo_keywords') {
      onChange({ ...data, seo_keywords: value.split(',').map((k: string) => k.trim()) });
    } else {
      onChange({ ...data, [name]: value });
    }
  };

  const titleLength = metaTitle?.length || 0;
  const descLength = metaDescription?.length || 0;

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Globe className="text-blue-500" size={20} />
          Tối ưu SEO Production
        </h3>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("google")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'google' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            Google Preview
          </button>
          <button 
            onClick={() => setActiveTab("social")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'social' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            Social Preview
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Preview Area */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          {activeTab === 'google' ? (
            <div className="max-w-[600px] space-y-1">
              <p className="text-sm text-gray-600 truncate">{baseUrl}/{slug}</p>
              <h4 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight line-clamp-1">
                {metaTitle}
              </h4>
              <p className="text-sm text-[#4d5156] line-clamp-2 leading-relaxed">
                {metaDescription}
              </p>
            </div>
          ) : (
            <div className="max-w-[500px] border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div className="aspect-[1.91/1] bg-gray-100 relative overflow-hidden">
                {metaImage ? (
                  <img src={metaImage} alt="Social Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon size={48} />
                  </div>
                )}
              </div>
              <div className="p-4 bg-[#f2f3f5] space-y-1">
                <p className="text-xs text-[#606770] uppercase truncate">{new URL(baseUrl).hostname}</p>
                <h4 className="text-base font-bold text-[#1d2129] line-clamp-1">{data.og_title || metaTitle}</h4>
                <p className="text-sm text-[#606770] line-clamp-1">{data.og_description || metaDescription}</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-gray-700">Meta Title</label>
                <span className={`text-[10px] font-bold ${titleLength > 60 ? 'text-red-500' : 'text-green-500'}`}>
                  {titleLength}/60
                </span>
              </div>
              <input 
                name="seo_title"
                value={data.seo_title || ""}
                onChange={handleChange}
                placeholder={defaultTitle}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 bg-white text-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-gray-700">Meta Description</label>
                <span className={`text-[10px] font-bold ${descLength > 160 ? 'text-red-500' : 'text-green-500'}`}>
                  {descLength}/160
                </span>
              </div>
              <textarea 
                name="seo_description"
                value={data.seo_description || ""}
                onChange={handleChange}
                rows={3}
                placeholder={defaultDescription}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 bg-white text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Keywords (cách nhau bởi dấu phẩy)</label>
              <input 
                name="seo_keywords"
                value={data.seo_keywords?.join(', ') || ""}
                onChange={handleChange}
                placeholder="marketing, creative, branding"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 bg-white text-sm"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">OG Title (Social Only)</label>
              <input 
                name="og_title"
                value={data.og_title || ""}
                onChange={handleChange}
                placeholder="Tiêu đề hiển thị trên Facebook/Zalo..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 bg-white text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">OG Image URL</label>
              <input 
                name="og_image"
                value={data.og_image || ""}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 bg-white text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Canonical URL</label>
              <input 
                name="canonical_url"
                value={data.canonical_url || ""}
                onChange={handleChange}
                placeholder={`${baseUrl}/${slug}`}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 bg-white text-sm"
              />
            </div>

            <div className="flex gap-8 pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox"
                  name="no_index"
                  checked={data.no_index || false}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">No Index</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox"
                  name="no_follow"
                  checked={data.no_follow || false}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">No Follow</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
