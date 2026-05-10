"use client";

import { motion } from "framer-motion";
import { BarChart3, ChefHat, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

export default function About() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gray-50/50">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-headline tracking-tight text-gray-900 mb-6"
          >
            {t("pageAbout.heroTitle")} <span className="text-gradient-vibrant">{t("pageAbout.heroHighlight")}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
          >
            {t("pageAbout.heroDesc")}
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-5xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-pink-500 font-semibold text-sm uppercase tracking-wider mb-6"
          >
            {t("pageAbout.missionTitle")}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-headline text-gray-900 leading-tight"
          >
            "{t("pageAbout.missionDesc")}"
          </motion.h2>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-vibrant opacity-10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            
            {/* Founder Image */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full max-w-md"
            >
              <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-gray-800">
                <img 
                  src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1974&auto=format&fit=crop" 
                  alt={t("pageAbout.founderName")} 
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-headline text-2xl">{t("pageAbout.founderName")}</p>
                      <p className="text-gray-300 text-sm">{t("pageAbout.founderRole")}</p>
                    </div>
                    <Link 
                      href="https://www.facebook.com/nguyenzakk" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors"
                      title={t("pageAbout.founderConnect")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Founder Bio */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <p className="text-pink-500 font-semibold text-sm uppercase tracking-wider mb-4">
                {t("pageAbout.founderTag")}
              </p>
              <h2 className="text-4xl md:text-6xl font-headline mb-8">
                Data meets <br />
                <span className="text-gradient-vibrant">Hospitality.</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {t("pageAbout.founderBio")}
              </p>
              <div className="flex gap-4 items-center">
                <div className="bg-gray-800 rounded-2xl p-4 text-center min-w-[120px]">
                  <p className="text-3xl font-headline text-white mb-1">10+</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Years Exp.</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-4 text-center min-w-[120px]">
                  <p className="text-3xl font-headline text-white mb-1">50+</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Brands Scaled</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-headline text-gray-900">{t("pageAbout.valuesTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-[32px] p-8 hover:bg-white hover:shadow-xl hover:border-pink-100 border border-transparent transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-2xl font-headline text-gray-900 mb-3">{t("pageAbout.val1Title")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("pageAbout.val1Desc")}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-50 rounded-[32px] p-8 hover:bg-white hover:shadow-xl hover:border-pink-100 border border-transparent transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                <ChefHat size={24} />
              </div>
              <h3 className="text-2xl font-headline text-gray-900 mb-3">{t("pageAbout.val2Title")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("pageAbout.val2Desc")}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-50 rounded-[32px] p-8 hover:bg-white hover:shadow-xl hover:border-pink-100 border border-transparent transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-2xl font-headline text-gray-900 mb-3">{t("pageAbout.val3Title")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("pageAbout.val3Desc")}
              </p>
            </motion.div>

          </div>
        </div>
      </section>
    </main>
  );
}
