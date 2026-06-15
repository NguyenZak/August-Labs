"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function LanguageSelectorPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    // Check if the user has already selected a language
    const savedLang = localStorage.getItem("august_lang");
    if (!savedLang && !pathname.startsWith('/adminz')) {
      // Small delay to make it feel natural
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleSelect = (selectedLang: "en" | "vi") => {
    setLang(selectedLang);
    setIsOpen(false);
  };

  const handleClose = () => {
    // If they close without selecting, we set the current default so it doesn't bother them again
    localStorage.setItem("august_lang", lang);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[32px] p-8 md:p-10 max-w-md w-full shadow-2xl overflow-hidden"
          >
            {/* Background design */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-pink-500 to-orange-400 opacity-10" />
            
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors z-10"
            >
              <X size={16} />
            </button>

            <div className="relative z-10 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 transform -rotate-6">
                <Globe size={32} className="transform rotate-6" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-headline text-gray-900">Choose your language</h2>
                <p className="text-gray-500">Vui lòng chọn ngôn ngữ để tiếp tục</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6">
                <button
                  onClick={() => handleSelect('vi')}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] border-2 transition-all hover:border-pink-500 hover:bg-pink-50 group border-gray-100 bg-white"
                >
                  <span className="text-4xl transform group-hover:scale-110 transition-transform">🇻🇳</span>
                  <span className="font-bold text-gray-900 group-hover:text-pink-600">Tiếng Việt</span>
                </button>
                <button
                  onClick={() => handleSelect('en')}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] border-2 transition-all hover:border-pink-500 hover:bg-pink-50 group border-gray-100 bg-white"
                >
                  <span className="text-4xl transform group-hover:scale-110 transition-transform">🇬🇧</span>
                  <span className="font-bold text-gray-900 group-hover:text-pink-600">English</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
