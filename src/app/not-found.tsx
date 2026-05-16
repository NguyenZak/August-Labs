import { createClient } from "@/utils/supabase/server";
import NotFoundContent from "@/components/layout/NotFoundContent";

export const metadata = {
  title: "404 - Page Not Found | August Agency",
  description: "Oops! The page you're looking for doesn't exist. Let's get you back on track.",
  robots: {
    index: false,
    follow: true,
  }
};

export default async function NotFound() {
  const supabase = await createClient();
  
  // Fetch some interesting posts to suggest
  const { data: relatedPosts } = await supabase
    .from("posts")
    .select("id, title_vi, slug, category")
    .eq("status", "published")
    .limit(2);

  return <NotFoundContent relatedPosts={relatedPosts || []} />;
}
