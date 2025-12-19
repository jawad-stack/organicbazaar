import type { Metadata } from "next"
import { connectDB } from "@/lib/db/connection"
import { Product } from "@/lib/db/models/product"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Shop All Products - 100% Organic | Organic Bazaar",
  description:
    "Browse our complete selection of 100% certified organic, sustainably sourced products. From wellness to beauty, find premium quality organic items.",
  keywords: [
    "organic products",
    "buy organic",
    "sustainable shopping",
    "eco-friendly products",
    "natural products",
    "organic wellness",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Shop All Products - 100% Organic | Organic Bazaar",
    description: "Browse our complete selection of 100% certified organic, sustainably sourced products.",
    type: "website",
    url: "https://organicbazaar.online/products",
  },
}

export default async function ProductsPage() {
  try {
    await connectDB()
    const products = await Product.find({ status: "active" }).lean()
    const serializedProducts = products.map((p: any) => ({
      ...p,
      _id: String(p._id),
      variants: p.variants?.map((v: any) => ({ ...v, _id: String(v._id) })),
    }))

    return (
      <main className="min-h-screen bg-background">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="text-sm mb-6" aria-label="Breadcrumb">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground" aria-current="page">
              Products
            </span>
          </nav>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">All Products</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover our complete selection of 100% organic, sustainably sourced products for a healthier lifestyle
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serializedProducts.map((product: any) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  slug={product.slug}
                  images={product.images?.map((img: any) => {
                    const { _id, ...rest } = img
                    return rest
                  })}
                  variants={product.variants}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products available yet.</p>
              <Button asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Organization schema for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "All Products",
              description: "Browse our complete selection of organic products",
              url: "https://organicbazaar.online/products",
              mainEntity: {
                "@type": "ItemList",
                itemListElement: serializedProducts.slice(0, 10).map((product: any, index: number) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: product.name,
                  url: `https://organicbazaar.online/products/${product.slug}`,
                })),
              },
            }),
          }}
        />
      </main>
    )
  } catch (error) {
    console.error("Error loading products:", error)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Failed to load products. Please try again later.</p>
      </main>
    )
  }
}
