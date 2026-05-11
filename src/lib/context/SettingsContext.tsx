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
      favicon_url: ""
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
          setSettings({ ...formatted, loading: false });
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
