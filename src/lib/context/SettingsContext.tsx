"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getAllSettings } from "@/app/actions/settings";

interface SettingsContextType {
  general: {
    agency_name: string;
    email: string;
    phone: string;
    address: string;
    logo_url: string;
    footer_logo_url: string;
    favicon_url: string;
    apple_touch_icon: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  seo: {
    meta_title: string;
    meta_description: string;
  };
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<any>({
    general: { 
      agency_name: "August Agency", 
      email: "hello@augustagency.com", 
      phone: "", 
      address: "",
      logo_url: "",
      footer_logo_url: "",
      favicon_url: "",
      apple_touch_icon: ""
    },
    social: { facebook: "", instagram: "", linkedin: "", youtube: "" },
    seo: { meta_title: "", meta_description: "" },
    loading: true
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getAllSettings();
        if (data && data.length > 0) {
          const formatted = data.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
          }, {});
          setSettings((prev: any) => ({ ...prev, ...formatted, loading: false }));
        } else {
          setSettings((prev: any) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        setSettings((prev: any) => ({ ...prev, loading: false }));
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings.general?.favicon_url) {
      // Remove existing favicons
      const existingIcons = document.querySelectorAll("link[rel*='icon']");
      existingIcons.forEach(el => el.parentNode?.removeChild(el));

      // Add new favicon
      const link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = settings.general.favicon_url;
      document.head.appendChild(link);

      // Add shortcut icon for older browsers
      const shortcutLink = document.createElement('link');
      shortcutLink.rel = 'shortcut icon';
      shortcutLink.href = settings.general.favicon_url;
      document.head.appendChild(shortcutLink);
    }
    
    if (settings.seo?.meta_title) {
      document.title = settings.seo.meta_title;
    } else if (settings.general?.agency_name) {
      document.title = `${settings.general.agency_name} | Premium Digital Experiences`;
    }
  }, [settings.general?.favicon_url, settings.seo?.meta_title, settings.general?.agency_name]);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
