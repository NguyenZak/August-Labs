import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import ProjectDetailContent from "@/components/projects/ProjectDetailContent";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!project) return {};

  return constructMetadata({
    title: project.seo_title || `${project.client} | ${project.title_vi}`,
    description: project.seo_description || project.title_vi,
    image: project.og_image || project.image_url,
    url: `/projects/${project.slug}`,
    seo: {
      seo_title: project.seo_title,
      seo_description: project.seo_description,
      seo_keywords: project.seo_keywords,
      og_title: project.og_title,
      og_description: project.og_description,
      og_image: project.og_image,
      canonical_url: project.canonical_url,
      no_index: project.no_index,
      no_follow: project.no_follow,
    }
  });
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!project) {
    notFound();
  }

  const { data: related } = await supabase
    .from("projects")
    .select("*")
    .neq("id", project.id)
    .limit(2);

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.client,
    "description": project.title_vi,
    "image": project.image_url,
    "author": {
      "@type": "Organization",
      "name": "August Agency"
    }
  };

  return (
    <>
      <JsonLd data={projectSchema} />
      <ProjectDetailContent project={project} related={related || []} />
    </>
  );
}
