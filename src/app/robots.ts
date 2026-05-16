import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://viz.io.vn';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/adminz/',
          '/api/',
          '/private/',
          '/*?*', // Disallow query strings to prevent crawl budget waste and duplicate content
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
