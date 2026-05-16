import { SEOFields } from "./seo";

export function generateOrganizationSchema(general: any, social: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": general?.agency_name || "August Agency",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://viz.io.vn",
    "logo": general?.logo_url || `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": general?.phone,
      "contactType": "customer service",
      "areaServed": "VN",
      "availableLanguage": ["Vietnamese", "English"]
    },
    "sameAs": [
      social?.facebook,
      social?.instagram,
      social?.linkedin,
      social?.youtube,
    ].filter(Boolean)
  };
}

export function generateArticleSchema(post: any) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://viz.io.vn";
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.seo_title || post.title_vi,
    "description": post.seo_description || post.excerpt_vi,
    "image": post.og_image || post.image_url,
    "datePublished": post.published_at || post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "author": {
      "@type": "Organization",
      "name": "August Agency",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "August Agency",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/magazine/${post.slug}`
    }
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item.startsWith("http") ? item.item : `${process.env.NEXT_PUBLIC_SITE_URL}${item.item}`
    }))
  };
}
