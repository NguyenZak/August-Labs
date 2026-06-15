"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Utensils, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Phone, 
  Calendar,
  Users as UsersIcon,
  ChevronRight,
  MoreHorizontal,
  Loader2,
  Trash2,
  Download
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function BookingsCMS() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const { toast } = useToast();

  const fetchBookings = async () => {
    setIsLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        projects (
          client
        )
      `)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      setBookings(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      toast(`Đã cập nhật trạng thái thành: ${newStatus}`, "success");
      fetchBookings();
    } else {
      toast("Lỗi khi cập nhật: " + error.message, "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá yêu cầu đặt bàn này?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (!error) {
      toast("Đã xoá thành công!", "success");
      fetchBookings();
    } else {
      toast("Lỗi khi xoá: " + error.message, "error");
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      b.projects?.client?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesBrand = brandFilter === "all" || b.projects?.client === brandFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const bDate = b.booking_date; 
      const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });

      if (dateFilter === "today") {
        matchesDate = bDate === today;
      } else if (dateFilter === "yesterday") {
        matchesDate = bDate === yesterday;
      } else if (dateFilter === "custom" && customDate) {
        matchesDate = bDate === customDate;
      }
    }
    
    return matchesSearch && matchesStatus && matchesBrand && matchesDate;
  });

  const uniqueBrands = Array.from(new Set(bookings.map(b => b.projects?.client).filter(Boolean)));

  const handleExportCSV = () => {
    const headers = ["Khách hàng", "Số điện thoại", "Thương hiệu", "Ngày đặt", "Giờ đặt", "Số khách", "Trạng thái"];
    const csvRows = filteredBookings.map(b => {
      const clientName = `"${b.client_name}"`;
      const phone = `"${b.phone}"`;
      const brand = `"${b.projects?.client || 'General'}"`;
      const date = `"${new Date(b.booking_date).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}"`;
      const time = `"${b.booking_time.slice(0, 5)}"`;
      const guests = `"${b.guests}"`;
      
      let statusStr = "Chờ xác nhận";
      if (b.status === 'confirmed') statusStr = "Đã xác nhận";
      if (b.status === 'cancelled') statusStr = "Đã hủy";
      if (b.status === 'completed') statusStr = "Hoàn thành";
      statusStr = `"${statusStr}"`;

      return [clientName, phone, brand, date, time, guests, statusStr].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `dat_ban_${new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" })}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100 flex items-center gap-1.5 w-fit"><CheckCircle2 size={12} /> Đã xác nhận</span>;
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100 flex items-center gap-1.5 w-fit"><XCircle size={12} /> Đã hủy</span>;
      case 'completed':
        return <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 flex items-center gap-1.5 w-fit"><CheckCircle2 size={12} /> Hoàn thành</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold border border-amber-100 flex items-center gap-1.5 w-fit"><Clock size={12} /> Chờ xác nhận</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline text-gray-900">Quản lý Đặt bàn</h1>
          <p className="text-gray-500 mt-1">Quản lý các yêu cầu đặt chỗ từ khách hàng của từng thương hiệu.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Tổng yêu cầu", value: bookings.length, color: "bg-white", textColor: "text-gray-900" },
          { label: "Đang chờ", value: bookings.filter(b => b.status === 'pending').length, color: "bg-amber-50", textColor: "text-amber-600" },
          { label: "Đã xác nhận", value: bookings.filter(b => b.status === 'confirmed').length, color: "bg-green-50", textColor: "text-green-600" },
          { label: "Hôm nay", value: bookings.filter(b => b.booking_date === new Date().toISOString().split('T')[0]).length, color: "bg-blue-50", textColor: "text-blue-600" },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.color} p-6 rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]`}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-headline ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Tìm theo tên khách, số điện thoại hoặc thương hiệu..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 focus:border-pink-500 focus:ring-1 bg-gray-50/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors w-full md:w-auto whitespace-nowrap font-semibold shadow-sm"
          >
            <Download size={18} />
            Xuất Excel
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full">
          <Filter className="text-gray-400 shrink-0 hidden md:block" size={18} />
          
          <select 
            className="flex-1 md:flex-none md:w-auto px-4 py-2 rounded-xl border border-gray-100 focus:border-pink-500 focus:ring-1 bg-gray-50/50 text-sm font-semibold"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="all">Tất cả thương hiệu</option>
            {uniqueBrands.map((brand: any, idx) => (
              <option key={idx} value={brand}>{brand}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <select 
              className="w-full md:w-auto px-4 py-2 rounded-xl border border-gray-100 focus:border-pink-500 focus:ring-1 bg-gray-50/50 text-sm font-semibold"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Mọi thời điểm</option>
              <option value="today">Hôm nay</option>
              <option value="yesterday">Hôm qua</option>
              <option value="custom">Ngày tuỳ chọn...</option>
            </select>
            {dateFilter === "custom" && (
              <input 
                type="date"
                className="w-full md:w-auto px-4 py-2 rounded-xl border border-gray-100 focus:border-pink-500 focus:ring-1 bg-gray-50/50 text-sm font-semibold"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            )}
          </div>

          <select 
            className="flex-1 md:flex-none md:w-auto px-4 py-2 rounded-xl border border-gray-100 focus:border-pink-500 focus:ring-1 bg-gray-50/50 text-sm font-semibold"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Khách hàng</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Thời gian & Số khách</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Thương hiệu</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-pink-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                    Không có yêu cầu đặt bàn nào.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          {booking.client_name}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <Phone size={12} className="text-gray-400" />
                          {booking.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Calendar size={14} className="text-pink-500" />
                          {new Date(booking.booking_date).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} /> {booking.booking_time.slice(0, 5)}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <UsersIcon size={12} /> {booking.guests} người
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-tight">
                        {booking.projects?.client || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                          title="Xác nhận"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button 
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hủy bỏ"
                        >
                          <XCircle size={18} />
                        </button>
                        <div className="w-[1px] h-4 bg-gray-200 mx-1" />
                        <button 
                          onClick={() => handleDelete(booking.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Xóa"
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
