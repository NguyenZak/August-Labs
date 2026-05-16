import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://viz.io.vn';
  
  // Basic static pages
  const staticPages = [
    '',
    '/about',
    '/services',
    '/projects',
    '/contact',
    '/magazine',
    '/booking',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const supabase = await createClient();

  // Dynamic projects
  const { data: projects } = await supabase
    .from('projects')
    .select('slug, updated_at')
    .is('no_index', false);

  const projectRoutes = (projects || []).map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updated_at ? new Date(project.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Dynamic magazine posts
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .is('no_index', false);

  const postRoutes = (posts || []).map((post) => ({
    url: `${baseUrl}/magazine/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectRoutes, ...postRoutes];
}
