"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, FolderKanban, FileText, Settings, LogOut, Menu, MousePointerClick, Image as ImageIcon, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setRole(data?.role || "VIEWER");
      }
    };
    fetchRole();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/adminz/login");
    router.refresh();
  };

  // If we are on the login page, don't show the sidebar
  if (pathname === "/adminz/login") {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "Tổng quan", href: "/adminz", icon: LayoutDashboard },
    { name: "Khách hàng (Leads)", href: "/adminz/leads", icon: MousePointerClick },
    { name: "Nhân sự", href: "/adminz/staff", icon: Users },
    { name: "Thư viện Media", href: "/adminz/media", icon: ImageIcon },
    { name: "Trang chủ (Hero)", href: "/adminz/hero", icon: FileText },
    { name: "Dự án (Projects)", href: "/adminz/projects", icon: FolderKanban },
    { name: "Tạp chí (Magazine)", href: "/adminz/magazine", icon: FileText },
    { name: "Đặt bàn (Bookings)", href: "/adminz/bookings", icon: Utensils },
    { name: "Cài đặt", href: "/adminz/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isMobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : -280) }}
        transition={{ duration: 0.3 }}
        className="fixed md:static inset-y-0 left-0 w-64 bg-gray-900 text-white z-50 flex flex-col"
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/adminz" className="text-2xl font-headline tracking-tight">
            August<span className="text-pink-500">.</span>CMS
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-pink-500 text-white font-semibold shadow-lg shadow-pink-500/20" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-left"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shrink-0">
          <button 
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">Admin</span>
              <span className="text-xs text-gray-500">august@agency.com</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-vibrant p-[2px]">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-gray-900">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
