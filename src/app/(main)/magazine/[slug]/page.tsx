import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { generateArticleSchema } from "@/lib/schema";
import PostContent from "@/components/magazine/PostContent";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!post) return {};

  return constructMetadata({
    title: post.seo_title || post.title_vi,
    description: post.seo_description || post.excerpt_vi,
    image: post.og_image || post.image_url,
    url: `/magazine/${post.slug}`,
    type: "article",
    publishedTime: post.published_at,
    authors: [post.author],
    seo: {
      seo_title: post.seo_title,
      seo_description: post.seo_description,
      seo_keywords: post.seo_keywords,
      og_title: post.og_title,
      og_description: post.og_description,
      og_image: post.og_image,
      canonical_url: post.canonical_url,
      no_index: post.no_index,
      no_follow: post.no_follow,
    }
  });
}

export default async function MagazineDetailPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!post) {
    notFound();
  }

  const articleSchema = generateArticleSchema(post);

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <JsonLd data={articleSchema} />
      <PostContent post={post} />
    </main>
  );
}
