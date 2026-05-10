"use client";

import { motion } from "framer-motion";
import { Database, Map, TrendingUp, Crosshair, Search, Filter, Activity, Zap } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

export default function Intelligence() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 border border-blue-100"
          >
            <Database size={14} />
            <span>{t("pageIntel.heroTag")}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-headline tracking-tight text-gray-900 mb-6"
          >
            {t("pageIntel.heroTitle")} <br className="hidden md:block"/>
            <span className="text-gradient-vibrant">{t("pageIntel.heroHighlight")}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
          >
            {t("pageIntel.heroDesc")}
          </motion.p>
        </div>
      </section>

      {/* Dashboard Mockup Section */}
      <section className="relative -mt-10 px-6 md:px-12 z-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-gray-900 rounded-[32px] md:rounded-[48px] shadow-2xl shadow-gray-900/20 overflow-hidden border border-gray-800 flex flex-col h-[600px] md:h-[700px]"
          >
            {/* Dashboard Header */}
            <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 md:px-8 bg-gray-950/50">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-vibrant flex items-center justify-center text-white">
                  <Activity size={16} />
                </div>
                <div>
                  <h3 className="text-white font-headline text-lg leading-tight">{t("pageIntel.dashboardTitle")}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider">{t("pageIntel.dashboardSubtitle")}</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400"><Search size={16} /></div>
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400"><Filter size={16} /></div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden bg-gray-900">
              {/* Map Background Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" />
              
              {/* Interactive Heat Spots */}
              <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-[30%] left-[40%] w-64 h-64 bg-pink-500 rounded-full blur-[80px]"
              />
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[20%] right-[30%] w-80 h-80 bg-orange-500 rounded-full blur-[100px]"
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
                className="absolute top-[20%] right-[20%] w-48 h-48 bg-purple-500 rounded-full blur-[60px]"
              />

              {/* Data Widgets */}
              <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-6 w-full h-full justify-between items-start md:items-end pointer-events-none">
                
                {/* Left Panel */}
                <div className="bg-gray-950/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 w-full md:w-64 space-y-6">
                  <div>
                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">{t("pageIntel.metric1")}</p>
                    <p className="text-3xl font-headline text-white">12,458</p>
                    <p className="text-green-400 text-xs mt-1 flex items-center gap-1"><TrendingUp size={12}/> +14% vs last week</p>
                  </div>
                  <div className="h-px w-full bg-gray-800" />
                  <div>
                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">{t("pageIntel.metric2")}</p>
                    <p className="text-xl font-headline text-orange-400">Korean BBQ</p>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="bg-gray-950/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 w-full md:w-72">
                  <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">{t("pageIntel.metric3")}</p>
                  <div className="space-y-3">
                    {["18:00", "19:00", "20:00"].map((time, i) => (
                      <div key={time} className="flex items-center gap-3">
                        <span className="text-white text-sm font-medium w-10">{time}</span>
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: i === 1 ? '90%' : i === 0 ? '60%' : '75%' }}
                            transition={{ duration: 1, delay: 1 + i * 0.2 }}
                            className={`h-full ${i === 1 ? 'bg-gradient-vibrant' : 'bg-pink-500/50'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-pink-100 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Map size={24} />
              </div>
              <h3 className="text-xl font-headline text-gray-900 mb-3">{t("pageIntel.feature1Title")}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t("pageIntel.feature1Desc")}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-100 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-headline text-gray-900 mb-3">{t("pageIntel.feature2Title")}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t("pageIntel.feature2Desc")}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Crosshair size={24} />
              </div>
              <h3 className="text-xl font-headline text-gray-900 mb-3">{t("pageIntel.feature3Title")}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t("pageIntel.feature3Desc")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="bg-gradient-vibrant rounded-[40px] p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -top-[50%] -right-[10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"
            />
            <div className="relative z-10 max-w-2xl mx-auto">
              <Zap className="w-12 h-12 text-white mx-auto mb-6 opacity-90" />
              <h2 className="text-4xl md:text-5xl font-headline mb-4">{t("pageIntel.ctaTitle")}</h2>
              <p className="text-white/80 text-lg mb-8">{t("pageIntel.ctaDesc")}</p>
              <Link 
                href="/contact"
                className="inline-block px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:scale-105 transition-transform"
              >
                {t("pageIntel.ctaBtn")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
