import { Metadata } from "next";

export interface SEOFields {
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  no_index?: boolean;
  no_follow?: boolean;
}

interface GenerateMetadataProps {
  title: string;
  description?: string;
  image?: string;
  url: string;
  seo?: SEOFields;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
}

export function constructMetadata({
  title,
  description,
  image,
  url,
  seo,
  type = "website",
  publishedTime,
  authors,
}: GenerateMetadataProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://viz.io.vn";
  const fullUrl = url.startsWith("http") ? url : `${siteUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  
  const metaTitle = seo?.seo_title || title;
  const metaDescription = seo?.seo_description || description || "";
  const metaImage = seo?.og_image || image || `${siteUrl}/og-image.jpg`;

  const robots = {
    index: !seo?.no_index,
    follow: !seo?.no_follow,
    googleBot: {
      index: !seo?.no_index,
      follow: !seo?.no_follow,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: seo?.seo_keywords || [],
    alternates: {
      canonical: seo?.canonical_url || fullUrl,
    },
    robots,
    openGraph: {
      title: seo?.og_title || metaTitle,
      description: seo?.og_description || metaDescription,
      url: fullUrl,
      siteName: "August Agency",
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: "vi_VN",
      type,
      ...(publishedTime && { publishedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.og_title || metaTitle,
      description: seo?.og_description || metaDescription,
      images: [metaImage],
    },
  };
}
