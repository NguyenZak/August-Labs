"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Loader2, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useToast } from "@/context/ToastContext";

export default function ProjectMenuPage({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { lang } = useLanguage();
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: `${project?.client || 'Menu'} - August Agency`,
      text: lang === 'en' 
        ? `Check out the menu for ${project?.client}` 
        : `Xem thực đơn của ${project?.client}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast(
          lang === 'en' ? 'Link copied to clipboard!' : 'Đã sao chép liên kết vào bộ nhớ tạm!',
          "success"
        );
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error("Error sharing:", err);
      }
    }
  };

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
      }
      setIsLoading(false);
    };
    fetchData();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!project || !project.menu_images || project.menu_images.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-headline">Menu not found</h1>
        <Link href={`/projects/${params.slug}`} className="text-pink-500 font-bold">Back to Project</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href={`/projects/${project.slug}`}
            className="flex items-center gap-2 text-gray-900 font-bold hover:text-pink-500 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="hidden md:inline">{lang === 'en' ? 'Back to Project' : 'Quay lại dự án'}</span>
          </Link>

          <div className="text-center">
            <h1 className="text-lg font-headline text-gray-900">{project.client}</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Digital Menu Experience</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-all"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu Content */}
      <div className="container mx-auto px-4 max-w-4xl py-12 space-y-8">
        {project.menu_images.map((image: string, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="relative group"
          >
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 transition-shadow hover:shadow-2xl">
              {image ? (
                <img 
                  src={image} 
                  alt={`${project.client} Menu Page ${index + 1}`}
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center text-gray-400">
                  Image Missing
                </div>
              )}
            </div>
            
            {/* Page Indicator */}
            <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/50 backdrop-blur text-white text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
              Page {index + 1} / {project.menu_images.length}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="container mx-auto px-6 text-center pt-10 text-gray-400">
        <p className="text-sm">© 2024 August Agency × {project.client}</p>
        <div className="mt-4 flex justify-center gap-8">
          <Link href="/" className="text-xs hover:text-gray-900 transition-colors uppercase tracking-widest font-bold">August Agency</Link>
          <Link href="/contact" className="text-xs hover:text-gray-900 transition-colors uppercase tracking-widest font-bold">Contact Us</Link>
        </div>
      </div>
    </main>
  );
}
