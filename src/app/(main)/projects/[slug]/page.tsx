"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, ExternalLink, ArrowRight, Loader2, Image as ImageIcon, Utensils } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      const supabase = createClient();
      
      const { data: projectData } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", resolvedParams.slug)
        .single();

      if (projectData) {
        setProject(projectData);
        
        const { data: relatedData } = await supabase
          .from("projects")
          .select("*")
          .neq("id", projectData.id)
          .limit(2);
        
        setRelated(relatedData || []);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-headline">Project Not Found</h1>
        <Link href="/projects" className="text-pink-500 font-bold">Back to Projects</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        {project.image_url ? (
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={project.image_url} 
            alt={project.client}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-500">
            No Header Image
          </div>
        )}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 md:px-12 pb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                href="/projects" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
              >
                <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                <span>{lang === 'en' ? 'Back to Projects' : 'Quay lại dự án'}</span>
              </Link>
            </motion.div>
            
            <div className="max-w-4xl">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold uppercase tracking-widest mb-6"
              >
                {project.category}
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-5xl md:text-8xl font-headline text-white leading-tight mb-8"
              >
                {project.client}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-xl md:text-2xl text-white/90 font-medium max-w-3xl leading-relaxed"
              >
                {lang === 'en' ? project.title_en : project.title_vi}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Info Column */}
            <div className="lg:col-span-4 space-y-12">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-8">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Client</h4>
                  <p className="text-xl font-semibold text-gray-900">{project.client}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Services</h4>
                  <p className="text-xl font-semibold text-gray-900">{project.category}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Year</h4>
                  <p className="text-xl font-semibold text-gray-900">2024</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Stat Highlight</h4>
                  <p className="text-3xl font-headline text-pink-500">{project.stat_highlight}</p>
                </div>
              </div>

              <div className="pt-8 flex flex-wrap gap-4">
                <button className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-pink-500 transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                  {lang === 'en' ? 'Visit Website' : 'Xem website'}
                  <ExternalLink size={18} />
                </button>
                
                {project.booking_url && (
                  <Link 
                    href={project.booking_url}
                    target="_blank"
                    className="flex items-center gap-3 bg-pink-500 text-white px-8 py-4 rounded-full font-bold hover:bg-pink-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-pink-200"
                  >
                    {lang === 'en' ? 'Book a Table' : 'Đặt bàn ngay'}
                    <Utensils size={18} />
                  </Link>
                )}

                {project.menu_images && project.menu_images.length > 0 && (
                  <Link 
                    href={`/projects/${project.slug}/menu`}
                    className="flex items-center gap-3 bg-pink-50 text-pink-600 px-8 py-4 rounded-full font-bold hover:bg-pink-100 transition-all transform hover:scale-105 active:scale-95 border border-pink-100"
                  >
                    {lang === 'en' ? 'View Menu' : 'Xem Menu'}
                    <ImageIcon size={18} />
                  </Link>
                )}
              </div>
            </div>

            {/* Right Content Column */}
            <div className="lg:col-span-8 space-y-16">
              <div className="space-y-8">
                <h2 className="text-4xl font-headline text-gray-900">
                  {lang === 'en' ? 'The Challenge' : 'Thách thức'}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed whitespace-pre-line">
                  {lang === 'en' 
                    ? (project.challenge_en || `Every great brand has a story, and for ${project.client}, the narrative needed a bold new chapter.`)
                    : (project.challenge_vi || `Mỗi thương hiệu lớn đều có một câu chuyện, và với ${project.client}, câu chuyện đó cần một chương mới táo bạo.`)
                  }
                </p>
              </div>

              <div className="rounded-[40px] overflow-hidden bg-gray-50 aspect-video shadow-2xl">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt="Project Detail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Image Unavailable
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <h2 className="text-4xl font-headline text-gray-900">
                  {lang === 'en' ? 'Our Strategy' : 'Chiến lược của chúng tôi'}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed whitespace-pre-line">
                  {lang === 'en'
                    ? (project.strategy_en || "Our approach was data-driven but creatively fueled. We conducted deep-dive audits of the customer journey.")
                    : (project.strategy_vi || "Cách tiếp cận của chúng tôi dựa trên dữ liệu nhưng được thúc đẩy bởi sự sáng tạo.")
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                  <div className="p-8 bg-blue-50 rounded-3xl">
                    <h3 className="text-2xl font-headline text-gray-900 mb-4">Creative Direction</h3>
                    <p className="text-gray-600">Immersive storytelling through cinematic visuals and refined typography.</p>
                  </div>
                  <div className="p-8 bg-pink-50 rounded-3xl">
                    <h3 className="text-2xl font-headline text-gray-900 mb-4">Growth Engine</h3>
                    <p className="text-gray-600">Proprietary O2O strategies designed to drive measurable revenue growth.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <span className="text-pink-500 font-bold uppercase tracking-[0.3em] mb-8 block">
            {lang === 'en' ? 'The Results' : 'Kết quả'}
          </span>
          <h2 className="text-5xl md:text-7xl font-headline mb-16">
            {lang === 'en' ? 'Real growth. Real impact.' : 'Tăng trưởng thật. Tác động thật.'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="space-y-2">
              <p className="text-6xl font-headline text-pink-500">{project.stat1_val || project.stat_highlight}</p>
              <p className="text-gray-400 font-medium">{lang === 'en' ? (project.stat1_label_en || 'Growth in Revenue') : (project.stat1_label_vi || 'Tăng trưởng doanh thu')}</p>
            </div>
            <div className="space-y-2">
              <p className="text-6xl font-headline text-white">{project.stat2_val || '1.2M+'}</p>
              <p className="text-gray-400 font-medium">{lang === 'en' ? (project.stat2_label_en || 'Audience Reach') : (project.stat2_label_vi || 'Lượt tiếp cận')}</p>
            </div>
            <div className="space-y-2">
              <p className="text-6xl font-headline text-white">{project.stat3_val || '24/7'}</p>
              <p className="text-gray-400 font-medium">{lang === 'en' ? (project.stat3_label_en || 'Brand Presence') : (project.stat3_label_vi || 'Hiện diện thương hiệu')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Projects */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-headline text-gray-900">
              {lang === 'en' ? 'Explore more work' : 'Khám phá các dự án khác'}
            </h2>
            <Link href="/projects" className="text-pink-500 font-bold flex items-center gap-2 group">
              {lang === 'en' ? 'View all projects' : 'Xem tất cả dự án'}
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {related?.map((item) => (
              <Link key={item.id} href={`/projects/${item.slug}`} className="group block">
                <div className={`relative aspect-[16/9] rounded-[32px] overflow-hidden mb-6 ${item.bg_color}`}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.client} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <h3 className="text-2xl font-headline text-gray-900 group-hover:text-pink-500 transition-colors">{item.client}</h3>
                <p className="text-gray-500 mt-2">{item.category}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
