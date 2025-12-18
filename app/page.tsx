import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { connectDB } from "@/lib/db/connection"
import { Collection } from "@/lib/db/models/collection"
import { Product } from "@/lib/db/models/product"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Organic Products Store - Shop Pure & Sustainable",
  description:
    "Discover our curated selection of 100% organic, sustainably sourced products. From wellness to beauty, find premium quality items for a better lifestyle.",
  keywords: ["organic", "sustainable", "eco-friendly", "natural products"],
  openGraph: {
    title: "Organic Products Store - Shop Pure & Sustainable",
    description: "Discover our curated selection of 100% organic, sustainably sourced products.",
    type: "website",
    siteName: "Organic Store",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function HomePage() {
  try {
    await connectDB()

    const [collections, featuredProducts] = await Promise.all([
      Collection.find().lean(),
      Product.find({ status: "active" }).limit(6).lean(),
    ])
    const serialCollections = collections.map((c: any) => ({ ...c, _id: String(c._id) }))
    const serialFeatured = featuredProducts.map((p: any) => ({
      ...p,
      _id: String(p._id),
      variants: p.variants?.map((v: any) => ({ ...v, _id: String(v._id) })),
    }))

    return (
      <main className="bg-background min-h-screen">
        <section className="relative py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight text-balance animate-fade-in">
              Pure Organic Goodness
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty leading-relaxed animate-slide-up">
              Sustainably sourced, 100% organic products for a healthier you and a better planet
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button asChild size="lg" className="transition-all duration-200 hover:shadow-lg hover:scale-105">
                <Link href="/products">Shop All Products</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="transition-all duration-200 hover:bg-primary/5 bg-transparent"
              >
                <Link href="#collections">Browse Collections</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="collections" className="py-20 md:py-28 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Explore Collections</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Discover our carefully curated selections</p>
            </div>

            {collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serialCollections.map((collection: any) => (
                  <Link key={collection._id} href={`/collections/${collection.slug}`}>
                    <div className="group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                      <div className="relative aspect-video bg-muted overflow-hidden">
                        <Image
                          src={collection.image || "/placeholder.svg?height=300&width=400"}
                          alt={collection.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                          <h3 className="text-2xl font-bold text-white text-center px-4 text-balance">
                            {collection.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mt-3 line-clamp-2">{collection.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No collections available yet.</p>
            )}
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Featured Products</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Hand-picked selections for your wellness</p>
            </div>

            {featuredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {serialFeatured.map((product: any) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      slug={product.slug}
                      images={product.images}
                      variants={product.variants}
                    />
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="transition-all duration-200 hover:bg-primary/5 bg-transparent"
                  >
                    <Link href="/products">View All Products</Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground">No products available yet.</p>
            )}
          </div>
        </section>

        <section className="py-20 md:py-28 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-3">100%</div>
                <p className="text-primary-foreground/90">Certified Organic</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-3">♻</div>
                <p className="text-primary-foreground/90">Sustainable Packaging</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-3">🚚</div>
                <p className="text-primary-foreground/90">Free Shipping Over Rs.1500</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  } catch (error) {
    console.error("Error loading home page:", error)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Failed to load page. Please try again later.</p>
      </main>
    )
  }
}
