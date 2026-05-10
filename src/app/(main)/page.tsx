import Hero from "@/components/home/Hero";
import Logos from "@/components/home/Logos";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Services from "@/components/home/Services";
import WhyUs from "@/components/home/WhyUs";

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <Hero />
      <Logos />
      <FeaturedProjects />
      <Services />
      <WhyUs />
    </main>
  );
}
