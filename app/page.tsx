import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { connectDB } from "@/lib/db/connection"
import { Collection } from "@/lib/db/models/collection"
import { Product } from "@/lib/db/models/product"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Package, Truck } from "lucide-react"

export const metadata: Metadata = {
  title: "Organic Bazaar - Premium 100% Organic Products Online",
  description:
    "Discover premium 100% certified organic, sustainably sourced products at Organic Bazaar. Shop wellness, beauty, and lifestyle items for a healthier you and better planet.",
  keywords: [
    "organic products",
    "sustainable shopping",
    "eco-friendly",
    "natural products",
    "organic bazaar",
    "buy organic online",
    "certified organic",
  ],
  openGraph: {
    title: "Organic Bazaar - Premium 100% Organic Products Online",
    description: "Discover premium 100% certified organic, sustainably sourced products.",
    type: "website",
    siteName: "Organic Bazaar",
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
      <main className="bg-background">
        {/* Hero Section - Premium gradient typography inspired by modern fintech */}
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">100% Certified Organic</span>
                  </div>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
                    <span className="text-foreground">Pure Organic</span>
                    <br />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Goodness
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                    Sustainably sourced, premium organic products for a healthier you and a thriving planet. Experience
                    the difference of pure quality.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-accent to-accent/90 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/products" className="group">
                      Shop Now
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-primary/30 text-foreground hover:bg-primary/5 transition-colors duration-200 bg-transparent"
                  >
                    <Link href="#collections">Explore Collections</Link>
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border/50">
                  <div>
                    <div className="text-3xl font-bold text-primary">1000+</div>
                    <p className="text-sm text-muted-foreground">Happy Customers</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent">100%</div>
                    <p className="text-sm text-muted-foreground">Organic Certified</p>
                  </div>
                </div>
              </div>

              {/* Right: Hero Image */}
              <div className="relative h-80 md:h-96 lg:h-full min-h-80 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Organic products showcase"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">100% Organic</h3>
                  <p className="text-muted-foreground">Certified organic, pesticide-free products for your wellness.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Sustainable</h3>
                  <p className="text-muted-foreground">Eco-friendly packaging and ethical sourcing practices.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Fast Delivery</h3>
                  <p className="text-muted-foreground">Free shipping on orders over Rs.1500 with tracking.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section id="collections" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium text-primary">Collections</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
                Explore Our Collections
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Carefully curated selections of premium organic products for every lifestyle
              </p>
            </div>

            {collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serialCollections.map((collection: any) => (
                  <Link key={collection._id} href={`/collections/${collection.slug}`}>
                    <div className="group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative aspect-video bg-muted overflow-hidden">
                        <Image
                          src={collection.image || "/placeholder.svg?height=300&width=400"}
                          alt={collection.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-colors duration-300 flex items-end justify-start p-6">
                          <div>
                            <h3 className="text-2xl font-bold text-white text-balance">{collection.name}</h3>
                            <p className="text-white/80 text-sm mt-1">{collection.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">No collections available yet.</p>
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 md:py-28 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <span className="text-sm font-medium text-accent">Featured</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
                Premium Selection
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hand-picked organic products selected for quality and value
              </p>
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

                <div className="text-center mt-16">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all duration-300"
                  >
                    <Link href="/products" className="group">
                      View All Products
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-12">No products available yet.</p>
            )}
          </div>
        </section>

        {/* Blog Preview Section */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium text-primary">Insights</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Organic Living Guide</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Expert tips and stories to help you live more sustainably
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "The Benefits of Organic Living",
                  excerpt: "Discover how switching to organic products improves your health and the environment.",
                  category: "Wellness",
                },
                {
                  title: "Sustainable Practices for Daily Life",
                  excerpt: "Simple steps to reduce your carbon footprint and live more sustainably.",
                  category: "Sustainability",
                },
                {
                  title: "Understanding Organic Certifications",
                  excerpt: "Learn what certified organic really means and why it matters for your purchases.",
                  category: "Education",
                },
              ].map((article, idx) => (
                <Link key={idx} href="/blog">
                  <div className="group cursor-pointer flex flex-col h-full rounded-lg border border-border/50 p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:bg-card/50">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-grow text-sm leading-relaxed">{article.excerpt}</p>
                    <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/30 text-foreground hover:bg-primary/5 transition-colors bg-transparent"
              >
                <Link href="/blog">All Articles</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-r from-primary/90 to-primary rounded-2xl mx-4 md:mx-8 lg:mx-4 max-w-7xl lg:max-w-6xl xl:max-w-7xl mx-auto mb-8">
          <div className="relative z-10 text-center space-y-6 px-4 sm:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground text-balance">
              Join Thousands Living Organically
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Get exclusive tips, new product releases, and special offers delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-lg bg-primary-foreground text-foreground placeholder:text-muted-foreground flex-1 max-w-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              />
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto transition-all duration-300"
              >
                Subscribe
              </Button>
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
