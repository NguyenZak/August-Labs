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

export const metadata: Metadata = {
  title: "August Agency | Premium Digital Experiences",
  description: "A premium creative powerhouse elevating brands through cutting-edge design, strategic marketing, and state-of-the-art technology.",
};

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
