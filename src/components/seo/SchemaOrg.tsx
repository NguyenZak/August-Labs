"use client";

import { useSettings } from "@/lib/context/SettingsContext";

export default function SchemaOrg() {
  const { general, social } = useSettings();
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": general?.agency_name || "August Agency",
    "url": "https://viz.io.vn",
    "logo": general?.logo_url,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": general?.phone,
      "contactType": "customer service"
    },
    "sameAs": [
      social?.instagram,
      social?.facebook,
      social?.linkedin,
      social?.youtube,
    ].filter(Boolean)
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
