import { 
  Users, 
  TrendingUp, 
  Eye, 
  MousePointerClick, 
  ArrowRight, 
  Plus, 
  Briefcase, 
  FileText,
  Clock,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function PortalDashboard() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Fetch Stats
  const { count: leadsCount } = await supabase.from("leads").select("*", { count: "exact", head: true });
  const { count: projectsCount } = await supabase.from("projects").select("*", { count: "exact", head: true });
  const { count: postsCount } = await supabase.from("magazine").select("*", { count: "exact", head: true });

  // Fetch Recent Leads
  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch Recent Projects
  const { data: recentProjects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { title: "Tổng Leads", value: leadsCount || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-50", trend: "+12%" },
    { title: "Dự án", value: projectsCount || 0, icon: Briefcase, color: "text-green-500", bg: "bg-green-50", trend: "+2" },
    { title: "Bài viết", value: postsCount || 0, icon: FileText, color: "text-orange-500", bg: "bg-orange-50", trend: "+5" },
    { title: "Tương tác", value: "8.4k", icon: MousePointerClick, color: "text-pink-500", bg: "bg-pink-50", trend: "+24%" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold text-gray-900 mb-2">Xin chào, Admin 👋</h1>
          <p className="text-gray-500 text-lg">Đây là tổng quan tình hình kinh doanh của August Agency hôm nay.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/adminz/projects/new" 
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            <Plus size={18} />
            Dự án mới
          </Link>
          <Link 
            href="/adminz/magazine/new" 
            className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-all shadow-lg shadow-pink-200"
          >
            <Plus size={18} />
            Bài viết mới
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>
                <div className="px-2 py-1 rounded-lg bg-green-50 text-green-600 text-xs font-bold">
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Leads Table */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-headline font-bold text-gray-900">Khách hàng mới nhất</h2>
              <p className="text-sm text-gray-500">Danh sách Leads vừa đăng ký từ Website</p>
            </div>
            <Link href="/adminz/leads" className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
              <ArrowRight size={24} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentLeads && recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div key={lead.id} className="p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center font-bold">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-pink-500 transition-colors">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.brand || "Inquiry"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{lead.service?.split(" ")[0]}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                      <Clock size={12} /> {new Date(lead.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-gray-400">Chưa có khách hàng liên hệ.</div>
            )}
          </div>
          {recentLeads && recentLeads.length > 0 && (
            <Link href="/adminz/leads" className="block w-full py-4 text-center text-sm font-bold text-gray-400 hover:text-pink-500 hover:bg-gray-50 transition-all border-t border-gray-50 uppercase tracking-widest">
              Xem tất cả khách hàng
            </Link>
          )}
        </div>

        {/* Recent Projects / Performance */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-headline font-bold text-gray-900">Dự án đang triển khai</h2>
              <p className="text-sm text-gray-500">Các Portfolio vừa cập nhật</p>
            </div>
            <Link href="/adminz/projects" className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
              <ArrowRight size={24} />
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {recentProjects && recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <div key={project.id} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-gray-50 transition-all group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Briefcase className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{project.title}</p>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{project.category}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-pink-500 transition-colors" />
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-gray-400">Chưa có dự án nào.</div>
            )}
          </div>
          
          <div className="mx-8 mb-8 p-6 bg-gradient-vibrant rounded-2xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-sm font-bold opacity-80 mb-1 tracking-widest uppercase">Mẹo AI</p>
              <h4 className="text-lg font-bold mb-3">Tối ưu hóa nội dung bằng Gemini</h4>
              <p className="text-sm opacity-90 leading-relaxed mb-4">
                Sử dụng AI trong mục Tạp chí để tự động soạn thảo các bài viết xu hướng về F&B chỉ trong vài giây.
              </p>
              <Link href="/adminz/magazine/new" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-pink-500 rounded-lg text-sm font-bold hover:shadow-lg transition-all">
                Thử ngay <ChevronRight size={16} />
              </Link>
            </div>
            {/* Abstract Background */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
