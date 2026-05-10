"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Clock, User, Share2, Link2, Loader2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function MagazineDetailPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const fetchPost = async () => {
      const resolvedParams = await params;
      const supabase = createClient();
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", resolvedParams.slug)
        .single();
      
      setPost(data);
      setIsLoading(false);
    };
    fetchPost();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-headline">Post Not Found</h1>
        <Link href="/magazine" className="text-pink-500 font-bold">Back to Magazine</Link>
      </div>
    );
  }

  const title = lang === 'en' ? post.title_en : post.title_vi;
  const content = lang === 'en' ? post.content_en : post.content_vi;
  const excerpt = lang === 'en' ? post.excerpt_en : post.excerpt_vi;

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <article className="container mx-auto px-6 md:px-12 max-w-4xl">
        {/* Header */}
        <div className="space-y-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link 
              href="/magazine" 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group mb-8"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-bold uppercase tracking-widest">Back to Magazine</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-pink-50 text-pink-500 text-xs font-bold uppercase tracking-widest">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-headline text-gray-900 leading-tight">
              {title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-medium italic border-l-4 border-pink-500 pl-6">
              {excerpt}
            </p>
          </motion.div>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-8 py-8 border-y border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={20} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Author</p>
                <p className="text-sm font-bold text-gray-900">{post.author}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Published</p>
              <p className="text-sm font-bold text-gray-900">
                {new Date(post.published_at).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Reading Time</p>
              <p className="text-sm font-bold text-gray-900">8 min read</p>
            </div>
          </motion.div>
        </div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative aspect-[16/9] rounded-[40px] overflow-hidden mb-16 shadow-2xl"
        >
          <img 
            src={post.image_url} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-gray-900 prose-img:rounded-3xl"
        >
          {/* We'll use dangerouslySetInnerHTML for content coming from a Rich Text Editor later */}
          <div className="whitespace-pre-line text-lg text-gray-700 leading-loose">
            {content}
          </div>
        </motion.div>

        {/* Share */}
        <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Share this article</span>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <Share2 size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <MessageSquare size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <Link2 size={18} />
              </button>
            </div>
          </div>
          
          <Link 
            href="/contact"
            className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-500 transition-colors shadow-lg"
          >
            Get Expert Insights
          </Link>
        </div>
      </article>
    </main>
  );
}
