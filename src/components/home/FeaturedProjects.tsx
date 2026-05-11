"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Utensils } from "lucide-react";

const cases = [
  {
    id: "miyako",
    client: "Miyako Sushi",
    category: "Performance Marketing & App",
    title: "Tăng 240% doanh thu booking với O2O Strategy",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop",
    color: "bg-blue-50"
  },
  {
    id: "baozi",
    client: "Baozi Fusion",
    category: "Brand Strategy & TikTok",
    title: "Viral Campaign tiếp cận 5M Gen Z trong 1 tháng",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2129&auto=format&fit=crop",
    color: "bg-orange-50"
  }
];

export default function FeaturedProjects() {
  const { t, lang } = useLanguage();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="text-pink-500 font-semibold text-sm uppercase tracking-wider mb-4">
              {t("featured.tag")}
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-headline tracking-tight text-gray-900"
            >
              {t("featured.title")}
            </motion.h2>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-2 text-gray-900 font-semibold hover:text-pink-500 transition-colors"
          >
            {t("featured.viewAll")}
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {cases.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <Link href={`/projects/${project.id === 'miyako' ? 'miyako-sushi' : project.id}`} className="block">
                <div className={`relative aspect-[4/3] rounded-[32px] overflow-hidden mb-6 ${project.color}`}>
                  <img 
                    src={project.image} 
                    alt={project.client} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                      {project.client}
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg transform translate-y-2 group-hover:translate-y-0">
                      <ArrowUpRight className="text-gray-900" />
                    </div>
                  </div>
                </div>
              </Link>
              <div className="flex items-start justify-between">
                <Link href={`/projects/${project.id === 'miyako' ? 'miyako-sushi' : project.id}`} className="flex-1">
                  <p className="text-sm text-gray-500 font-medium mb-2">{project.category}</p>
                  <h3 className="text-2xl font-headline text-gray-900 group-hover:text-pink-500 transition-colors">
                    {project.title}
                  </h3>
                </Link>
                <Link
                  href={`/booking/${project.id === 'miyako' ? 'miyako-sushi' : project.id}`}
                  className="mt-1 flex items-center gap-2 bg-gray-50 text-gray-900 px-4 py-2 rounded-full text-xs font-bold hover:bg-pink-500 hover:text-white transition-all transform active:scale-95 border border-gray-100"
                >
                  <Utensils size={14} />
                  {lang === 'en' ? 'Book' : 'Đặt bàn'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
