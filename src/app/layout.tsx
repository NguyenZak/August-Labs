import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const instagramSans = localFont({
  src: [
    {
      path: "../../public/fonts/Instagram Sans Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Instagram Sans.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Instagram Sans Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Instagram Sans Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-instagram-sans",
});

const instagramHeadline = localFont({
  src: "../../public/fonts/Instagram Sans Headline.otf",
  variable: "--font-instagram-headline",
});

import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { ToastProvider } from "@/context/ToastContext";
import { SettingsProvider } from "@/lib/context/SettingsContext";

import { constructMetadata } from "@/lib/seo";
import { getAllSettings } from "@/app/actions/settings";
import AnalyticsTracker from "@/components/layout/AnalyticsTracker";
import JsonLd from "@/components/seo/JsonLd";
import { generateOrganizationSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSettings();
  const formatted = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const general = formatted.general || {};
  const seo = formatted.seo || {};

  return constructMetadata({
    title: seo.meta_title || `${general.agency_name || 'August Agency'} | Premium Digital Experiences`,
    description: seo.meta_description || 'A premium creative powerhouse elevating brands through cutting-edge design, strategic marketing, and state-of-the-art technology.',
    url: '/',
    seo: {
      seo_title: seo.meta_title,
      seo_description: seo.meta_description,
      og_image: seo.og_image,
    }
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getAllSettings();
  const formatted = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const organizationSchema = generateOrganizationSchema(formatted.general, formatted.social);

  return (
    <html
      lang="vi"
      className={`${instagramSans.variable} ${instagramHeadline.variable} h-full antialiased`}
    >
      <body className={`${instagramSans.className} min-h-full flex flex-col bg-background text-foreground`}>
        <SettingsProvider>
          <AnalyticsTracker />
          <JsonLd data={organizationSchema} />
          <LanguageProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </LanguageProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}

