import type { MetadataRoute } from "next";
import { getProducts, getSite } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, site] = await Promise.all([getProducts(), getSite()]);
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
      url: `${site.url}/cek-transaksi`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
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
