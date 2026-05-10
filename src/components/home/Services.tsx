"use client";

import { motion } from "framer-motion";
import { PenTool, Megaphone, Target, Code2, LineChart } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      icon: <Megaphone className="w-6 h-6" />,
      title: t("services.s1Title"),
      description: t("services.s1Desc"),
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: t("services.s2Title"),
      description: t("services.s2Desc"),
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: t("services.s3Title"),
      description: t("services.s3Desc"),
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      title: t("services.s4Title"),
      description: t("services.s4Desc"),
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: t("services.s5Title"),
      description: t("services.s5Desc"),
    }
  ];

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <p className="text-pink-500 font-semibold text-sm uppercase tracking-wider mb-4">
            {t("services.tag")}
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-headline tracking-tight text-gray-900"
          >
            {t("services.title")}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl hover:border-pink-100 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mb-6 group-hover:bg-gradient-vibrant group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-headline text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 5 * 0.1 }}
            className="bg-gradient-vibrant p-8 rounded-[32px] shadow-xl text-white flex flex-col justify-center items-center text-center group cursor-pointer"
          >
            <h3 className="text-2xl font-headline mb-3">{t("services.ctaTitle")}</h3>
            <p className="text-white/80 text-sm mb-6">{t("services.ctaDesc")}</p>
            <button className="px-6 py-2 bg-white text-gray-900 rounded-full font-semibold text-sm hover:scale-105 transition-transform">
              {t("services.ctaBtn")}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
