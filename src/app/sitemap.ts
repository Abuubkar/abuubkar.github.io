import type { MetadataRoute } from "next";
import { siteConfig, siteUrl } from "@/config/site";

// Required under `output: "export"` — the build errors without it.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // No lastModified: a build-time stamp would mark every deploy as a
      // content change, which erodes the signal's credibility with crawlers.
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}${siteConfig.labs.href}`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
