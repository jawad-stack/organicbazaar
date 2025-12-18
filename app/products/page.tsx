import type { Metadata } from "next";
import { connectDB } from "@/lib/db/connection";
import { Product } from "@/lib/db/models/product";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Products - Organic Store",
  description:
    "Browse our complete selection of 100% organic, sustainably sourced products.",
  keywords: ["organic products", "sustainable", "eco-friendly"],
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ProductsPage() {
  try {
    await connectDB();
    const products = await Product.find({ status: "active" }).lean();
    const serializedProducts = products.map((p: any) => ({
      ...p,
      _id: String(p._id),
      variants: p.variants?.map((v: any) => ({ ...v, _id: String(v._id) })),
    }));

    return (
      <main className="min-h-screen bg-background">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="text-sm mb-6">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground">Products</span>
          </nav>

          <h1 className="text-4xl font-bold text-foreground mb-2">
            All Products
          </h1>
          <p className="text-muted-foreground">
            Discover our complete selection of organic products
          </p>
        </div>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serializedProducts.map((product: any) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  slug={product.slug}
                  images={product.images?.map((img: any) => {
                    const { _id, ...rest } = img;
                    return rest;
                  })}
                  variants={product.variants}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No products available yet.
              </p>
              <Button asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error loading products:", error);
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">
          Failed to load products. Please try again later.
        </p>
      </main>
    );
  }
}
