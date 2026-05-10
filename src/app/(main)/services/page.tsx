"use client";

import { motion } from "framer-motion";
import { PenTool, Megaphone, Target, Code2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Services() {
  const { t } = useLanguage();

  const servicesList = [
    {
      id: "branding",
      icon: <PenTool className="w-8 h-8" />,
      color: "bg-pink-50 text-pink-500",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
      titleKey: "pageServices.brandingTitle",
      descKey: "pageServices.brandingDesc",
      list: [
        t("pageServices.brandingList.0"),
        t("pageServices.brandingList.1"),
        t("pageServices.brandingList.2"),
        t("pageServices.brandingList.3")
      ]
    },
    {
      id: "marketing",
      icon: <Megaphone className="w-8 h-8" />,
      color: "bg-orange-50 text-orange-500",
      image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop",
      titleKey: "pageServices.marketingTitle",
      descKey: "pageServices.marketingDesc",
      list: [
        t("pageServices.marketingList.0"),
        t("pageServices.marketingList.1"),
        t("pageServices.marketingList.2"),
        t("pageServices.marketingList.3")
      ],
      reverse: true
    },
    {
      id: "performance",
      icon: <Target className="w-8 h-8" />,
      color: "bg-blue-50 text-blue-500",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      titleKey: "pageServices.performanceTitle",
      descKey: "pageServices.performanceDesc",
      list: [
        t("pageServices.performanceList.0"),
        t("pageServices.performanceList.1"),
        t("pageServices.performanceList.2"),
        t("pageServices.performanceList.3")
      ]
    },
    {
      id: "tech",
      icon: <Code2 className="w-8 h-8" />,
      color: "bg-green-50 text-green-500",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", // placeholder
      titleKey: "pageServices.techTitle",
      descKey: "pageServices.techDesc",
      list: [
        t("pageServices.techList.0"),
        t("pageServices.techList.1"),
        t("pageServices.techList.2"),
        t("pageServices.techList.3")
      ],
      reverse: true
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gray-50/50">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-headline tracking-tight text-gray-900 mb-6"
          >
            {t("pageServices.heroTitle")} <br />
            <span className="text-gradient-vibrant">{t("pageServices.heroHighlight")}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed"
          >
            {t("pageServices.heroDesc")}
          </motion.p>
        </div>
      </section>

      {/* Services Detailed List */}
      <section className="py-24">
        <div className="container mx-auto px-6 md:px-12 flex flex-col gap-32">
          {servicesList.map((service, index) => (
            <div 
              key={service.id} 
              className={`flex flex-col ${service.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center`}
            >
              {/* Content */}
              <motion.div 
                initial={{ opacity: 0, x: service.reverse ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex-1"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${service.color}`}>
                  {service.icon}
                </div>
                <h2 className="text-4xl font-headline text-gray-900 mb-4">
                  {t(service.titleKey)}
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  {t(service.descKey)}
                </p>
                <ul className="space-y-4">
                  {service.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-pink-500 shrink-0 mt-0.5" />
                      <span className="text-gray-800 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Visual */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex-1 w-full"
              >
                <div className={`aspect-[4/3] rounded-[40px] overflow-hidden ${service.color} p-2`}>
                  <img 
                    src={service.image} 
                    alt="Service visual" 
                    className="w-full h-full object-cover rounded-[32px] shadow-lg"
                  />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gray-900 text-white rounded-t-[40px] mt-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline mb-4">{t("pageServices.processTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step) => (
              <motion.div 
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step * 0.1 }}
                className="relative"
              >
                <div className="text-7xl font-headline text-white/10 mb-4 absolute -top-8 -left-4">0{step}</div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3">{t(`pageServices.step${step}Title`)}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t(`pageServices.step${step}Desc`)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
