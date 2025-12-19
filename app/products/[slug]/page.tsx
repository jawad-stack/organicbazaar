import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { connectDB } from "@/lib/db/connection"
import { Product } from "@/lib/db/models/product"
import { VariantSelector } from "@/components/variant-selector"
import { Card } from "@/components/ui/card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ReviewForm } from "@/components/review-form"
import { ReviewsList } from "@/components/reviews-list"
import { Check, Leaf, Package, Truck } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    await connectDB()
    const product = await Product.findOne({ slug, status: "active" }).lean()

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The product you are looking for does not exist.",
      }
    }

    return {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description,
      keywords: product.seoKeywords,
      openGraph: {
        title: product.seoTitle || product.name,
        description: product.seoDescription || product.description,
        type: "website",
        images:
          product.images?.length > 0
            ? [
                {
                  url: product.images?.[0]?.url || product.images?.[0],
                },
              ]
            : [],
      },
      twitter: {
        card: "summary_large_image",
        title: product.seoTitle || product.name,
        description: product.seoDescription || product.description,
        images: product.images?.length > 0 ? product.images?.map((item: any) => item.url) : [],
      },
    }
  } catch (error) {
    return {
      title: "Product",
      description: "View product details",
    }
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  try {
    await connectDB()

    let product: any = null

    try {
      const query = Product.findOne({ slug, status: "active" }).populate("collections", "name slug").lean()
      const dbResult = await query

      if (!dbResult) {
        notFound()
      }

      product = {
        ...dbResult,
        _id: String(dbResult._id),
        variants: dbResult.variants?.map((v: any) => ({
          ...v,
          _id: String(v._id),
        })),
        collections: dbResult.collections?.map((c: any) => ({
          ...c,
          _id: String(c._id),
        })),
      }
    } catch (err) {
      console.error("DB query failed for product page:", err)
      notFound()
    }

    const imageUrl = product.images?.[0]?.url || product.images?.[0] || "/placeholder.svg?height=600&width=600"

    return (
      <main className="min-h-screen bg-background">
        {/* CHANGE: Tighter top padding and breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          {/* Breadcrumb - simplified and tighter */}
          <nav className="mb-6 text-xs">
            <a href="/" className="text-primary hover:underline">
              Home
            </a>
            <span className="mx-1.5 text-muted-foreground">/</span>
            <a href="/products" className="text-primary hover:underline">
              Products
            </a>
            <span className="mx-1.5 text-muted-foreground">/</span>
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>

          {/* CHANGE: Media-first layout with tighter spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Product Images - Gallery with carousel */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.slice(0, 4).map((img: any, i: number) => (
                    <div
                      key={i}
                      className="relative w-16 h-16 bg-muted rounded flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                    >
                      <Image
                        src={img?.url || img || "/placeholder.svg"}
                        alt={`${product.name} view ${i + 1}`}
                        fill
                        className="object-cover rounded"
                        sizes="100px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details - Optimized for conversions */}
            <div className="flex flex-col gap-5">
              {/* Title and rating section */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">{product.name}</h1>
                <p className="text-base text-muted-foreground line-clamp-3">{product.description}</p>
              </div>

              {/* Collections - CHANGE: Tighter display */}
              {product.collections?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.collections.map((collection: any) => (
                    <a
                      key={collection._id}
                      href={`/collections/${collection.slug}`}
                      className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {collection.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Variant Selection and Add to Cart */}
              <Card className="p-5 border-primary/10">
                <VariantSelector variants={product.variants} />

                {product.variants[0] && (
                  <div className="mt-5 pt-5 border-t border-border/50">
                    <AddToCartButton productId={product._id} productName={product.name} variant={product.variants[0]} />
                  </div>
                )}
              </Card>

              {/* Trust Signals - CHANGE: Condensed icon layout */}
              <div className="space-y-2.5 pt-3 border-t border-border/50">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    100% Certified Organic - No synthetic pesticides
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Leaf className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Sustainably sourced and ethically produced</span>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Eco-friendly packaging, plastic-free shipping</span>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Free shipping on orders over Rs.1500</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - CHANGE: Tighter spacing */}
        <div id="reviews" className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Customer Reviews</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reviews List */}
            <div className="lg:col-span-2">
              <ReviewsList productId={String(product._id)} />
            </div>

            {/* Review Form */}
            <div>
              <ReviewForm productId={String(product._id)} />
            </div>
          </div>
        </div>

        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              description: product.description,
              image: imageUrl,
              brand: { "@type": "Brand", name: "Organic Bazaar" },
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "INR",
                lowPrice: Math.min(...product.variants.map((v: any) => v.price)),
                highPrice: Math.max(...product.variants.map((v: any) => v.price)),
                offerCount: product.variants.length,
              },
            }),
          }}
        />
      </main>
    )
  } catch (error) {
    console.error("Error loading product:", error)
    notFound()
  }
}
