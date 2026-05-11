"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  User, 
  MessageSquare, 
  Loader2, 
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useRef } from "react";
import { submitBooking } from "@/app/actions/bookings";




export default function BookingPortalPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { lang } = useLanguage();

  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const lunchScrollRef = useRef<HTMLDivElement>(null);
  const dinnerScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 200;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };


  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    phone: "",
    booking_date: "",
    booking_time: "",
    guests: 2,
    note: ""
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [quickDates, setQuickDates] = useState<any[]>([]);

  useEffect(() => {
    const dates = [];
    const now = new Date();
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      
      const dayName = date.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'short' });

      const dayNum = date.getDate();
      const monthNum = date.getMonth() + 1;
      const fullDate = date.toISOString().split('T')[0];
      
      dates.push({
        label: `${dayName}, ${dayNum}/${monthNum}`,
        value: fullDate,
        isToday: i === 0
      });
    }
    setQuickDates(dates);
  }, []);

  const lunchSlots = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"];
  const dinnerSlots = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];

  useEffect(() => {
    const fetchProject = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", params.slug)
        .single();
      
      if (data) {
        setProject(data);
      } else {
        router.push("/projects");
      }
      setIsLoading(false);
    };
    fetchProject();
  }, [params.slug]);

  const validatePhone = (phone: string) => {
    if (!phone) return true;
    const phoneRegex = /^(0|84|\+84)(3|5|7|8|9)([0-9]{8})$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      setPhoneError(lang === 'vi' ? "Số điện thoại không hợp lệ." : "Invalid phone number.");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");

    if (!formData.booking_date || !formData.booking_time) {

      toast(lang === 'vi' ? "Vui lòng chọn ngày và giờ đến." : "Please select date and time.", "error");
      return;
    }


    // Validation: Booking must be at least 30 minutes in the future
    const now = new Date();
    const bookingDateTime = new Date(`${formData.booking_date}T${formData.booking_time}`);
    const minBookingTime = new Date(now.getTime() + 30 * 60000);

    if (bookingDateTime < minBookingTime) {
      toast(lang === 'vi' ? "Vui lòng đặt trước giờ đến ít nhất 30 phút." : "Please book at least 30 minutes in advance.", "error");
      return;
    }

    if (!validatePhone(formData.phone)) {
      return;
    }




    setIsSubmitting(true);

    const result = await submitBooking({
      ...formData,
      project_id: project.id,
      brand_name: project.client
    });

    setIsSubmitting(false);
    if (result.success) {
      setIsSuccess(true);
      toast(lang === 'vi' ? "Đặt bàn thành công!" : "Booking successful!", "success");
    } else {
      toast("Lỗi: " + result.error, "error");
    }
  };


  const getMapSrc = (embedValue: string) => {
    if (!embedValue) return "";
    if (embedValue.includes('<iframe')) {
      const match = embedValue.match(/src="([^"]+)"/);
      return match ? match[1] : embedValue;
    }
    return embedValue;
  };

  const isTimeDisabled = (time: string) => {
    if (!formData.booking_date) return false;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (formData.booking_date !== today) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);
    
    const minTime = new Date(now.getTime() + 30 * 60000);
    return slotTime < minTime;
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 relative flex flex-col md:flex-row pt-20 md:pt-24">
      {/* Left side: Immersive Brand Visual */}
      <div className="relative w-full md:w-1/2 h-[50vh] md:h-[calc(100vh-6rem)] md:sticky md:top-24 overflow-hidden bg-gray-900">

        {project.image_url && (
          <img 
            src={project.image_url} 
            alt={project.client}
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent md:bg-gradient-to-r" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors group">
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              <span>{lang === 'vi' ? 'Quay lại dự án' : 'Back to brand story'}</span>
            </Link>

            <span className="text-pink-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">
              {lang === 'vi' ? 'Cổng đặt bàn trực tuyến' : 'Online Reservation Portal'}
            </span>

            <h1 className="text-5xl md:text-8xl font-headline text-white leading-none mb-6">
              {project.client}
            </h1>
            <div className="flex flex-col gap-4 text-white/60 text-sm">
              {project.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-pink-500 mt-0.5 shrink-0" />
                  <span>{project.address}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                {project.opening_hours && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-pink-500" />
                    <span>{lang === 'vi' ? 'Giờ mở cửa:' : 'Open:'} {project.opening_hours}</span>
                  </div>
                )}

                {project.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-pink-500" />
                    <span>{project.phone_number}</span>
                  </div>
                )}
              </div>
            </div>

            {project.google_maps_embed && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-8 w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <iframe
                  src={getMapSrc(project.google_maps_embed)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Right side: Premium Booking Form */}
      <div className="w-full md:w-1/2 min-h-screen bg-white md:rounded-l-[60px] relative z-10 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.3)]">
        <div className="flex-1">
          <div className="max-w-xl mx-auto px-6 py-12 md:py-20 md:px-12">

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-8"
                >
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={40} />
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-4xl font-headline text-gray-900">
                      {lang === 'vi' ? 'Đặt bàn thành công' : 'Booking Successful'}
                    </h2>
                    <p className="text-gray-500">
                      {lang === 'vi' 
                        ? <>Yêu cầu của bạn tại <span className="text-gray-900 font-bold">{project.client}</span> đã được ghi nhận.</>
                        : <>Your request at <span className="text-gray-900 font-bold">{project.client}</span> has been received.</>
                      }
                    </p>
                  </div>


                  <div className="bg-gray-50 rounded-[32px] p-8 max-w-sm mx-auto space-y-4 text-left border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        {lang === 'vi' ? 'Khách hàng' : 'Customer'}
                      </span>
                      <span className="text-gray-900 font-bold">{formData.client_name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        {lang === 'vi' ? 'Số điện thoại' : 'Phone'}
                      </span>
                      <span className="text-gray-900 font-bold">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        {lang === 'vi' ? 'Số khách' : 'Guests'}
                      </span>
                      <span className="text-gray-900 font-bold">{formData.guests} {lang === 'vi' ? 'người' : 'people'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        {lang === 'vi' ? 'Thời gian' : 'Time'}
                      </span>
                      <div className="text-right">
                        <p className="text-pink-500 font-bold">{formData.booking_time}</p>
                        <p className="text-gray-900 text-xs font-medium">
                          {new Date(formData.booking_date).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 flex flex-col gap-4">
                    <button 
                      onClick={() => router.push(`/projects/${project.slug}`)}
                      className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-pink-500 transition-all shadow-xl"
                    >
                      {lang === 'vi' ? 'Quay lại website' : 'Return to Website'}
                    </button>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="text-gray-400 font-bold hover:text-gray-900"
                    >
                      {lang === 'vi' ? 'Đặt bàn khác' : 'Make another reservation'}
                    </button>
                  </div>

                </motion.div>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-12"
                >
                  <div className="space-y-4">
                    <h2 className="text-4xl font-headline text-gray-900">
                      {lang === 'vi' ? 'Đặt bàn ngay' : 'Reserve a Table'}
                    </h2>
                    <p className="text-gray-500 text-lg">
                      {lang === 'vi' 
                        ? 'Vui lòng điền thông tin để chúng tôi chuẩn bị đón tiếp bạn tốt nhất.'
                        : 'Please fill in your information so we can provide you with the best service.'
                      }
                    </p>
                  </div>


                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Customer Info */}
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest border-b border-gray-100 pb-2">
                        {lang === 'vi' ? 'Thông tin cá nhân' : 'Personal Information'}
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="group space-y-2">
                          <label className="text-sm font-bold text-gray-400 group-focus-within:text-pink-500 transition-colors">
                            {lang === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                          </label>
                          <div className="relative">
                            <User className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-pink-500 transition-colors" size={20} />
                            <input 
                              required
                              type="text" 
                              placeholder={lang === 'vi' ? "Nguyễn Văn A" : "Your full name"}
                              className="w-full pl-8 pr-4 py-4 border-b-2 border-gray-100 focus:border-pink-500 bg-transparent transition-all outline-none text-xl font-medium"
                              value={formData.client_name}
                              onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="group space-y-2">
                          <label className="text-sm font-bold text-gray-400 group-focus-within:text-pink-500 transition-colors">
                            {lang === 'vi' ? 'Số điện thoại *' : 'Phone Number *'}
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-pink-500 transition-colors" size={20} />
                            <input 
                              required
                              type="tel" 
                              placeholder="09xx xxx xxx"
                              className={`w-full pl-8 pr-4 py-4 border-b-2 bg-transparent transition-all outline-none text-xl font-medium ${phoneError ? 'border-red-500' : 'border-gray-100 focus:border-pink-500'}`}
                              value={formData.phone}
                              onBlur={(e) => validatePhone(e.target.value)}
                              onChange={(e) => {
                                setFormData({...formData, phone: e.target.value});
                                if (phoneError) setPhoneError("");
                              }}
                            />

                            {phoneError && <p className="text-red-500 text-xs mt-1 font-medium">{phoneError}</p>}

                          </div>
                        </div>
                      </div>
                    </div>


                    {/* Booking Details */}
                    <div className="space-y-12 pt-4">
                      <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest border-b border-gray-100 pb-2">
                        {lang === 'vi' ? 'Chi tiết đặt chỗ' : 'Booking Details'}
                      </h3>
                      
                      {/* Date Section */}
                      <div className="space-y-4">
                          <label className="text-sm font-bold text-gray-400">
                            {lang === 'vi' ? 'Chọn ngày đến *' : 'Select Date *'}
                          </label>

                          
                          <div className="relative group/scroll">
                            <div ref={dateScrollRef} className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">

                              {quickDates.map((date) => (
                                <button
                                  key={date.value}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, booking_date: date.value });
                                    setShowDatePicker(false);
                                  }}
                                  className={`px-4 py-3 rounded-2xl text-sm font-bold border transition-all shrink-0 ${
                                    formData.booking_date === date.value && !showDatePicker
                                      ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-200"
                                      : "bg-gray-50 border-gray-100 text-gray-600 hover:border-pink-200"
                                  }`}
                                >
                                  <div className="text-[10px] uppercase opacity-60 mb-0.5">{date.isToday ? (lang === 'vi' ? 'Hôm nay' : 'Today') : date.label.split(',')[0]}</div>
                                  <div>{date.label.split(',')[1]}</div>
                                </button>

                              ))}
                              
                              <button
                                type="button"
                                onClick={() => setShowDatePicker(true)}
                                className={`px-4 py-3 rounded-2xl text-sm font-bold border transition-all flex flex-col items-center justify-center min-w-[80px] shrink-0 ${
                                  showDatePicker
                                    ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-200"
                                    : "bg-gray-50 border-gray-100 text-gray-600 hover:border-pink-200"
                                }`}
                              >
                                <Calendar size={14} className="mb-1" />
                                <span className="text-[10px] uppercase">{lang === 'vi' ? 'Lịch khác' : 'Others'}</span>
                              </button>

                            </div>
                            
                            <button 
                              type="button"
                              onClick={() => scroll(dateScrollRef, 'left')}
                              className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover/scroll:opacity-100 transition-opacity z-10 hidden md:flex border border-gray-100"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            
                            <button 
                              type="button"
                              onClick={() => scroll(dateScrollRef, 'right')}
                              className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover/scroll:opacity-100 transition-opacity z-10 hidden md:flex border border-gray-100"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>


                          {showDatePicker && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative group mt-4"
                            >
                              <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-pink-500" size={20} />
                              <input 
                                required
                                type="date" 
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full pl-8 pr-4 py-4 border-b-2 border-pink-500 bg-transparent transition-all outline-none font-medium text-xl"
                                value={formData.booking_date}
                                onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
                              />
                            </motion.div>
                          )}
                        </div>
                        <div className="space-y-6">
                          <label className="text-sm font-bold text-gray-400">
                            {lang === 'vi' ? 'Chọn giờ đến *' : 'Select Time *'}
                          </label>
                          
                          <div className="space-y-4">
                            {/* Lunch Slots */}
                            <div className="space-y-2">
                              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-1">
                                {lang === 'vi' ? 'Buổi trưa' : 'Lunch'}
                              </div>

                              <div className="relative group/scroll">
                                <div ref={lunchScrollRef} className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">

                                  {lunchSlots.map((time) => {
                                    const disabled = isTimeDisabled(time);
                                    return (
                                      <button
                                        key={time}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => setFormData({ ...formData, booking_time: time })}
                                        className={`px-5 py-3 rounded-2xl text-sm font-bold border transition-all whitespace-nowrap shrink-0 ${
                                          formData.booking_time === time
                                            ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-200"
                                            : disabled
                                            ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50"
                                            : "bg-gray-50 border-gray-100 text-gray-600 hover:border-pink-200"
                                        }`}
                                      >
                                        {time}
                                      </button>
                                    );
                                  })}
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => scroll(lunchScrollRef, 'left')}
                                  className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover/scroll:opacity-100 transition-opacity z-10 hidden md:flex border border-gray-100"
                                >
                                  <ChevronLeft size={16} />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => scroll(lunchScrollRef, 'right')}
                                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover/scroll:opacity-100 transition-opacity z-10 hidden md:flex border border-gray-100"
                                >
                                  <ChevronRight size={16} />
                                </button>
                              </div>

                            </div>

                            {/* Dinner Slots */}
                            <div className="space-y-2">
                              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-1">
                                {lang === 'vi' ? 'Buổi tối' : 'Dinner'}
                              </div>

                              <div className="relative group/scroll">
                                <div ref={dinnerScrollRef} className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">

                                  {dinnerSlots.map((time) => {
                                    const disabled = isTimeDisabled(time);
                                    return (
                                      <button
                                        key={time}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => setFormData({ ...formData, booking_time: time })}
                                        className={`px-5 py-3 rounded-2xl text-sm font-bold border transition-all whitespace-nowrap shrink-0 ${
                                          formData.booking_time === time
                                            ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-200"
                                            : disabled
                                            ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50"
                                            : "bg-gray-50 border-gray-100 text-gray-600 hover:border-pink-200"
                                        }`}
                                      >
                                        {time}
                                      </button>
                                    );
                                  })}
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => scroll(dinnerScrollRef, 'left')}
                                  className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover/scroll:opacity-100 transition-opacity z-10 hidden md:flex border border-gray-100"
                                >
                                  <ChevronLeft size={16} />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => scroll(dinnerScrollRef, 'right')}
                                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover/scroll:opacity-100 transition-opacity z-10 hidden md:flex border border-gray-100"
                                >
                                  <ChevronRight size={16} />
                                </button>
                              </div>

                            </div>
                          </div>

                          <div className="relative group pt-2">
                            <Clock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-pink-500 transition-colors" size={20} />
                            <input 
                              required
                              type="time" 
                              className="w-full pl-8 pr-4 py-4 border-b-2 border-gray-100 focus:border-pink-500 bg-transparent transition-all outline-none font-medium"
                              value={formData.booking_time}
                              onChange={(e) => setFormData({...formData, booking_time: e.target.value})}
                            />
                          </div>
                        </div>

                      <div className="group space-y-2">
                        <label className="text-sm font-bold text-gray-400 group-focus-within:text-pink-500 transition-colors">
                          {lang === 'vi' ? 'Số lượng khách' : 'Number of Guests'}
                        </label>
                        <div className="relative">
                          <Users className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-pink-500 transition-colors" size={20} />
                          <select 
                            className="w-full pl-8 pr-4 py-4 border-b-2 border-gray-100 focus:border-pink-500 bg-transparent transition-all outline-none appearance-none font-medium"
                            value={formData.guests}
                            onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                          >
                            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                              <option key={n} value={n}>{n} {lang === 'vi' ? 'người' : (n === 1 ? 'person' : 'people')}</option>
                            ))}
                            <option value={11}>{lang === 'vi' ? 'Trên 10 người' : 'More than 10'}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <label className="text-sm font-bold text-gray-400">
                        {lang === 'vi' ? 'Yêu cầu đặc biệt' : 'Special Requests'}
                      </label>
                      <textarea 
                        rows={3}
                        placeholder={lang === 'vi' ? "Ví dụ: Trang trí sinh nhật, bàn ngoài trời..." : "Example: Birthday decoration, outdoor table..."}
                        className="w-full p-6 rounded-[24px] bg-gray-50 border-2 border-transparent focus:border-pink-500 focus:bg-white transition-all outline-none resize-none font-medium"
                        value={formData.note}
                        onChange={(e) => setFormData({...formData, note: e.target.value})}
                      />
                    </div>


                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gray-900 text-white py-6 rounded-full text-xl font-bold flex items-center justify-center gap-3 hover:bg-pink-500 transition-all shadow-2xl shadow-gray-200 disabled:opacity-70 active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <>
                          {lang === 'vi' ? 'Xác nhận yêu cầu' : 'Confirm Reservation'}
                          <ChevronRight size={24} />
                        </>

                      )}
                    </button>

                    <p className="text-center text-gray-400 text-sm">
                      {lang === 'vi' 
                        ? 'Bằng cách nhấn xác nhận, bạn đồng ý với chính sách đặt chỗ và điều khoản dịch vụ của chúng tôi.'
                        : 'By clicking confirm, you agree to our booking policy and terms of service.'
                      }
                    </p>

                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-widest">
          <span>Powered by August Agency</span>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-pink-500 transition-colors">Support</Link>
            <Link href="/privacy" className="hover:text-pink-500 transition-colors">Privacy</Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate ease-in-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e1e1e1;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
