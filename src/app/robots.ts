import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

// Required under `output: "export"` — the build errors without it.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
