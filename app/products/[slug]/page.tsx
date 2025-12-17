import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { connectDB } from "@/lib/db/connection";
import { Product } from "@/lib/db/models/product";
import { VariantSelector } from "@/components/variant-selector";
import { Card } from "@/components/ui/card";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ReviewForm } from "@/components/review-form";
import { ReviewsList } from "@/components/reviews-list";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    await connectDB();
    const product = await Product.findOne({ slug, status: "active" }).lean();

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The product you are looking for does not exist.",
      };
    }

    return {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description,
      keywords: product.seoKeywords,
      openGraph: {
        title: product.seoTitle || product.name,
        description: product.seoDescription || product.description,
        type: "website",
        images: product.images?.length > 0 ? [{ url: product.images[0] }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: product.seoTitle || product.name,
        description: product.seoDescription || product.description,
        images: product.images?.length > 0 ? [product.images[0]] : [],
      },
    };
  } catch (error) {
    return {
      title: "Product",
      description: "View product details",
    };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    await connectDB();

    let product: any = null;

    try {
      const query = Product.findOne({ slug, status: "active" })
        .populate("collections", "name slug")
        .lean();
      const dbResult = await query;

      if (!dbResult) {
        notFound();
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
      };
    } catch (err) {
      console.error("DB query failed for product page:", err);
      notFound();
    }

    const imageUrl =
      product.images?.[0] || "/placeholder.svg?height=600&width=600";

    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <a href="/" className="text-primary hover:underline">
              Home
            </a>
            <span className="mx-2 text-muted-foreground">/</span>
            <a href="/products" className="text-primary hover:underline">
              Products
            </a>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
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
                <div className="flex gap-2">
                  {product.images.slice(1, 4).map((img: any, i: number) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 bg-muted rounded cursor-pointer"
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${product.name} view ${i + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Collections */}
              {product.collections?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.collections.map((collection: any) => (
                    <a
                      key={collection._id}
                      href={`/collections/${collection.slug}`}
                      className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                    >
                      {collection.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Variant Selection */}
              <Card className="p-6">
                <VariantSelector variants={product.variants} />

                {product.variants[0] && (
                  <div className="mt-6 pt-6 border-t">
                    <AddToCartButton
                      productId={product._id}
                      productName={product.name}
                      variant={product.variants[0]}
                    />
                  </div>
                )}
              </Card>

              {/* Trust Signals */}
              <div className="space-y-3 pt-4 border-t text-sm text-muted-foreground">
                <p>✓ 100% Organic</p>
                <p>✓ Sustainably Sourced</p>
                <p>✓ Free Shipping on Orders Over $50</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              brand: { "@type": "Brand", name: "Organic Store" },
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "USD",
                lowPrice: Math.min(
                  ...product.variants.map((v: any) => v.price)
                ),
                highPrice: Math.max(
                  ...product.variants.map((v: any) => v.price)
                ),
                offerCount: product.variants.length,
              },
            }),
          }}
        />
      </main>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
