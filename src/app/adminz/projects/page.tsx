import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Plus, Edit3, Trash2, ExternalLink, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import DeleteProjectButton from "./DeleteProjectButton";

export const dynamic = 'force-dynamic';

export default async function ProjectsCMSPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="text-red-500">Error loading projects: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline text-gray-900 mb-2">Dự án Portfolio</h1>
          <p className="text-gray-500">Quản lý các dự án được hiển thị trên trang Work.</p>
        </div>
        <Link 
          href="/adminz/projects/new" 
          className="flex items-center justify-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/25 active:scale-95"
        >
          <Plus size={20} />
          Thêm dự án mới
        </Link>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lĩnh vực</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-gray-100">
            {!projects || projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  Chưa có dự án nào. Hãy tạo dự án đầu tiên của bạn.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    {project.image_url ? (
                      <img src={project.image_url} className="w-16 h-12 rounded-lg object-cover" alt="" />
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                        <ImageIcon size={18} />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-gray-900">{project.client}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{project.title_vi}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                      Hiển thị
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-pink-500">
                    {project.stat_highlight}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a 
                        href={`http://${project.subdomain || project.slug}.localhost:3000`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-pink-500 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-pink-200"
                        title="Xem trang thực tế"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link 
                        href={`/adminz/projects/${project.slug}`}
                        className="p-2 text-gray-400 hover:text-blue-500 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-blue-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <DeleteProjectButton id={project.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
