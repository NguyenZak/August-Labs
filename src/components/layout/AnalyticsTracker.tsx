"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const trackVisit = async () => {
      const userAgent = navigator.userAgent;
      
      // Detect device type
      let deviceType = "desktop";
      if (/Mobi|Android|iPhone/i.test(userAgent)) {
        deviceType = "mobile";
      } else if (/Tablet|iPad/i.test(userAgent)) {
        deviceType = "tablet";
      }

      // Simple browser/OS detection
      let browser = "Unknown";
      if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
      else if (userAgent.indexOf("Safari") > -1) browser = "Safari";
      else if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
      else if (userAgent.indexOf("Edg") > -1) browser = "Edge";

      let os = "Unknown";
      if (userAgent.indexOf("Win") > -1) os = "Windows";
      else if (userAgent.indexOf("Mac") > -1) os = "MacOS";
      else if (userAgent.indexOf("Linux") > -1) os = "Linux";
      else if (userAgent.indexOf("Android") > -1) os = "Android";
      else if (userAgent.indexOf("like Mac") > -1) os = "iOS";

      try {
        await supabase.from("analytics").insert([{
          page_url: pathname,
          device_type: deviceType,
          browser: browser,
          os: os,
          referrer: document.referrer || "direct",
          user_agent: userAgent,
        }]);
      } catch (error) {
        // Silently fail to not disrupt user experience
        console.error("Analytics error:", error);
      }
    };

    trackVisit();
  }, [pathname, supabase]);

  return null;
}
