"use client";

import { useEffect, useState } from "react";
import { getAllProfiles, updateMemberRole, deleteMember, createMember } from "@/app/actions/staff";
import { 
  Users, 
  Shield, 
  UserCheck, 
  UserX, 
  MoreVertical, 
  Mail, 
  ShieldAlert,
  Loader2,
  Trash2,
  UserPlus,
  X,
  Edit2,
  Save,
  Key,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function StaffPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", role: "" });
  
  // Add Staff Form
  const [addForm, setAddForm] = useState({ email: "", full_name: "", role: "EDITOR", password: "" });
  const [adding, setAdding] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log("Current User ID:", user?.id);

        if (user) {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          
          console.log("Fetched Profile:", profile);
          
          if (profile?.role === "ADMIN") {
            setRole("ADMIN");
            await fetchMembers();
          } else {
            setRole("DENIED");
          }
        } else {
          setRole("DENIED");
        }
      } catch (err) {
        console.error("Initialization Error:", err);
        setRole("DENIED");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await getAllProfiles();
      setMembers(data || []);
    } catch (error) {
      console.error("Fetch Members Error:", error);
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    const result = await createMember(addForm);
    if (result.success) {
      alert("Đã tạo tài khoản nhân sự thành công!");
      setShowAddModal(false);
      setAddForm({ email: "", full_name: "", role: "EDITOR", password: "" });
      fetchMembers();
    } else {
      alert(result.error);
    }
    setAdding(false);
  };

  const handleStartEdit = (member: any) => {
    setEditingId(member.id);
    setEditForm({ full_name: member.full_name || "", role: member.role });
  };

  const handleSaveEdit = async (userId: string) => {
    setUpdatingId(userId);
    const result = await updateMemberRole(userId, editForm.role);
    if (result.success) {
      setMembers(prev => prev.map(m => m.id === userId ? { ...m, ...editForm } : m));
      setEditingId(null);
    } else {
      alert(result.error);
    }
    setUpdatingId(null);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này?")) return;
    setUpdatingId(userId);
    try {
      const result = await deleteMember(userId);
      if (result.success) {
        setMembers(prev => prev.filter(m => m.id !== userId));
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Lỗi khi xóa nhân sự.");
    }
    setUpdatingId(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold flex items-center gap-1.5 w-fit uppercase tracking-wider"><Shield size={12} /> Admin</span>;
      case "EDITOR":
        return <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center gap-1.5 w-fit uppercase tracking-wider"><UserCheck size={12} /> Editor</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-bold flex items-center gap-1.5 w-fit uppercase tracking-wider">Viewer</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Truy cập bị từ chối</h2>
        <p className="text-gray-500 max-w-md">Bạn không có quyền quản trị để truy cập trang này. Vui lòng liên hệ quản trị viên cấp cao.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold text-gray-900 mb-2">Quản lý nhân sự</h1>
          <p className="text-gray-500 text-lg">Admin có quyền thêm, sửa và phân quyền cho đội ngũ.</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
        >
          <UserPlus size={20} />
          Thêm nhân sự mới
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Nhân sự</th>
                <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Quyền hạn</th>
                <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((member) => (
                <motion.tr 
                  layout
                  key={member.id} 
                  className="hover:bg-gray-50/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-vibrant flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {member.full_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        {editingId === member.id ? (
                          <input 
                            className="font-bold text-gray-900 border-b border-pink-500 outline-none"
                            value={editForm.full_name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                          />
                        ) : (
                          <p className="font-bold text-gray-900">{member.full_name || "Chưa đặt tên"}</p>
                        )}
                        <p className="text-sm text-gray-400 flex items-center gap-1.5 truncate max-w-[250px]">
                          <Mail size={12} /> {member.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {editingId === member.id ? (
                        <select 
                          className="px-3 py-1 rounded-lg border border-gray-200 text-xs font-bold uppercase"
                          value={editForm.role}
                          onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="EDITOR">EDITOR</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                      ) : (
                        getRoleBadge(member.role)
                      )}
                      {updatingId === member.id && <Loader2 size={16} className="animate-spin text-pink-500" />}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === member.id ? (
                        <button 
                          onClick={() => handleSaveEdit(member.id)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all"
                        >
                          <Save size={20} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStartEdit(member)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit2 size={20} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(member.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Thêm nhân sự mới</h3>
                  <p className="text-sm text-gray-500 mt-1">Tạo tài khoản trực tiếp cho nhân viên của bạn.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateMember} className="p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Họ và Tên</label>
                    <input 
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-500 outline-none transition-all"
                      value={addForm.full_name}
                      onChange={(e) => setAddForm(prev => ({ ...prev, full_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Vai trò</label>
                    <select 
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-500 outline-none transition-all appearance-none bg-white"
                      value={addForm.role}
                      onChange={(e) => setAddForm(prev => ({ ...prev, role: e.target.value }))}
                    >
                      <option value="EDITOR">EDITOR (Quản lý nội dung)</option>
                      <option value="ADMIN">ADMIN (Toàn quyền)</option>
                      <option value="VIEWER">VIEWER (Chỉ xem)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email đăng nhập</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required
                      type="email"
                      placeholder="name@augustagency.com"
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-500 outline-none transition-all"
                      value={addForm.email}
                      onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Mật khẩu khởi tạo</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 rounded-2xl border border-gray-200 focus:border-pink-500 outline-none transition-all"
                      value={addForm.password}
                      onChange={(e) => setAddForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={adding}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus size={20} /> Tạo tài khoản nhân sự</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
