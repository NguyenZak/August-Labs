"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Utensils } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

export default function Hero() {
  const { t, lang } = useLanguage();
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    const fetchHero = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("hero_content").select("*").eq("id", 1).single();
      if (data) setHeroData(data);
    };
    fetchHero();
  }, []);

  const getLocalized = (keyEn: string, keyVi: string, fallback: string) => {
    if (!heroData) return fallback;
    return lang === 'en' ? heroData[keyEn] : heroData[keyVi];
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left mt-10 lg:mt-0 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-600 font-semibold text-sm mb-6 border border-pink-100"
            >
              <Utensils size={14} />
              <span>{getLocalized("tag_en", "tag_vi", t("hero.tag"))}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-headline tracking-tight text-gray-900 leading-[1.1] mb-6"
            >
              {getLocalized("title1_en", "title1_vi", t("hero.title1"))} <span className="text-gradient-vibrant">{getLocalized("title2_en", "title2_vi", t("hero.title2"))}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {getLocalized("desc_en", "desc_vi", t("hero.desc"))}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/contact"
                className="px-8 py-4 rounded-full bg-gradient-vibrant text-white font-semibold shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all hover:-translate-y-0.5"
              >
                {t("hero.btnPrimary")}
              </Link>
              <Link
                href="/projects"
                className="group flex items-center gap-2 px-8 py-4 rounded-full text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              >
                {t("hero.btnSecondary")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-pink-500" />
              </Link>
            </motion.div>
          </div>

          {/* Right Visuals (Data + F&B Context) */}
          <div className="flex-1 relative w-full h-[550px] hidden lg:block">
            {/* Main Image Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute top-10 right-10 w-72 h-[400px] bg-gray-100 rounded-[32px] shadow-2xl overflow-hidden border-8 border-white"
            >
              <img 
                src={heroData?.image_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop"} 
                alt="F&B Marketing" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white font-bold text-xl mb-1">{heroData?.bookings_text || "Miyako Sushi"}</h3>
                <p className="text-white/80 text-sm">+240% {t("hero.bookings")}</p>
              </div>
            </motion.div>

            {/* Floating Data Card */}
            <motion.div 
              initial={{ opacity: 0, y: 50, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute bottom-12 left-10 w-64 bg-white rounded-2xl shadow-xl p-5 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t("hero.growth")}</p>
                  <p className="text-xl font-bold text-gray-900">{heroData?.growth_percent || "+128.5%"}</p>
                </div>
              </div>
              <div className="h-12 w-full bg-gray-50 rounded-lg overflow-hidden flex items-end gap-1 p-1">
                {[40, 30, 60, 50, 80, 70, 100].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                    className="flex-1 bg-gradient-vibrant rounded-sm"
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating Tech Element */}
            <motion.div 
              initial={{ opacity: 0, y: -30, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="absolute top-20 -left-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              <p className="text-sm font-semibold text-gray-900">{t("hero.mapActive")}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
