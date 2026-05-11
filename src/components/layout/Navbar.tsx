"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useSettings } from "@/lib/context/SettingsContext";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();
  const { general, loading } = useSettings();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white",
        isScrolled ? "py-4 border-b border-gray-100 shadow-sm" : "py-6"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-30 flex items-center shrink-0 group min-w-[40px]">
          {general.logo_url ? (
            <img 
              src={general.logo_url} 
              alt={general.agency_name} 
              className="h-8 md:h-10 w-auto max-w-[200px] object-contain block shrink-0"
              style={{ minWidth: '1px' }}
              loading="eager"
            />
          ) : !loading ? (
            <span className="font-bold text-xl text-gray-900 uppercase tracking-tighter">
              {general.agency_name}
            </span>
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-100 animate-pulse" />
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: t("nav.work"), href: "/projects" },
            { label: t("nav.services"), href: "/services" },
            { label: t("nav.intelligence"), href: "/intelligence" },
            { label: t("nav.insights"), href: "/magazine" },
            { label: t("nav.about"), href: "/about" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Portal */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "en" ? "vi" : "en")}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mr-2 uppercase"
          >
            <Globe size={16} />
            <span>{lang === "en" ? "VI" : "EN"}</span>
          </button>
          <Link
            href="/contact"
            className="px-5 py-2 rounded-full border border-pink-500 text-pink-500 text-sm font-semibold hover:bg-pink-50 transition-colors"
          >
            {t("nav.getProposal")}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative z-20 p-2 text-gray-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 py-4 px-6 shadow-lg flex flex-col gap-4">
          {[
            { label: t("nav.work"), href: "/projects" },
            { label: t("nav.services"), href: "/services" },
            { label: t("nav.intelligence"), href: "/intelligence" },
            { label: t("nav.insights"), href: "/magazine" },
            { label: t("nav.about"), href: "/about" },
            { label: t("nav.getProposal"), href: "/contact" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-medium text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 mt-2">
            <button
              onClick={() => {
                setLang(lang === "en" ? "vi" : "en");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-base font-medium text-gray-900 uppercase"
            >
              <Globe size={20} className="text-pink-500" />
              <span>{lang === "en" ? "Tiếng Việt" : "English"}</span>
            </button>
          </div>
        </div>

      )}
    </motion.header>
  );
}
