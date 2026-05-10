"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Chọn mục tiêu quảng cáo." },
  { id: 2, title: "Thiết lập đối tượng khách hàng." },
  { id: 3, title: "Xác định ngân sách và thời gian." },
  { id: 4, title: "Thiết kế nội dung và hình ảnh." },
  { id: 5, title: "Phát hành và theo dõi hiệu quả." },
];

export default function Steps() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 max-w-2xl">
          <p className="text-pink-500 font-semibold text-sm uppercase tracking-wider mb-4">
            ĐƠN GIẢN HÓA QUY TRÌNH
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-headline tracking-tight text-gray-900"
          >
            Bắt đầu chiến dịch chỉ với 5 bước đơn giản.
          </motion.h2>
          <button className="mt-8 px-6 py-2.5 rounded-full border border-gray-300 text-gray-900 font-semibold hover:border-gray-900 transition-colors">
            Xem hướng dẫn chi tiết
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
          {/* Left: Phone Mockup */}
          <div className="flex-1 w-full max-w-sm mx-auto">
            <div className="relative aspect-[9/19] bg-white rounded-[40px] border-[12px] border-gray-900 shadow-2xl overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-3xl w-1/2 mx-auto z-20" />
              <div className="absolute inset-0 bg-gradient-vibrant p-1">
                <div className="w-full h-full bg-white rounded-[28px] overflow-hidden flex flex-col">
                  {/* Mock UI Header */}
                  <div className="h-14 border-b border-gray-100 flex items-center px-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="ml-3 w-24 h-3 bg-gray-200 rounded-full" />
                  </div>
                  {/* Mock Image */}
                  <div className="flex-1 bg-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-200" />
                    <div className="absolute bottom-4 right-4 bg-blue-500 text-white text-xs px-4 py-2 rounded font-bold shadow-lg">
                      Learn more
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Steps List */}
          <div className="flex-1 w-full">
            <div className="flex flex-col">
              {steps.map((step) => (
                <div
                  key={step.id}
                  onMouseEnter={() => setActiveStep(step.id)}
                  className={cn(
                    "py-6 border-b cursor-pointer transition-all duration-300",
                    activeStep === step.id 
                      ? "border-gray-900" 
                      : "border-gray-200"
                  )}
                >
                  <h3 className={cn(
                    "text-xl md:text-2xl font-semibold transition-colors duration-300",
                    activeStep === step.id ? "text-gray-900" : "text-gray-400"
                  )}>
                    Bước {step.id}: {step.title}
                  </h3>
                  {activeStep === step.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 text-gray-600"
                    >
                      Xác định rõ ràng mục tiêu kinh doanh của bạn. Bạn muốn tăng độ nhận diện thương hiệu, hay thu hút lượng truy cập vào trang web? August Agency sẽ giúp bạn thiết lập hướng đi chuẩn xác.
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
