"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <>
      {/* Vibrant Pre-Footer CTA */}
      <section className="bg-gradient-vibrant py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-white/80 font-medium text-sm tracking-widest uppercase mb-4">
            {t("footer.ctaSub")}
          </p>
          <h2 className="text-4xl md:text-5xl font-headline text-white mb-10">
            {t("footer.ctaTitle")}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              {t("footer.btnStart")}
            </Link>
            <Link
              href="/projects"
              className="px-8 py-3.5 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              {t("footer.btnWork")}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Main Footer */}
      <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div>
              <h4 className="font-semibold text-gray-900 mb-6">Dịch vụ</h4>
              <ul className="space-y-4 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-pink-500">Quảng cáo Facebook</Link></li>
                <li><Link href="#" className="hover:text-pink-500">Quảng cáo Instagram</Link></li>
                <li><Link href="#" className="hover:text-pink-500">Tối ưu hóa SEO</Link></li>
                <li><Link href="#" className="hover:text-pink-500">Xây dựng thương hiệu</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-6">Tài nguyên</h4>
              <ul className="space-y-4 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-pink-500">Case Studies</Link></li>
                <li><Link href="#" className="hover:text-pink-500">Blog</Link></li>
                <li><Link href="#" className="hover:text-pink-500">Báo cáo thị trường</Link></li>
                <li><Link href="#" className="hover:text-pink-500">Tài liệu hướng dẫn</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-6">Về chúng tôi</h4>
              <ul className="space-y-4 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-pink-500">Giới thiệu</Link></li>
                <li><Link href="#" className="hover:text-pink-500">Tuyển dụng</Link></li>
                <li><Link href="#" className="hover:text-pink-500">Báo chí</Link></li>
                <li><Link href="#" className="hover:text-pink-500">Liên hệ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-6">Pháp lý</h4>
              <ul className="space-y-4 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-pink-500">Điều khoản dịch vụ</Link></li>
                <li><Link href="#" className="hover:text-pink-500">Chính sách bảo mật</Link></li>
                <li><Link href="#" className="hover:text-pink-500">Chính sách cookie</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100 text-sm text-gray-500">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded bg-gradient-vibrant flex items-center justify-center text-white font-bold text-[10px]">A</div>
              <span>© {new Date().getFullYear()} {t("footer.copyright")}</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-pink-500">Facebook</Link>
              <Link href="#" className="hover:text-pink-500">Instagram</Link>
              <Link href="#" className="hover:text-pink-500">LinkedIn</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
