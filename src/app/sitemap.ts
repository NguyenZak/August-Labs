import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://viz.io.vn'
  
  // Basic pages
  const routes = ['', '/about', '/services', '/projects', '/contact', '/magazine'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  )

  // Dynamic projects
  const supabase = createClient();
  const { data: projects } = await supabase.from('projects').select('slug, updated_at');
  const projectRoutes = (projects || []).map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updated_at || new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Dynamic magazine posts
  const { data: posts } = await supabase.from('magazine_posts').select('slug, updated_at');
  const postRoutes = (posts || []).map((post) => ({
    url: `${baseUrl}/magazine/${post.slug}`,
    lastModified: post.updated_at || new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...projectRoutes, ...postRoutes]
}
