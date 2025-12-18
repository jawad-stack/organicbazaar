import { connectDB } from "@/lib/db/connection"
import { Product } from "@/lib/db/models/product"
import { Collection } from "@/lib/db/models/collection"
import { BlogPost } from "@/lib/db/models/blog"

export async function generateSitemap() {
  try {
    await connectDB()

    const [products, collections, blogPosts] = await Promise.all([
      Product.find({ status: "active" }, "slug updatedAt").lean(),
      Collection.find({}, "slug updatedAt").lean(),
      BlogPost.find({ status: "published" }, "slug publishedAt updatedAt").lean(),
    ])

    const productUrls = products.map((product: any) => ({
      url: `https://organicbazaar.online/products/${product.slug}`,
      lastmod: product.updatedAt,
      changefreq: "weekly",
      priority: 0.8,
    }))

    const collectionUrls = collections.map((collection: any) => ({
      url: `https://organicbazaar.online/collections/${collection.slug}`,
      lastmod: collection.updatedAt,
      changefreq: "weekly",
      priority: 0.7,
    }))

    const blogUrls = blogPosts.map((post: any) => ({
      url: `https://organicbazaar.online/blog/${post.slug}`,
      lastmod: post.updatedAt || post.publishedAt,
      changefreq: "weekly",
      priority: 0.6,
    }))

    const staticUrls = [
      {
        url: "https://organicbazaar.online/",
        lastmod: new Date(),
        changefreq: "daily",
        priority: 1.0,
      },
      {
        url: "https://organicbazaar.online/products",
        lastmod: new Date(),
        changefreq: "daily",
        priority: 0.9,
      },
      {
        url: "https://organicbazaar.online/blog",
        lastmod: new Date(),
        changefreq: "daily",
        priority: 0.8,
      },
      {
        url: "https://organicbazaar.online/about",
        lastmod: new Date(),
        changefreq: "monthly",
        priority: 0.5,
      },
      {
        url: "https://organicbazaar.online/contact",
        lastmod: new Date(),
        changefreq: "monthly",
        priority: 0.5,
      },
    ]

    return [...staticUrls, ...collectionUrls, ...productUrls, ...blogUrls]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return []
  }
}
