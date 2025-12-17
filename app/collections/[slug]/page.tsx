import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { connectDB } from "@/lib/db/connection"
import { Collection } from "@/lib/db/models/collection"
import { Product } from "@/lib/db/models/product"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    await connectDB()
    const collection = await Collection.findOne({ slug }).lean()

    if (!collection) {
      return {
        title: "Collection Not Found",
        description: "The collection you are looking for does not exist.",
      }
    }

    return {
      title: collection.seoDescription || `${collection.name} - Organic Products`,
      description: collection.description,
      keywords: collection.seoKeywords,
      openGraph: {
        title: collection.name,
        description: collection.description,
        type: "website",
        images: collection.image ? [{ url: collection.image }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: collection.name,
        description: collection.description,
        images: collection.image ? [collection.image] : [],
      },
    }
  } catch (error) {
    return {
      title: "Collection",
      description: "View collection details",
    }
  }
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params

  try {
    await connectDB()

    const collection = await Collection.findOne({ slug }).lean()

    if (!collection) {
      notFound()
    }

    const products = await Product.find({
      collections: collection._id,
      status: "active",
    }).lean()

    const serializedProducts = products.map((p: any) => ({
      ...p,
      _id: String(p._id),
      variants: p.variants?.map((v: any) => ({ ...v, _id: String(v._id) })),
    }))

    const safeCollection = { ...collection, _id: String(collection._id) }

    return (
      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4 text-sm">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">{safeCollection.name}</span>
        </div>

        {/* Collection Header */}
        <section className="bg-muted/50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-foreground mb-4">{safeCollection.name}</h1>
            <p className="text-lg text-muted-foreground">{safeCollection.description}</p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
                {serializedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serializedProducts.map((product: any) => (
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
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products in this collection yet.</p>
                <Button asChild>
                  <Link href="/products">Browse All Products</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
    )
  } catch (error) {
    console.error("Error loading collection:", error)
    notFound()
  }
}
