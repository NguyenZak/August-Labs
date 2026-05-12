"use client";

import { useSettings } from "@/lib/context/SettingsContext";

export default function SchemaOrg() {
  const { general, seo } = useSettings();
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": general?.agency_name || "August Agency",
    "url": "https://augustagency.vn", // Replace with real domain if available
    "logo": general?.logo_url,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": general?.phone,
      "contactType": "customer service"
    },
    "sameAs": [
      general?.instagram_url,
      general?.facebook_url,
      general?.linkedin_url
    ].filter(Boolean)
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
