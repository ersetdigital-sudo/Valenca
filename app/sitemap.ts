import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...products.map((p) => ({
      url: `${site.url}/bayar/${p.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${site.url}/syarat-ketentuan`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${site.url}/kebijakan-privasi`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
