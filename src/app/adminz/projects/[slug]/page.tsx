import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import EditProjectForm from "./EditProjectForm";

export default async function EditProjectPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Try fetching by slug first
  let { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  // Fallback to ID if slug not found
  if (!project) {
    const { data: fallbackProject } = await supabase
      .from("projects")
      .select("*")
      .eq("id", resolvedParams.slug)
      .single();
    project = fallbackProject;
  }

  if (!project) {
    notFound();
  }

  return <EditProjectForm project={project} />;
}
