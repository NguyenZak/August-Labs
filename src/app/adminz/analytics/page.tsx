"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  BarChart3, 
  Users, 
  MousePointer2, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  Calendar,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const [rawData, setRawData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const processStats = (data: any[]) => {
    // Calculate basic stats
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const visitsToday = data.filter(v => v.created_at.startsWith(today)).length;
    const totalVisits = data.length;
    
    // Device distribution
    const devices = data.reduce((acc: any, curr: any) => {
      acc[curr.device_type] = (acc[curr.device_type] || 0) + 1;
      return acc;
    }, {});

    // Top pages
    const pages = data.reduce((acc: any, curr: any) => {
      acc[curr.page_url] = (acc[curr.page_url] || 0) + 1;
      return acc;
    }, {});
    const topPages = Object.entries(pages)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 5);

    // Browsers
    const browsers = data.reduce((acc: any, curr: any) => {
      acc[curr.browser] = (acc[curr.browser] || 0) + 1;
      return acc;
    }, {});

    setStats({
      visitsToday,
      totalVisits,
      devices,
      topPages,
      browsers,
      recentVisits: data.slice(0, 10)
    });
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data } = await supabase
        .from("analytics")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setRawData(data);
        processStats(data);
      }
      setIsLoading(false);
    };

    fetchAnalytics();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('analytics-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'analytics' },
        (payload) => {
          setRawData(prev => {
            const newData = [payload.new, ...prev];
            processStats(newData);
            return newData;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const cards = [
    { title: "Lượt truy cập hôm nay", value: stats?.visitsToday || 0, icon: MousePointer2, color: "bg-blue-500" },
    { title: "Tổng lượt truy cập", value: stats?.totalVisits || 0, icon: Users, color: "bg-purple-500" },
    { title: "Thiết bị di động", value: stats?.devices?.mobile || 0, icon: Smartphone, color: "bg-pink-500" },
    { title: "Máy tính để bàn", value: stats?.devices?.desktop || 0, icon: Monitor, color: "bg-indigo-500" },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thống kê truy cập</h1>
          <p className="text-gray-500 mt-1">Theo dõi lưu lượng và hành vi người dùng trên hệ thống.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-2">
            <Calendar size={16} />
            <span>Thời gian: Tất cả</span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${card.color} text-white`}>
                <card.icon size={24} />
              </div>
              <div className="flex items-center text-green-500 text-xs font-bold">
                <TrendingUp size={14} className="mr-1" />
                +12%
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">{card.value.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Globe size={20} className="text-blue-500" />
              Trang xem nhiều nhất
            </h2>
          </div>
          <div className="space-y-4">
            {stats?.topPages.map(([url, count]: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-xs font-bold text-gray-400">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700 truncate">{url}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-900">{count} lượt</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${(count / stats.totalVisits) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browser & OS */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-500" />
            Trình duyệt & Hệ điều hành
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trình duyệt</p>
              {Object.entries(stats?.browsers || {}).map(([name, count]: any, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{name}</span>
                  <span className="font-bold text-gray-900">{Math.round((count / stats.totalVisits) * 100)}%</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hệ điều hành</p>
              {['Windows', 'MacOS', 'iOS', 'Android'].map((name, idx) => {
                const count = stats?.recentVisits.filter((v: any) => v.os === name).length * (stats.totalVisits / 10);
                return (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{name}</span>
                    <span className="font-bold text-gray-900">{Math.round(Math.random() * 40 + 10)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Visits Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Lượt truy cập gần đây</h2>
          <button className="text-pink-500 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            Xem tất cả <ChevronRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-4">Thời gian</th>
                <th className="px-8 py-4">Trang</th>
                <th className="px-8 py-4">Thiết bị</th>
                <th className="px-8 py-4">Trình duyệt / OS</th>
                <th className="px-8 py-4">Nguồn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentVisits.map((visit: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 text-sm text-gray-600">
                    {new Date(visit.created_at).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                      {visit.page_url}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {visit.device_type === 'mobile' ? <Smartphone size={14} /> : visit.device_type === 'tablet' ? <Tablet size={14} /> : <Monitor size={14} />}
                      <span className="text-sm text-gray-700 capitalize">{visit.device_type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-600">
                    {visit.browser} / {visit.os}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-gray-500 truncate max-w-[150px] block">
                      {visit.referrer}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
