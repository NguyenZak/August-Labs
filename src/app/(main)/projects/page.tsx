"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const categories = ["All", "Restaurant Chains", "Fine Dining", "Cafe & Bakery", "App & Tech"];

export default function ProjectsPage() {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (data) {
        setProjects(data);
      }
      setIsLoading(false);
    };
    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-headline tracking-tight text-gray-900 mb-6"
          >
            Proof is in the <span className="text-gradient-vibrant">profit.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl"
          >
            Explore our curated portfolio of F&B success stories. From local favorites to national chains, we deliver measurable growth through data and creativity.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center gap-3 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                activeCategory === category
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {isLoading ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group cursor-pointer"
                  >
                    <div className={`relative aspect-[4/3] rounded-[32px] overflow-hidden mb-6 ${project.bg_color || 'bg-gray-100'}`}>
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt={project.client} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                      
                      {/* Top Tags */}
                      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                          {project.client}
                        </div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg transform translate-y-2 group-hover:translate-y-0">
                          <ArrowUpRight className="text-gray-900" />
                        </div>
                      </div>

                      {/* Bottom Highlight Stat */}
                      <div className="absolute bottom-6 right-6">
                        <div className="bg-gradient-vibrant px-4 py-2 rounded-2xl text-white font-bold text-sm shadow-xl transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          {project.stat1_val || project.stat_highlight}
                        </div>
                      </div>
                    </div>

                    <div className="px-2">
                      <p className="text-sm text-pink-500 font-semibold mb-2">{project.category}</p>
                      <h3 className="text-2xl font-headline text-gray-900 group-hover:text-pink-500 transition-colors">
                        {lang === 'en' ? project.title_en : project.title_vi}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </main>
  );
}
