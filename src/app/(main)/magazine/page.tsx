"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight, Mail, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

export default function MagazinePage() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["All", "Strategy", "Data & Trends", "Technology"];

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      
      if (data) setPosts(data);
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const featuredPost = posts[0];

  return (
    <main className="min-h-screen bg-gray-50/50 pb-24">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-headline tracking-tight text-gray-900 mb-6"
          >
            {t("pageInsights.heroTitle")} <br className="hidden md:block"/>
            <span className="text-gradient-vibrant">{t("pageInsights.heroHighlight")}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
          >
            {t("pageInsights.heroDesc")}
          </motion.p>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
        </div>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="py-12 px-6 md:px-12">
              <div className="container mx-auto max-w-6xl">
                <Link href={`/magazine/${featuredPost.slug}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="group relative bg-white rounded-[40px] overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row cursor-pointer h-auto md:h-[500px]"
                  >
                    <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden">
                      <img 
                        src={featuredPost.image_url} 
                        alt={featuredPost.title_vi} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-gray-900 uppercase tracking-wider">
                        FEATURED STORY
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gray-900 text-white">
                      <span className="text-pink-500 font-bold text-xs uppercase tracking-widest mb-4">
                        {featuredPost.category}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-headline leading-tight mb-6 group-hover:text-pink-400 transition-colors">
                        {lang === 'en' ? featuredPost.title_en : featuredPost.title_vi}
                      </h2>
                      <p className="text-gray-400 text-lg mb-8 leading-relaxed line-clamp-3">
                        {lang === 'en' ? featuredPost.excerpt_en : featuredPost.excerpt_vi}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-auto pt-8 border-t border-gray-800">
                        <span className="text-gray-500 text-sm font-medium">
                          {new Date(featuredPost.published_at).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-2 text-white font-bold hover:text-pink-400 transition-colors">
                          {t("pageInsights.readBtn")}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </section>
          )}

          {/* Grid Section */}
          <section className="py-12">
            <div className="container mx-auto px-6 md:px-12 max-w-6xl">
              
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-12">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                      activeCategory === cat
                        ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900 shadow-sm"
                    }`}
                  >
                    {cat === 'All' ? t("pageInsights.filterAll") : cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredPosts.slice(featuredPost ? 1 : 0).map((post) => (
                    <Link key={post.id} href={`/magazine/${post.slug}`}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="group cursor-pointer bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img 
                            src={post.image_url} 
                            alt={post.title_vi} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-900 uppercase tracking-wider">
                            {post.category}
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-xl font-headline text-gray-900 mb-4 group-hover:text-pink-500 transition-colors line-clamp-2">
                            {lang === 'en' ? post.title_en : post.title_vi}
                          </h3>
                          <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                            {lang === 'en' ? post.excerpt_en : post.excerpt_vi}
                          </p>
                          <div className="flex items-center justify-between text-xs font-medium text-gray-400 mt-auto pt-6 border-t border-gray-50">
                            <span>{new Date(post.published_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1 text-gray-900 font-bold group-hover:text-pink-500 transition-colors">
                              READ <ArrowUpRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </section>
        </>
      )}

      {/* Newsletter */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="bg-pink-50 rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 border border-pink-100">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-headline text-gray-900 mb-4">{t("pageInsights.subscribeTitle")}</h2>
              <p className="text-gray-600 text-lg">{t("pageInsights.subscribeDesc")}</p>
            </div>
            <div className="w-full md:w-auto flex-1 max-w-md">
              <form className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="email" 
                    placeholder={t("pageInsights.subscribePlaceholder")}
                    className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white"
                  />
                </div>
                <button type="button" className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap">
                  {t("pageInsights.subscribeBtn")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
