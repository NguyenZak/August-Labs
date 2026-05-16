"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Ghost, Compass, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFoundContent({ relatedPosts }: { relatedPosts: any[] }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="relative min-h-screen bg-black overflow-y-auto flex flex-col items-center justify-start font-sans py-20">
      {/* Interactive Background Glow */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(236, 72, 153, 0.15), transparent 80%)`
        }}
      />

      {/* Floating Chaos Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none h-screen">
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: [null, Math.random() * -200 - 100],
              x: [null, (Math.random() - 0.5) * 200],
              opacity: [0, 0.4, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute text-pink-500/20"
          >
            {i % 3 === 0 ? <Sparkles size={Math.random() * 40 + 10} /> : 
             i % 3 === 1 ? <Ghost size={Math.random() * 40 + 10} /> : 
             <div className="w-2 h-2 bg-pink-500 rounded-full blur-sm" />}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative inline-block mb-8">
            <motion.h1 
              animate={{ 
                textShadow: [
                  "0 0 0px rgba(236, 72, 153, 0)",
                  "0 0 20px rgba(236, 72, 153, 0.5)",
                  "0 0 0px rgba(236, 72, 153, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[12rem] md:text-[20rem] font-headline font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10"
            >
              404
            </motion.h1>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Compass size={120} className="text-pink-500/30 blur-[2px] md:w-[200px] md:h-[200px]" />
            </motion.div>
          </div>

          <h2 className="text-3xl md:text-5xl font-headline text-white mb-6">
            Houston, we have a <span className="text-pink-500 italic">glitch</span>.
          </h2>
          
          <p className="text-gray-400 max-w-xl mx-auto text-lg md:text-xl leading-relaxed mb-12">
            You've drifted into a digital void where reality bends and pages vanish. 
            The link you followed was likely swallowed by a creative black hole.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link 
              href="/"
              className="group relative px-10 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                Teleport to Safety
              </span>
              <motion.div 
                className="absolute inset-0 bg-pink-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ type: "tween" }}
              />
            </Link>

            <Link 
              href="/projects"
              className="px-10 py-4 bg-transparent border-2 border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all hover:border-white/40"
            >
              Explore the Known Universe
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Suggested Content */}
      <div className="relative z-10 container mx-auto px-6 max-w-4xl">
        <div className="text-left mb-8">
          <h3 className="text-2xl font-headline text-white">While you're here, check these out:</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {relatedPosts.map((post) => (
            <Link 
              key={post.id} 
              href={`/magazine/${post.slug}`}
              className="group bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all hover:border-pink-500/50"
            >
              <span className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-2 block">{post.category}</span>
              <h4 className="text-xl font-bold text-white mb-4 line-clamp-2">{post.title_vi}</h4>
              <div className="flex items-center gap-2 text-white/40 text-sm font-bold group-hover:text-white transition-colors">
                Read Story <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Secret Glitch Text */}
      <motion.div
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }}
        className="mt-20 text-pink-500/40 font-mono text-xs uppercase tracking-[1em]"
      >
        August Agency // System Override // Reality.NULL
      </motion.div>
    </main>
  );
}
