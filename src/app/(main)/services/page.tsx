import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import ServicesContent from "@/components/services/ServicesContent";

export const metadata: Metadata = constructMetadata({
  title: "Dịch vụ Creative & Marketing | August Agency",
  description: "Khám phá các giải pháp sáng tạo từ Branding, Marketing đến Tech giúp nâng tầm thương hiệu của bạn.",
  url: "/services",
});

export default function ServicesPage() {
  return <ServicesContent />;
}
