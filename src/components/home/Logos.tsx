"use client";

import { motion } from "framer-motion";

const clients = [
  "Miyako Sushi",
  "The Coffee House",
  "Highlands Coffee",
  "Pizza 4P's",
  "Golden Gate Group",
  "Haidilao",
  "Baozi",
  "Godmother Bakehouse"
];

export default function Logos() {
  return (
    <section className="py-12 bg-gray-50/50 border-y border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6 mb-6 text-center">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
          Trusted by Top F&B Brands
        </p>
      </div>
      
      <div className="relative w-full flex items-center">
        {/* Gradient fades for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        
        {/* Infinite Marquee */}
        <motion.div
          className="flex whitespace-nowrap gap-16 md:gap-24 px-8 items-center"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          }}
        >
          {/* Double array for seamless loop */}
          {[...clients, ...clients].map((client, index) => (
            <div 
              key={index}
              className="text-2xl md:text-3xl font-headline text-gray-300 font-bold tracking-tight opacity-70 hover:opacity-100 hover:text-gray-900 transition-all cursor-default"
            >
              {client}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
