import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { connectDB } from "@/lib/db/connection"
import { Collection } from "@/lib/db/models/collection"
import { Product } from "@/lib/db/models/product"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import { ArrowRight, Leaf, Package, Truck, Zap } from "lucide-react"

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
        {/* CHANGE: Added prominent 20% sale banner at the top */}
        <section className="bg-gradient-to-r from-accent via-accent/90 to-accent/95 text-accent-foreground py-3 sticky top-16 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-4 text-center flex-wrap">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-semibold">Limited Time: Get 20% OFF site-wide</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-accent-foreground/80">Offer ends in:</span>
              <CountdownTimer initialDays={2} initialHours={10} />
            </div>
          </div>
        </section>

        {/* Hero Section - Premium gradient with tighter spacing */}
        <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-accent/3" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Content - CHANGE: Reduced gaps for tighter layout */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <Leaf className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">100% Certified Organic</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-tight">
                    <span className="text-foreground">Pure Organic</span>
                    <br />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Goodness
                    </span>
                  </h1>

                  <p className="text-base md:text-lg text-muted-foreground max-w-lg leading-snug">
                    Sustainably sourced, premium organic products for a healthier you and thriving planet.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-accent to-accent/90 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/products" className="group">
                      Shop Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-primary/30 text-foreground hover:bg-primary/5 transition-colors bg-transparent"
                  >
                    <Link href="#collections">Explore</Link>
                  </Button>
                </div>

                {/* Trust indicators - CHANGE: Tighter grid layout */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <div className="text-2xl font-bold text-primary">1000+</div>
                    <p className="text-xs text-muted-foreground">Happy Customers</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">100%</div>
                    <p className="text-xs text-muted-foreground">Organic Certified</p>
                  </div>
                </div>
              </div>

              {/* Right: Hero Image */}
              <div className="relative h-72 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/landing-page-hero-image.jpg"
                  alt="Fresh organic products including vegetables, herbs, and mushrooms"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section - CHANGE: Reduced padding and gap */}
        <section className="py-12 md:py-16 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground mb-1">100% Organic</h3>
                  <p className="text-sm text-muted-foreground">Certified organic, pesticide-free products.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground mb-1">Sustainable</h3>
                  <p className="text-sm text-muted-foreground">Eco-friendly packaging and ethical sourcing.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground mb-1">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">Free shipping on orders over Rs.1500.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collections Section - CHANGE: Tighter spacing and layout */}
        <section id="collections" className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-xs font-semibold text-primary">Collections</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                Explore Our Collections
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Carefully curated selections of premium organic products
              </p>
            </div>

            {collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serialCollections.map((collection: any, i: number) => (
                  <Link key={collection._id} href={`/collections/${collection.slug}`}>
                    <div className="group cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative aspect-video bg-muted overflow-hidden">
                        <Image
                          src={collection.image || (i === 0 ? "/organic-essentials.png": i === 1 ? "/seasonal-picks.png" : "/best-sellers.png" )}
                          alt={collection.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-colors duration-300 flex items-end justify-start p-5">
                          <div>
                            <h3 className="text-lg font-bold text-white text-balance">{collection.name}</h3>
                            <p className="text-white/70 text-xs mt-1">{collection.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No collections available yet.</p>
            )}
          </div>
        </section>

        {/* Featured Products Section - CHANGE: Tighter spacing */}
        <section className="py-16 md:py-20 bg-muted/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                <span className="text-xs font-semibold text-accent">Featured</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                Premium Selection
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Hand-picked organic products selected for quality and value
              </p>
            </div>

            {featuredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all duration-300"
                  >
                    <Link href="/products" className="group">
                      View All Products
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">No products available yet.</p>
            )}
          </div>
        </section>

        {/* Blog Preview Section - CHANGE: Tighter spacing */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-xs font-semibold text-primary">Insights</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                Organic Living Guide
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Expert tips and stories to help you live more sustainably
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="group cursor-pointer flex flex-col h-full rounded-lg border border-border/50 p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:bg-card/50">
                    <div className="inline-flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 flex-grow line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center text-primary font-semibold text-xs group-hover:translate-x-1 transition-transform">
                      Read More <ArrowRight className="w-3 h-3 ml-1.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
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

        {/* CTA Section - CHANGE: Tighter padding */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-primary/95 to-primary rounded-lg max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center space-y-4 px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground text-balance">
              Join Our Organic Community
            </h2>
            <p className="text-base text-primary-foreground/90 max-w-xl mx-auto">
              Get exclusive tips, new releases, and special offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center pt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2.5 rounded-lg bg-primary-foreground text-foreground placeholder:text-muted-foreground flex-1 max-w-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
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
    console.error("[v0] Error loading home page:", error)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">Failed to load page. Please try again later.</p>
      </main>
    )
  }
}
