"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function WhyUs() {
  const { t } = useLanguage();

  const features = [
    t("whyus.f1"),
    t("whyus.f2"),
    t("whyus.f3"),
    t("whyus.f4"),
    t("whyus.f5"),
    t("whyus.f6")
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="flex-1">
            <p className="text-pink-500 font-semibold text-sm uppercase tracking-wider mb-4">
              {t("whyus.tag")}
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-headline tracking-tight text-gray-900 mb-6"
            >
              {t("whyus.title1")} <br />
              <span className="text-gradient-vibrant">{t("whyus.title2")}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-600 mb-10 text-lg"
            >
              {t("whyus.desc")}
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            <Link
              href="/intelligence"
              className="inline-block px-8 py-3 rounded-full border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-colors"
            >
              {t("whyus.btn")}
            </Link>
          </div>

          {/* Right Visual (Interactive Hot Map Mockup) */}
          <div className="flex-1 relative w-full h-[500px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-gray-900 rounded-[40px] shadow-2xl p-6 overflow-hidden flex flex-col"
            >
              {/* Map UI Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-white font-headline text-xl">{t("whyus.mapTitle")}</h3>
                  <p className="text-gray-400 text-xs">{t("whyus.mapSubtitle")}</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>

              {/* Map Area Mockup */}
              <div className="flex-1 bg-gray-800 rounded-2xl relative overflow-hidden">
                {/* Fake Grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Heat spots */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-50" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                  className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-orange-500 rounded-full blur-3xl opacity-40" 
                />
                
                {/* Tooltip */}
                <div className="absolute top-1/3 left-1/3 bg-white px-3 py-2 rounded-lg shadow-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-900">{t("whyus.mapTooltip")}</p>
                  <p className="text-[10px] text-gray-500">{t("whyus.mapTime")}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
