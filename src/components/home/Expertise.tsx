"use client";

import { motion } from "framer-motion";

const goals = [
  {
    title: "Tăng độ nhận diện.",
    description: "Tiếp cận những người có khả năng chú ý đến thương hiệu của bạn, cho họ biết bạn là ai và bạn làm gì.",
  },
  {
    title: "Thu hút khách hàng.",
    description: "Khuyến khích mọi người tìm hiểu thêm về doanh nghiệp của bạn, tương tác qua tin nhắn hoặc truy cập website.",
  },
  {
    title: "Xây dựng doanh số.",
    description: "Chuyển đổi sự quan tâm thành hành động thực tế, giúp bạn gia tăng doanh số và khách hàng thân thiết.",
  },
];

export default function Expertise() {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 max-w-3xl">
          <p className="text-pink-500 font-semibold text-sm uppercase tracking-wider mb-4">
            ĐÁP ỨNG MỤC TIÊU CỦA BẠN
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-headline tracking-tight text-gray-900"
          >
            Đạt được kết quả thực sự trên mọi điểm chạm khách hàng.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-4">
                {goal.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {goal.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
