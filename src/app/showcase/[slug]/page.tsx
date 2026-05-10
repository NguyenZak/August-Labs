import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { MapPin, Clock, Phone, Maximize2, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProjectShowcase({ params }: { params: { slug: string } }) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // 1. Fetch Project by Subdomain (or fallback to slug)
  // We use a safe approach to avoid crashing if columns are missing
  let project = null;

  try {
    // Try by Subdomain first
    const { data: subData } = await supabase
      .from("projects")
      .select("*")
      .eq("subdomain", params.slug)
      .maybeSingle();
    
    project = subData;

    // Fallback to Slug if not found by Subdomain
    if (!project) {
      const { data: slugData } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", params.slug)
        .maybeSingle();
      project = slugData;
    }
  } catch (error) {
    console.error("Showcase Fetch Error:", error);
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ImageIcon className="text-gray-300" size={40} />
        </div>
        <h1 className="text-2xl font-headline text-gray-900 mb-2">Không tìm thấy nhà hàng</h1>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto">
          Đường dẫn hoặc tên miền phụ này không tồn tại trong hệ thống của chúng tôi.
        </p>
        <Link href="/" className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const menuImages = project.menu_images || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src={project.image_url} 
          alt={project.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-7xl font-headline mb-4 drop-shadow-2xl">{project.title_vi || project.title}</h1>
          <div className="w-16 h-1 bg-pink-500 mx-auto rounded-full mb-6" />
          <p className="text-xl font-light opacity-90 uppercase tracking-[0.3em]">
            {project.category}
          </p>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="py-12 bg-gray-900 text-white sticky top-0 z-20 shadow-xl">
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-3">
            <MapPin className="text-pink-500" size={20} />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Địa chỉ</span>
              <span className="text-sm font-medium">Ho Chi Minh City, VN</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-pink-500" size={20} />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Giờ mở cửa</span>
              <span className="text-sm font-medium">10:00 AM - 11:00 PM</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-pink-500" size={20} />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Liên hệ</span>
              <span className="text-sm font-medium">090 123 4567</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Image Gallery */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-headline text-gray-900 mb-4 tracking-tight">Our Menu</h2>
            <p className="text-gray-500 italic">Khám phá hương vị đặc trưng của chúng tôi</p>
          </div>

          {menuImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuImages.map((img: string, idx: number) => (
                <div key={idx} className="group relative bg-white p-4 rounded-[32px] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="aspect-[3/4] rounded-[24px] overflow-hidden bg-gray-100 relative">
                    <img 
                      src={img} 
                      alt={`Menu Page ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 p-4 rounded-full text-gray-900 shadow-xl">
                        <Maximize2 size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trang {idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200">
              <ImageIcon className="text-gray-200 mb-4" size={64} />
              <p className="text-gray-400 font-medium">Menu đang được chuẩn bị. Vui lòng quay lại sau.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          A digital experience by August Agency
        </p>
      </footer>
    </div>
  );
}
