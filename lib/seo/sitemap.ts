import { connectDB } from "@/lib/db/connection"
import { Product } from "@/lib/db/models/product"
import { Collection } from "@/lib/db/models/collection"

export async function generateSitemap() {
  try {
    await connectDB()

    const [products, collections] = await Promise.all([
      Product.find({ status: "active" }, "slug updatedAt").lean(),
      Collection.find({}, "slug updatedAt").lean(),
    ])

    const productUrls = products.map((product: any) => ({
      url: `https://organicbazaar.com/products/${product.slug}`,
      lastmod: product.updatedAt,
      changefreq: "weekly",
      priority: 0.8,
    }))

    const collectionUrls = collections.map((collection: any) => ({
      url: `https://organicbazaar.com/collections/${collection.slug}`,
      lastmod: collection.updatedAt,
      changefreq: "weekly",
      priority: 0.7,
    }))

    const staticUrls = [
      {
        url: "https://organicbazaar.com/",
        lastmod: new Date(),
        changefreq: "daily",
        priority: 1.0,
      },
      {
        url: "https://organicbazaar.com/products",
        lastmod: new Date(),
        changefreq: "daily",
        priority: 0.9,
      },
    ]

    return [...staticUrls, ...collectionUrls, ...productUrls]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return []
  }
}
