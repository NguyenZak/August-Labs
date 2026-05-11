"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Search, Filter, Edit, Trash2, ExternalLink, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function MagazineCMS() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchPosts = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setPosts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá bài viết này?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (!error) {
      toast("Đã xoá bài viết thành công!", "success");
      fetchPosts();
    } else {
      toast("Lỗi khi xoá: " + error.message, "error");
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title_vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.title_en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline text-gray-900">Quản lý Magazine</h1>
          <p className="text-gray-500 mt-1">Viết bài, quản lý nội dung và tối ưu SEO cho blog.</p>
        </div>
        <Link 
          href="/adminz/magazine/new"
          className="flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20"
        >
          <Plus size={20} />
          Viết bài mới
        </Link>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Tổng số bài</p>
          <p className="text-3xl font-headline text-gray-900">{posts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Đã xuất bản</p>
          <p className="text-3xl font-headline text-green-500">{posts.filter(p => p.status === 'published').length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Bản nháp</p>
          <p className="text-3xl font-headline text-amber-500">{posts.filter(p => p.status === 'draft').length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Tìm kiếm tiêu đề bài viết..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 focus:border-pink-500 focus:ring-1 bg-gray-50/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
          <Filter size={18} />
          Bộ lọc
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Bài viết</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Danh mục</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-pink-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-500">
                    Không tìm thấy bài viết nào.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                          {post.image_url ? (
                            <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Sparkles className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{post.title_vi}</p>
                          <p className="text-xs text-gray-500">Slug: {post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${post.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <span className={`text-xs font-bold ${post.status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                          {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/magazine/${post.slug}`} 
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link 
                          href={`/adminz/magazine/${post.slug}`} 
                          className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
