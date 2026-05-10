"use client";

import { useState } from "react";
import { Upload as UploadIcon, Loader2 as LoaderIcon, X as XIcon, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/app/actions/upload";
import Modal from "@/components/ui/Modal";
import MediaExplorer from "./MediaExplorer";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export default function ImageUpload({ value, onChange, label, folder = "august_agency" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File quá lớn! Vui lòng chọn ảnh dưới 10MB.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadImage(formData, folder) as string;
      onChange(url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectFromLibrary = (url: string) => {
    onChange(url);
    setIsPickerOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
        <button 
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1 transition-colors"
        >
          <ImageIcon size={14} />
          Chọn từ thư viện
        </button>
      </div>
      
      {value ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-100 group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <LoaderIcon className="w-8 h-8 animate-spin text-pink-500" />
              <span className="text-sm text-gray-500 font-medium">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <UploadIcon className="w-6 h-6 text-pink-500" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Click to upload image</span>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      )}

      {/* Media Picker Modal */}
      <Modal 
        isOpen={isPickerOpen} 
        onClose={() => setIsPickerOpen(false)} 
        title="Thư viện Media"
        maxWidth="max-w-6xl"
      >
        <div className="h-[600px] overflow-hidden -mx-6 -mb-6 md:-mx-8 md:-mb-8 border-t border-gray-100">
           <MediaExplorer onSelect={handleSelectFromLibrary} />
        </div>
      </Modal>
    </div>
  );
}
