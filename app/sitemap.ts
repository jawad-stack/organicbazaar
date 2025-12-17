import type { MetadataRoute } from "next"
import { generateSitemap } from "@/lib/seo/sitemap"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = await generateSitemap()

  return urls.map((item) => ({
    url: item.url,
    lastModified: new Date(item.lastmod),
    changeFrequency: item.changefreq as "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
    priority: item.priority,
  }))
}
