import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckoutForm } from "@/components/checkout-form"

export const metadata = {
  title: "Checkout - Organic Store",
  description: "Complete your order",
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <Link href="/cart" className="text-primary hover:underline">
            Cart
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">Checkout</span>
        </nav>

        <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

        {/* Checkout Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>

          {/* Cart Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-muted/50 p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-4">Order Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Review your items and shipping address before placing your order.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                ✓ Secure checkout with encrypted payment
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                ✓ Free shipping on orders over $50
              </p>
              <p className="text-sm text-muted-foreground">
                ✓ Money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
