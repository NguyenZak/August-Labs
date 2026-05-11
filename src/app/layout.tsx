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

import { getAllSettings } from "@/app/actions/settings";
import AnalyticsTracker from "@/components/layout/AnalyticsTracker";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSettings();
  const formatted = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const general = formatted.general || {};
  const seo = formatted.seo || {};

  return {
    title: seo.meta_title || `${general.agency_name || 'August Agency'} | Premium Digital Experiences`,
    description: seo.meta_description || 'A premium creative powerhouse elevating brands through cutting-edge design, strategic marketing, and state-of-the-art technology.',
    icons: {
      icon: general.favicon_url || '/favicon.ico',
      apple: general.favicon_url || '/favicon.ico',
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instagramSans.variable} ${instagramHeadline.variable} h-full antialiased`}
    >
      <body className={`${instagramSans.className} min-h-full flex flex-col bg-background text-foreground`}>
        <SettingsProvider>
          <AnalyticsTracker />
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
