import type { MetadataRoute } from "next";
import { getSite } from "@/lib/data";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
