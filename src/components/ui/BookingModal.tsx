"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Users, Phone, User, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    client: string;
  };
}

export default function BookingModal({ isOpen, onClose, project }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    phone: "",
    booking_date: "",
    booking_time: "",
    guests: 2,
    note: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("bookings")
      .insert([
        {
          ...formData,
          project_id: project.id,
          status: 'pending'
        }
      ]);

    setIsSubmitting(false);
    if (!error) {
      setIsSuccess(true);
      toast("Đặt bàn thành công! Chúng tôi sẽ liên hệ lại sớm.", "success");
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({
          client_name: "",
          email: "",
          phone: "",
          booking_date: "",
          booking_time: "",
          guests: 2,
          note: ""
        });
      }, 3000);
    } else {
      toast("Lỗi: " + error.message, "error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gray-900 p-8 text-white relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <span className="text-pink-500 font-bold uppercase tracking-widest text-xs mb-2 block">Reservation</span>
              <h2 className="text-3xl font-headline">Đặt bàn tại {project.client}</h2>
            </div>

            <div className="p-8">
              {isSuccess ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-headline text-gray-900">Đặt bàn thành công!</h3>
                  <p className="text-gray-500">Cảm ơn bạn. Đội ngũ {project.client} sẽ liên hệ xác nhận trong giây lát.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Họ và tên *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          required
                          type="text" 
                          placeholder="Nguyễn Văn A"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-pink-500 focus:ring-1 transition-all outline-none"
                          value={formData.client_name}
                          onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Số điện thoại *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          required
                          type="tel" 
                          placeholder="0901 234 567"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-pink-500 focus:ring-1 transition-all outline-none"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Ngày đặt *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          required
                          type="date" 
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-pink-500 focus:ring-1 transition-all outline-none"
                          value={formData.booking_date}
                          onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Giờ đặt *</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          required
                          type="time" 
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-pink-500 focus:ring-1 transition-all outline-none"
                          value={formData.booking_time}
                          onChange={(e) => setFormData({...formData, booking_time: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Số người</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select 
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-pink-500 focus:ring-1 transition-all outline-none appearance-none"
                          value={formData.guests}
                          onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <option key={n} value={n}>{n} người</option>
                          ))}
                          <option value={11}>Trên 10 người</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Email (Không bắt buộc)</label>
                      <input 
                        type="email" 
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-pink-500 focus:ring-1 transition-all outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Ghi chú thêm</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 text-gray-400" size={16} />
                      <textarea 
                        rows={3}
                        placeholder="Yêu cầu đặc biệt (Ví dụ: bàn gần cửa sổ, tiệc sinh nhật...)"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-pink-500 focus:ring-1 transition-all outline-none resize-none"
                        value={formData.note}
                        onChange={(e) => setFormData({...formData, note: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-pink-500 transition-all shadow-xl shadow-gray-200 disabled:opacity-70 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Xác nhận đặt bàn"
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
